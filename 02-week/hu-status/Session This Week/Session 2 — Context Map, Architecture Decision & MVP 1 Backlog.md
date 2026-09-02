# Session 2 — Context Map, Architecture Decision & MVP 1 Backlog

## 1. Objective

The objective of this session is to define the initial architecture of **Salud Activa** by creating the Context Map, selecting the architecture through the decision path, documenting the decision in **ADR-001**, and slicing the architecture into the first MVP 1 backlog stories.

The team will focus on the core medical appointment workflow while keeping the architecture simple enough for the first increment and allowing future evolution toward distributed services.

---

# 2. Product Context

## Salud Activa

Salud Activa is a medical appointment management system.

The main problem addressed by the system is the difficulty of managing appointment availability and bookings in a reliable and centralized way.

The core workflow for MVP 1 is:

```text
Patient
   |
   v
Access System
   |
   v
Consult Availability
   |
   v
Select Slot
   |
   v
Book Appointment
   |
   v
Confirm Appointment
   |
   v
Consult Appointment Status
```

---

# 3. Context Map

A **Context Map** represents the relationship between the different Bounded Contexts of the system.

For MVP 1, the following contexts have been identified:

```text
                         SALUD ACTIVA
                              |
                              v
                       ┌──────────────┐
                       │   Patient    │
                       └──────┬───────┘
                              |
                              v
                       ┌──────────────┐
                       │   Identity   │
                       │   & Access   │
                       └──────┬───────┘
                              |
                              v
                  ┌─────────────────────────┐
                  │                         │
                  v                         v
          ┌──────────────┐          ┌──────────────┐
          │ Availability │          │ Appointment  │
          │    Context   │<-------->│    Context   │
          └──────┬───────┘          └──────┬───────┘
                 |                         |
                 |                         v
                 |                  ┌──────────────┐
                 |                  │ Notification │
                 |                  │    Context   │
                 |                  └──────────────┘
                 |
                 v
          ┌──────────────┐
          │ Professional │
          │    Context   │
          └──────────────┘
```

---

# 4. Bounded Contexts

## 4.1 Identity & Access

### Responsibility

- Authentication.
- Authorization.
- User roles.
- Access control.

### Relationship

Identity & Access provides authentication information to the rest of the application.

For MVP 1, it remains inside the modular monolith.

---

## 4.2 Patient

### Responsibility

- Patient identification.
- Basic patient information.
- Relationship between the patient and their appointments.

For MVP 1, this context only contains the information necessary for appointment management.

It remains inside the modular monolith.

---

## 4.3 Professional

### Responsibility

- Healthcare professional information.
- Specialty.
- Basic professional data.

Professional information is required to associate appointments with healthcare professionals.

It remains inside the modular monolith for MVP 1.

---

## 4.4 Availability

### Responsibility

- Professional schedules.
- Available time slots.
- Occupied time slots.
- Availability queries.

Availability is directly related to appointment booking.

It remains inside the modular monolith during MVP 1 but is a candidate for future service extraction.

---

## 4.5 Appointment

### Responsibility

Appointment Management is the **core bounded context**.

It manages:

- Appointment creation.
- Appointment confirmation.
- Appointment status.
- Appointment cancellation.
- Patient-appointment relationship.
- Professional-appointment relationship.

This context contains the most important business rules of MVP 1.

It is the strongest candidate for a future independent service.

---

## 4.6 Notification

### Responsibility

- Appointment confirmation notifications.
- Appointment reminders.
- Appointment status notifications.

Notification does not need to block the booking transaction.

Therefore, it can eventually be implemented as an asynchronous worker or independent service.

---

# 5. Context Relationships

The most important relationship in MVP 1 is:

```text
Availability
      |
      | Check slot
      v
Appointment
      |
      | Appointment Created
      v
Notification
```

The booking workflow requires the Appointment context to verify that the selected slot is available.

After a successful booking, a notification can be generated asynchronously.

---

# 6. Context Map Classification

| Context | Role | MVP 1 | Future |
|---|---|---|---|
| Identity & Access | Supporting | Modular Monolith | Possible Service |
| Patient | Supporting | Modular Monolith | Possible Service |
| Professional | Supporting | Modular Monolith | Possible Service |
| Availability | Core-supporting | Modular Monolith | Possible Service |
| Appointment | **Core** | Modular Monolith | **Candidate Service** |
| Notification | Supporting | Worker / Optional | **Candidate Service** |

---

# 7. Architecture Decision Path

The team follows the following decision path:

```text
                     Start
                       |
                       v
            Is MVP 1 end-to-end?
                       |
                      Yes
                       |
                       v
          Do we need independent
          services immediately?
                       |
                       v
                      No
                       |
                       v
      Can we preserve clear domain
             boundaries?
                       |
                      Yes
                       |
                       v
          Modular Monolith
                       |
                       v
       Apply DDD bounded contexts
                       |
                       v
        Apply Hexagonal Architecture
                       |
                       v
              MVP 1 Architecture
```

