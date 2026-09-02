# Week — Problem, Backlog & Consistency

## 1. Team

**Project:** Salud Activa — Gestión de Turnos Médicos

**Team:** Distributed Systems — Group 2

The team is responsible for designing and implementing a distributed system for managing medical appointments, patients, professionals, and the availability of medical services.

---

## 2. Real Problem

### Problem Statement

Health institutions and patients often face difficulties when managing medical appointments manually or through disconnected systems.

The main problems identified are:

- Difficulty checking the availability of medical professionals.
- Risk of assigning the same appointment slot to multiple patients.
- Lack of centralized appointment information.
- Delays when updating appointment statuses.
- Poor communication between the different components of the system.
- Difficulty notifying users about important appointment events.

These problems can generate **duplicate appointments, incorrect availability information, missed appointments, and inefficient use of medical resources**.

### Proposed Solution

**Salud Activa** is a medical appointment management system that allows patients and healthcare professionals to manage the appointment process digitally.

For MVP 1, the system will focus on a reduced but complete **end-to-end workflow**, instead of implementing all the functionality of the final system.

The MVP will allow a patient to:

1. Register or access the system.
2. Consult available appointment slots.
3. Select an available slot.
4. Request/book an appointment.
5. Receive confirmation of the appointment.
6. View the appointment and its current status.

The system will be designed with distributed systems principles so that the architecture can evolve toward independent services in future iterations.

---

# 3. MVP 1 Scope

The first MVP will prioritize the **appointment booking workflow**.

### Core functionality

```text
Patient
   |
   v
View Availability
   |
   v
Select Appointment Slot
   |
   v
Create Appointment
   |
   v
Confirm Appointment
   |
   v
View Appointment Status
```

### Out of scope for MVP 1

The following functionality may be considered in future iterations:

- Complete medical history management.
- Payments.
- Advanced notifications.
- Reports and analytics.
- Complex administrative management.
- Integration with external healthcare systems.
- Full microservice decomposition.

---

# 4. Initial Backlog

| ID | User Story / Task | Priority | Component | Status |
|---|---|---|---|---|
| HU-01 | As a patient, I want to access the system so that I can manage my appointments. | High | Backend / Frontend | Pending |
| HU-02 | As a patient, I want to view available appointment slots so that I can choose a convenient time. | High | Backend / Frontend | Pending |
| HU-03 | As a patient, I want to book an available appointment so that I can receive medical attention. | Critical | Backend / Frontend | Pending |
| HU-04 | As a patient, I want to see my appointment status so that I know whether it is confirmed or pending. | High | Backend / Frontend | Pending |
| HU-05 | As the system, I want to prevent two patients from booking the same slot so that duplicate appointments are avoided. | Critical | Backend / Database | Pending |
| HU-06 | As the system, I want to confirm a successful booking so that the patient knows the appointment was registered. | High | Backend | Pending |
| HU-07 | As the team, we want to containerize the application so that the MVP can be executed consistently. | High | DevOps | Pending |
| HU-08 | As the team, we want to document the architecture and data decisions so that the system can evolve toward distributed services. | High | Documentation | Pending |

---

# 5. Core Operations

For MVP 1, the following operations are considered core:

1. **Consult appointment availability**
2. **Create/book an appointment**
3. **Confirm an appointment**
4. **Consult appointment status**

These operations are the most important because they directly support the main business workflow.

---

# 6. Consistency Requirements

Consistency defines how up-to-date and synchronized the data must be between the different components of the system.

For MVP 1, not every operation requires the same level of consistency.

| Core Operation | Required Consistency | Reason |
|---|---|---|
| Consult availability | Strong consistency | The patient must see information that is sufficiently current to avoid selecting an already occupied slot. |
| Book appointment | **Strong consistency** | Two patients must not be able to successfully book the same appointment slot. |
| Confirm appointment | Strong consistency for the appointment state | The confirmation must correspond to the actual result of the booking operation. |
| Consult appointment status | Eventual consistency can be acceptable | A short delay in displaying a status update does not necessarily invalidate the appointment itself. |

---

## 6.1 Booking an Appointment — Strong Consistency

The booking operation has the strictest consistency requirement.

Example:

```text
Patient A ---> Book slot 10:00
Patient B ---> Book slot 10:00
```

The system must guarantee that only one request succeeds.

Expected result:

```text
Patient A ---> Appointment CONFIRMED
Patient B ---> Appointment REJECTED
```

It would be incorrect for both patients to receive a successful booking.

Therefore:

> **Booking an appointment requires strong consistency.**

This can be supported through database transactions, constraints, and concurrency control.

---

# 7. Delivery Semantics

Delivery semantics define how communication between components should behave when events or messages are sent.

For MVP 1, the system will distinguish between **synchronous REST operations** and **asynchronous background operations**.

---

## 7.1 Synchronous Operations

REST APIs will be used for operations where the patient needs an immediate response.

Examples:

```text
Frontend ---> POST /appointments
Backend ---> Appointment created
Backend ---> HTTP 201 Created
Frontend ---> Show confirmation
```

