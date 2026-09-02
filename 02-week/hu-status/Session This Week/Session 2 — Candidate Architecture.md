# Session 2 — Candidate Architecture

## 1. Objective

The objective of this activity is to sketch the candidate architecture for **Salud Activa**, identify the main **Bounded Contexts**, and determine which contexts could potentially become independent services in the future.

For MVP 1, the team will prioritize a simple and maintainable architecture while preserving clear domain boundaries that allow future evolution toward a distributed system.

---

# 2. Product

## Salud Activa — Medical Appointment Management

Salud Activa is a system designed to manage medical appointments between patients and healthcare professionals.

The core business process for MVP 1 is:

```text
Patient
   |
   v
Consult Availability
   |
   v
Select Appointment
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

# 3. Candidate Bounded Contexts

The following bounded contexts have been identified:

| Bounded Context | Main Responsibility | Candidate Service? | MVP 1 |
|---|---|---|---|
| Identity & Access | Authentication, authorization and user access | Yes, future | Together |
| Patient Management | Patient profile and basic patient information | Possible | Together |
| Professional Management | Healthcare professional information and availability | Possible | Together |
| Appointment Management | Creation, cancellation, confirmation and status of appointments | **Yes — Core** | Together |
| Availability Management | Management and consultation of available appointment slots | **Yes — Future** | Together |
| Notification | Sending appointment confirmations and notifications | **Yes — Future** | Optional / Worker |
| Medical Records | Management of medical history and clinical information | **Yes — Future** | Out of scope |

---

# 4. Bounded Contexts

## 4.1 Identity & Access

### Responsibility

Manages:

- User authentication.
- Authorization.
- User roles.
- Access to protected functionality.

### Candidate service

**Yes, in a future iteration.**

Identity is a good candidate for an independent service because authentication can be shared by different parts of the system.

### MVP 1

For MVP 1, Identity & Access will remain inside the modular monolith to avoid unnecessary infrastructure complexity.

---

# 4.2 Patient Management

### Responsibility

Manages basic patient information and the relationship between the patient and their appointments.

Examples:

```text
Patient
├── ID
├── Name
├── Contact Information
└── Account
```

### Candidate service

**Possible future service.**

It could become independent if patient management grows or needs to be shared with other systems.

### MVP 1

It will remain together with the main application because the patient functionality required by MVP 1 is limited.

---

# 4.3 Professional Management

### Responsibility

Manages healthcare professionals and their basic information.

Examples:

```text
Professional
├── ID
├── Name
├── Specialty
└── Availability
```

### Candidate service

**Possible future service.**

It could be separated if professional management becomes a large domain or needs to interact with external healthcare systems.

### MVP 1

It will remain inside the modular monolith.

---

# 4.4 Appointment Management

### Responsibility

This is the **core bounded context** of MVP 1.

It manages:

- Appointment creation.
- Appointment confirmation.
- Appointment status.
- Appointment cancellation.
- Relationship between patient, professional and time slot.

Example:

```text
Appointment
├── ID
├── Patient
├── Professional
├── Date
├── Time
└── Status
```

### Candidate service

**Yes.**

Appointment Management is the strongest candidate for becoming an independent service because it contains the central business capability of the product.

### MVP 1

It will remain inside the modular monolith but with a clearly defined module boundary.

---

# 4.5 Availability Management

### Responsibility

Manages:

- Available time slots.
- Professional schedules.
- Occupied slots.
- Availability queries.

Example:

```text
Availability
├── Professional
├── Date
├── Start Time
├── End Time
└── Status
```

### Candidate service

**Yes, in a future iteration.**

Availability has a different responsibility from appointment management and may eventually require independent scaling or optimization.

### MVP 1

It will remain together with Appointment Management because both participate directly in the booking transaction.

---

# 4.6 Notification

### Responsibility

Manages:

- Appointment confirmation notifications.
- Appointment reminders.
- Status change notifications.

### Candidate service

**Yes.**

Notification is particularly suitable for asynchronous processing.

Future architecture:

```text
Appointment Service
        |
        | AppointmentCreated
        v
Message Broker
        |
        v
Notification Worker
        |
        v
Notification Service
```

### MVP 1

Notification will not be a complete independent service.

If implemented, it will be handled as an asynchronous worker or internal component.

---

# 4.7 Medical Records

### Responsibility

Manages:

- Medical history.
- Clinical information.
- Diagnoses.
- Medical records.

### Candidate service

**Yes, potentially in the future.**

Medical Records represents a separate business capability with its own rules and data.

### MVP 1

It is **out of scope**.

No medical-record functionality will be implemented as part of the first MVP.

---

# 5. Candidate Architecture

The candidate architecture can initially be represented as follows:

```text
                         SALUD ACTIVA

                              Patient
                                 |
                                 v
                          ┌─────────────┐
                          │  Frontend   │
                          └──────┬──────┘
                                 |
                              REST API
                                 |
                                 v
              ┌─────────────────────────────────┐
              │        MODULAR MONOLITH         │
              │                                 │
              │ ┌─────────────┐ ┌────────────┐ │
              │ │  Identity   │ │  Patient   │ │
              │ └─────────────┘ └────────────┘ │
              │                                 │
              │ ┌─────────────┐ ┌────────────┐ │
              │ │ Professional│ │ Appointment│ │
              │ └─────────────┘ └────────────┘ │
              │                                 │
              │ ┌─────────────┐                │
              │ │ Availability│                │
              │ └─────────────┘                │
              │                                 │
              │ ┌────────────────────────────┐ │
              │ │ Notification Worker        │ │
              │ └────────────────────────────┘ │
              └───────────────┬─────────────────┘
                              |
                              v
                       ┌─────────────┐
                       │  Database   │
                       └─────────────┘