---

# 8. Architecture Decision

The team selects:

> **Modular Monolith + Domain-Driven Design + Hexagonal Architecture**

for MVP 1.

The application will be deployed as a single unit while maintaining independent internal modules for each bounded context.

---

# 9. ADR-001

## ADR-001 — Modular Monolith with DDD and Hexagonal Architecture

**Status:** Accepted

**Date:** 2026-09-02

### Context

Salud Activa needs to provide a complete appointment booking workflow for MVP 1.

The team identified several bounded contexts:

- Identity & Access.
- Patient.
- Professional.
- Availability.
- Appointment.
- Notification.

Although these contexts could eventually become independent services, immediately implementing multiple microservices would introduce additional complexity in deployment, networking, service discovery, observability, communication, and data management.

MVP 1 needs to prioritize a working end-to-end increment.

### Decision

The team will implement MVP 1 using a:

> **Modular Monolith with Domain-Driven Design and Hexagonal Architecture.**

Each bounded context will be represented as a clearly separated module.

The application will initially be deployed as one application.

### Architecture

```text
                         Frontend
                            |
                            | REST
                            v
                 ┌──────────────────────┐
                 │    Modular Monolith  │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Identity & Access│ │
                 │ └──────────────────┘ │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Patient          │ │
                 │ └──────────────────┘ │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Professional     │ │
                 │ └──────────────────┘ │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Availability     │ │
                 │ └──────────────────┘ │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Appointment      │ │
                 │ │      CORE        │ │
                 │ └──────────────────┘ │
                 │                      │
                 │ ┌──────────────────┐ │
                 │ │ Notification     │ │
                 │ └──────────────────┘ │
                 └───────────┬──────────┘
                             |
                             v
                         Database
```

---

## 9.1 Why Not Microservices Now?

The team will not implement one microservice per bounded context in MVP 1 because:

1. The system is still at an early stage.
2. The team needs to demonstrate the complete business workflow.
3. Distributed communication would increase implementation complexity.
4. Appointment booking requires strong consistency.
5. A modular monolith allows the team to validate domain boundaries before distributing them.

Therefore:

> **We design for future distribution without prematurely distributing the MVP.**

---

## 9.2 Why Modular Monolith?

The modular monolith provides:

- Clear domain boundaries.
- Lower deployment complexity.
- Easier development.
- Easier testing.
- Simpler local execution.
- Strong transactional consistency.
- A clear path toward future service extraction.

---

## 9.3 Why DDD?

DDD helps the team organize the system around business concepts and boundaries instead of technical layers alone.

The main concepts are:

```text
Patient
Professional
Availability
Appointment
Notification
```

The core business capability is:

```text
Appointment Management
```

---

## 9.4 Why Hexagonal Architecture?

Hexagonal Architecture separates the domain and application logic from external technologies.

The conceptual structure is:

```text
                 REST API
                    |
                    v
             ┌──────────────┐
             │   Adapters   │
             └──────┬───────┘
                    |
                    v
             ┌──────────────┐
             │ Application  │
             └──────┬───────┘
                    |
                    v
             ┌──────────────┐
             │   Domain     │
             └──────┬───────┘
                    |
                    v
             ┌──────────────┐
             │ Infrastructure│
             └──────────────┘
```

The domain should not depend directly on the database, framework, or external services.

---

# 10. Consequences

## Positive Consequences

- Reduced architectural complexity.
- Faster MVP development.
- Clear bounded contexts.
- Easier testing.
- Strong consistency for appointment booking.
- Easier deployment.
- Future service extraction is possible.

## Negative Consequences

- MVP 1 is not physically distributed.
- Module boundaries must be maintained carefully.
- Future extraction may require additional infrastructure.
- The team must avoid creating excessive coupling between modules.

---

# 11. Future Evolution

The architecture can evolve progressively:

```text
                    MVP 1
                      |
                      v
             Modular Monolith
                      |
                      v
            Validate Boundaries
                      |
                      v
           Identify Extraction Need
                      |
                      v
              Service Extraction
                      |
          ┌───────────┼───────────┐
          v           v           v
    Appointment  Availability  Notification
      Service       Service       Service
```

The extraction of a bounded context will only occur when there is a clear technical or business reason.

---

# 12. MVP 1 Backlog Slice

The architecture is translated into the following initial stories.

---

## Story 1 — Patient Access

**HU-01**

> As a patient, I want to access the system so that I can manage my appointments.

### Acceptance Criteria