For these operations, the user needs to know immediately whether the action succeeded or failed.

### Delivery characteristic

**Synchronous request-response**

The client sends a request and waits for the result.

Operations:

- Query availability.
- Create appointment.
- Query appointment status.

---

# 8. Asynchronous Operations

Some actions do not need to block the user's request.

For example, after successfully creating an appointment, the system could generate a notification:

```text
Appointment Created
        |
        v
Notification Event
        |
        v
Notification Worker
        |
        v
Send notification
```

The appointment should not fail simply because the notification service is temporarily unavailable.

Therefore, notification processing can be asynchronous.

### Delivery characteristic

For MVP 1, asynchronous events can use:

> **At-least-once delivery**

This means the system guarantees that an event will be delivered one or more times, so consumers must be prepared to process duplicate events safely.

Example:

```text
AppointmentCreated
       |
       +----> Notification Worker
       |
       +----> Retry if necessary
```

The notification worker should use an **idempotent operation** so that processing the same event twice does not create an incorrect result.

---

# 9. Consistency & Delivery Matrix

| Operation | Communication | Consistency | Delivery Semantics | Justification |
|---|---|---|---|---|
| Query availability | REST | Strong | Synchronous | Availability must reflect the current state as closely as possible. |
| Book appointment | REST | **Strong** | Synchronous | Prevents double booking and gives the patient an immediate result. |
| Confirm appointment | REST / Event | Strong for appointment state | Synchronous for booking result | The appointment state must be correct after the transaction. |
| Notify patient | Event | Eventual | At-least-once | Notification can be processed asynchronously and retried if necessary. |
| Query appointment status | REST | Eventual acceptable | Synchronous response | A small delay in displaying a status is acceptable as long as the source of truth is correct. |

---

# 10. Design Decisions to Defend in MVP 1

The team will defend the following decisions during the MVP 1 design review.

### Decision 1 — Strong consistency for booking

The appointment slot is a critical resource.

If two patients can book the same slot, the system produces an invalid business state.

Therefore, the booking operation requires strong consistency.

---

### Decision 2 — Synchronous communication for booking

The patient needs an immediate response indicating whether the appointment was successfully created.

Therefore:

```text
POST /appointments
```

will be handled synchronously.

The response should clearly indicate:

```text
SUCCESS
```

or

```text
REJECTED — SLOT NOT AVAILABLE
```

---

### Decision 3 — Asynchronous notifications

Notifications do not need to block the appointment creation process.

Therefore:

```text
Appointment Created
        |
        v
Event
        |
        v
Notification Worker
```

can be processed asynchronously.

This also allows the notification process to retry if there is a temporary failure.

---

### Decision 4 — At-least-once delivery

For asynchronous events, losing an appointment notification would be undesirable.

Therefore, the system prioritizes **at-least-once delivery** with idempotent consumers instead of assuming that every event will be delivered exactly once.

---

# 11. MVP 1 End-to-End Workflow

The expected MVP flow is:

```text
                    SALUD ACTIVA

Patient
   |
   | 1. Login / Access
   v
Frontend
   |
   | 2. GET availability
   v
Backend
   |
   | 3. Check available slots
   v
Database
   |
   | 4. Available slot
   v
Frontend
   |
   | 5. Select slot
   v
Backend
   |
   | 6. Create appointment
   v
Database
   |
   | 7. Transaction + constraint
   v
Appointment Created
   |
   +----------------------+
   |                      |
   v                      v
Response              AppointmentCreated
to Patient                  |
                            v
                    Notification Worker
                            |
                            v
                       Notification
```

The critical part of the workflow is the appointment creation transaction, because it guarantees that the same slot cannot be successfully assigned to two patients.

---

# 12. MVP 1 Definition of Done

The MVP 1 workflow will be considered functional when:

- [ ] The patient can access the application.
- [ ] The patient can consult available appointment slots.
- [ ] The patient can select a slot.
- [ ] The system can create an appointment.
- [ ] The system prevents duplicate bookings.
- [ ] The patient receives a successful or rejected response.
- [ ] The appointment status can be consulted.
- [ ] The application runs in containers.
- [ ] The main architecture is documented.
- [ ] The consistency decisions are documented.
- [ ] The delivery semantics are documented.
- [ ] The complete workflow can be demonstrated from frontend to backend and database.

---

# 13. Summary

For MVP 1, the main architectural principle is:

> **Critical business operations require strong consistency, while secondary operations such as notifications can use eventual consistency and asynchronous processing.**

The most important decision is the appointment booking operation:

```text
BOOK APPOINTMENT
       |
       +--> Strong Consistency
       |
       +--> Synchronous REST
       |
       +--> Transaction
       |
       +--> Prevent Double Booking
```

While notifications can follow:

```text
APPOINTMENT CREATED
       |
       +--> Event
       |
       +--> Asynchronous Worker
       |
       +--> At-Least-Once Delivery
       |
       +--> Idempotent Processing
```

These decisions provide the foundation for evolving the MVP into a distributed architecture in future iterations.