```

---

# 6. Which Contexts Could Become Services?

The candidate service boundaries are:

```text
Future Service Candidates

┌──────────────────────┐
│ Identity & Access    │
└──────────────────────┘

┌──────────────────────┐
│ Appointment Service  │  ← Core
└──────────────────────┘

┌──────────────────────┐
│ Availability Service │
└──────────────────────┘

┌──────────────────────┐
│ Notification Service │
└──────────────────────┘

┌──────────────────────┐
│ Medical Records      │
└──────────────────────┘
```

Patient Management and Professional Management could also become services later if their complexity or integration requirements justify their separation.

---

# 7. What Stays Together in MVP 1?

For MVP 1, the following contexts will remain inside the same modular monolith:

```text
┌─────────────────────────────────────┐
│          MVP 1 Modular Monolith     │
│                                     │
│ Identity                            │
│ Patient                             │
│ Professional                        │
│ Appointment                         │
│ Availability                        │
│                                     │
└─────────────────────────────────────┘
```

### Why?

The main reason is that MVP 1 needs to provide a complete appointment workflow without introducing unnecessary distributed communication.

The most critical relationship is:

```text
Availability
      |
      v
Appointment
```

When a patient books an appointment, the system must verify that the selected slot is available and prevent another patient from booking the same slot.

Keeping these contexts together initially makes it easier to guarantee transactional consistency.

---

# 8. What Can Be Asynchronous?

Notification is different from the core booking process.

It does not need to block the appointment transaction.

Therefore:

```text
Appointment Created
        |
        v
   Event / Message
        |
        v
Notification Worker
        |
        v
Send Notification
```

This allows the notification process to be retried without invalidating the appointment itself.

---

# 9. Future Distributed Architecture

Once the system grows, the modular monolith could evolve toward:

```text
                         Frontend
                            |
                            v
                       API Gateway
                            |
          ┌─────────────────┼─────────────────┐
          |                 |                 |
          v                 v                 v
   Identity Service  Appointment Service  Availability
                                             Service
          |                 |                 |
          |                 v                 |
          |          Message Broker           |
          |                 |                 |
          |                 v                 |
          |        Notification Service       |
          |                                   |
          └───────────────────────────────────┘
```

Additional services such as **Patient Management** and **Medical Records** could be extracted when there is a clear reason to do so.

---

# 10. Service Extraction Criteria

A bounded context should not become a microservice simply because it can.

The team will consider extracting a context when there is a clear justification, such as:

- Independent scalability requirements.
- Different deployment frequency.
- Strong domain boundaries.
- Independent business ownership.
- Different availability requirements.
- Need for independent technology choices.
- Significant performance requirements.
- Integration with external systems.
- Independent data lifecycle.

Therefore:

> **Bounded Context ≠ Automatically a Microservice.**

A bounded context represents a business boundary. A service is a technical deployment decision based on those boundaries and additional operational requirements.

---

# 11. Architectural Decision for Session 2

The team identifies the following architecture as the candidate architecture for MVP 1:

> **Modular Monolith + DDD + Hexagonal Architecture**

The bounded contexts are defined internally as modules.

The main candidate future services are:

1. **Appointment Service** — Core business capability.
2. **Availability Service** — Independent scheduling capability.
3. **Identity Service** — Authentication and authorization.
4. **Notification Service** — Asynchronous communication.
5. **Medical Records Service** — Future clinical capability.

Patient and Professional Management will initially remain inside the modular monolith.

---

# 12. Relation with ADR-001

This analysis provides the basis for **ADR-001 — Chosen Architecture Style**.

The decision is:

```text
                    MVP 1
                      |
                      v
             Modular Monolith
                      |
          ┌───────────┼───────────┐
          v           v           v
       Domain      Application Infrastructure
          |
          v
   Bounded Contexts
          |
          v
   Future Service Boundaries
```

The team will therefore **design for future distribution without prematurely implementing a distributed architecture**.

---

# 13. Definition of Done

The architecture sketch is complete when:

- [ ] Bounded contexts have been identified.
- [ ] The responsibility of each context has been documented.
- [ ] Potential future services have been identified.
- [ ] Contexts that remain together in MVP 1 have been defined.
- [ ] The reason for keeping them together has been documented.
- [ ] The core bounded context has been identified.
- [ ] The candidate architecture has been sketched.
- [ ] The architecture decision is reflected in ADR-001.
- [ ] Future service extraction criteria have been documented.