- **AC1:** Given valid credentials, when the patient submits the login form, then the system authenticates the patient successfully.
- **AC2:** Given invalid credentials, when the patient submits the login form, then the system rejects the request.
- **AC3:** Given successful authentication, when the patient enters the system, then the patient can access appointment functionality.

---

## Story 2 — Consult Availability

**HU-02**

> As a patient, I want to consult available appointment slots so that I can select a convenient time.

### Acceptance Criteria

- **AC1:** Given available slots exist, when the patient requests availability, then the system returns the available slots.
- **AC2:** Given a slot is already occupied, when availability is requested, then the occupied slot is not returned as available.
- **AC3:** Given no slots are available, when the patient requests availability, then the system indicates that no slots are available.

---

## Story 3 — Book Appointment

**HU-03**

> As a patient, I want to book an available appointment so that I can receive medical attention.

### Acceptance Criteria

- **AC1:** Given the selected slot is available, when the patient confirms the booking, then the system creates the appointment.
- **AC2:** Given the selected slot is occupied, when the patient attempts to book it, then the system rejects the booking.
- **AC3:** Given two patients attempt to book the same slot concurrently, when the requests are processed, then only one appointment is successfully created.
- **AC4:** Given the appointment is successfully created, then the system returns its identifier and status.

---

## Story 4 — Prevent Double Booking

**HU-04**

> As the system, I want to prevent duplicate bookings so that the same appointment slot cannot be assigned to two patients.

### Acceptance Criteria

- **AC1:** Given a slot already has an appointment, when another patient attempts to book it, then the operation is rejected.
- **AC2:** Given multiple requests arrive concurrently for the same slot, when they are processed, then only one request creates an appointment.
- **AC3:** Given a booking is rejected because the slot is unavailable, then the system returns a clear error response.

---

## Story 5 — Consult Appointment Status

**HU-05**

> As a patient, I want to consult my appointment status so that I know the current state of my appointment.

### Acceptance Criteria

- **AC1:** Given an existing appointment, when the patient requests its information, then the system returns the appointment and current status.
- **AC2:** Given the appointment does not exist, when the patient requests it, then the system returns a not-found response.
- **AC3:** Given the appointment is confirmed, when the patient consults its status, then the system returns the confirmed status.

---

## Story 6 — Appointment Confirmation

**HU-06**

> As the system, I want to confirm a successful appointment so that the patient knows that the booking was registered.

### Acceptance Criteria

- **AC1:** Given an appointment is successfully created, when the transaction completes, then the appointment has the confirmed status.
- **AC2:** Given appointment creation fails, when the transaction is rolled back, then the appointment is not confirmed.
- **AC3:** Given an appointment is confirmed, when the patient checks its status, then the system returns the confirmed status.

---

# 13. Backlog Priority

| Priority | Story | Context |
|---|---|---|
| Critical | HU-03 — Book Appointment | Appointment |
| Critical | HU-04 — Prevent Double Booking | Appointment / Availability |
| High | HU-02 — Consult Availability | Availability |
| High | HU-01 — Patient Access | Identity |
| High | HU-05 — Consult Appointment Status | Appointment |
| High | HU-06 — Appointment Confirmation | Appointment |

---

# 14. MVP 1 End-to-End Slice

The first implementation slice should connect the complete workflow:

```text
Patient
   |
   v
HU-01 — Access
   |
   v
HU-02 — Consult Availability
   |
   v
HU-03 — Book Appointment
   |
   v
HU-04 — Prevent Double Booking
   |
   v
HU-06 — Confirm Appointment
   |
   v
HU-05 — Consult Status
```

The goal is not to implement every possible functionality.

The goal is to have a **small but functional end-to-end increment** that demonstrates the core business value.

---

# 15. Definition of Done

This Session 2 activity is complete when:

- [ ] Context Map has been created.
- [ ] Bounded Contexts have been identified.
- [ ] Relationships between contexts have been documented.
- [ ] The core bounded context has been identified.
- [ ] Candidate future services have been identified.
- [ ] The architecture decision path has been completed.
- [ ] ADR-001 has been written in the `docs` repository.
- [ ] Architecture choice has been justified.
- [ ] MVP 1 stories have been created.
- [ ] Stories have testable acceptance criteria.
- [ ] Stories have been prioritized.
- [ ] The end-to-end MVP 1 slice has been defined.

---

# 16. Final Decision

For Session 2, the team decides:

> **Salud Activa will use a Modular Monolith with DDD and Hexagonal Architecture for MVP 1.**

The system will define clear Bounded Contexts, with **Appointment Management** as the core domain.

The team will avoid premature microservice decomposition while preserving boundaries that allow future extraction into independent services.

The first MVP 1 slice will focus on:

```text
Access
  ↓
Availability
  ↓
Booking
  ↓
Double-booking protection
  ↓
Confirmation
  ↓
Appointment Status
```