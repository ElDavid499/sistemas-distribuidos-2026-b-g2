# Session 2 — Project Setup, ADR & MVP 1 Backlog

## Objective

During this session, the team will establish the initial project structure, configure the required repositories, define the first architectural decision, and create the MVP 1 backlog with testable acceptance criteria.

The objective is to have a clear technical and functional foundation before starting the implementation of MVP 1.

---

# 1. Profile Repository

Each team member must configure their **profile repository** according to the course requirements.

The repository must contain the required `CONFIG` block with the corresponding student and project information.

### Tasks

- [ ] Configure the profile repository.
- [ ] Complete the required `CONFIG` block.
- [ ] Verify that the configuration is correct.
- [ ] Commit and push the changes.

---

# 2. Fork

Each team member must create their **fork** of the repository provided for the course.

### Tasks

- [ ] Create the fork.
- [ ] Clone the fork locally.
- [ ] Configure the remote repository.
- [ ] Verify that changes can be pushed successfully.
- [ ] Keep the fork synchronized with the original repository when necessary.

---

# 3. HU Status

The team must create the following file:

```text
01-week/hu-status/README.md
```

This file will be used to track the implementation status of the User Stories defined for the project.

## HU Status

| ID | User Story | Priority | Status |
|---|---|---|---|
| HU-01 | Patient accesses the system | High | Pending |
| HU-02 | Patient consults available appointment slots | High | Pending |
| HU-03 | Patient books an appointment | Critical | Pending |
| HU-04 | Patient consults appointment status | High | Pending |
| HU-05 | System prevents duplicate bookings | Critical | Pending |
| HU-06 | System confirms the appointment | High | Pending |

### Status

The following statuses will be used:

- `Pending`
- `In Progress`
- `Review`
- `Done`
- `Blocked`

---

# 4. Team `docs` Repository

The team must create a dedicated repository called:

```text
docs
```

This repository will contain the project's architectural, domain, interface, runtime, and data documentation.

The initial structure can be organized as follows:

```text
docs/
│
├── README.md
│
├── 00-governance/
│
├── 01-context/
│
├── 02-domain/
│
├── 03-architecture/
│
├── 04-interfaces/
│
├── 05-runtime/
│
└── 06-data/
```

The documentation will evolve as the project progresses.

---

# 5. ADR-001 — Chosen Architecture Style

## ADR-001: Modular Monolith with DDD and Hexagonal Architecture

**Status:** Accepted

### Context

Salud Activa is a medical appointment management system whose main purpose is to allow patients to consult availability and manage medical appointments.

For MVP 1, the team needs to implement a complete end-to-end workflow without introducing unnecessary distributed-system complexity too early.

The initial workflow is:

```text
Patient
   |
   v
Frontend
   |
   v
Backend
   |
   v
Database
```

The system must also maintain clear boundaries between business logic, application logic, infrastructure, and external interfaces.

### Decision

For **MVP 1**, the team will use a:

> **Modular Monolith based on Domain-Driven Design (DDD) and Hexagonal Architecture.**

The system will initially be deployed as a single application, but internally it will be divided into well-defined modules and responsibilities.

### Proposed Structure

```text
Backend
│
├── Domain
│   ├── Patient
│   ├── Appointment
│   └── Availability
│
├── Application
│   ├── Use Cases
│   └── Application Services
│
├── Infrastructure
│   ├── Database
│   └── External Services
│
└── Adapters
    ├── REST API
    └── Persistence
```

### Rationale

This architecture was selected because it:

- Reduces the complexity of MVP 1.
- Allows the team to implement the complete workflow quickly.
- Separates business logic from infrastructure.
- Facilitates unit and integration testing.
- Establishes clear domain boundaries.
- Provides a foundation for future service extraction.

### Future Evolution

The modular structure will allow the team to identify bounded contexts that could become independent services in future iterations.

For example:

```text
MVP 1
┌───────────────────────────────┐
│       Modular Monolith        │
│                               │
│ Patient | Appointment |       │
│ Availability                   │
└───────────────────────────────┘


Future Evolution

┌──────────────┐
│ Patient      │
│ Service      │
└──────────────┘

┌──────────────┐
│ Appointment  │
│ Service      │
└──────────────┘

┌──────────────┐
│ Availability │
│ Service      │
└──────────────┘
```

The team will not split the system into microservices during this initial stage unless a specific requirement justifies it.

### Consequences

#### Positive

- Lower operational complexity.
- Easier local development.
- Simpler deployment.
- Clear separation of responsibilities.
- Easier testing.
- Strong consistency for critical transactional operations.
- Possibility of future migration toward microservices.

#### Negative

- MVP 1 is not physically distributed.
- The modules must maintain clear boundaries.
- Future service extraction may require additional infrastructure and communication mechanisms.

---

# 6. MVP 1 Backlog

The MVP 1 backlog focuses on the central business workflow: **medical appointment management**.

---

## HU-01 — Patient Access

**As a patient, I want to access the system so that I can manage my appointments.**

### Acceptance Criteria

**AC-01 — Successful authentication**

Given that the patient has valid credentials,  
when the patient submits the login form,  
then the system must authenticate the patient successfully.

**AC-02 — Invalid credentials**

Given that the patient enters invalid credentials,  
when the login request is submitted,  
then the system must reject the request and return an authentication error.

**AC-03 — Access after authentication**

Given that the authentication is successful,  
when the patient enters the system,  
then the patient must have access to the appointment functionality.

---

# HU-02 — Consult Availability

**As a patient, I want to consult available appointment slots so that I can choose a convenient time.**

### Acceptance Criteria

**AC-01 — Available slots**

Given that appointment slots are available,  
when the patient requests the availability,  
then the system must return the available slots.

**AC-02 — Occupied slot**

Given that an appointment slot has already been booked,  
when the patient requests availability,  
then the occupied slot must not be returned as available.

**AC-03 — No availability**

Given that there are no available slots,  
when the patient requests availability,  
then the system must indicate that there are no available slots.

---

# HU-03 — Book Appointment

**As a patient, I want to book an available appointment slot so that I can receive medical attention.**

### Acceptance Criteria

**AC-01 — Successful booking**

Given that the selected slot is available,  
when the patient confirms the booking,  
then the system must create the appointment successfully.

**AC-02 — Unavailable slot**

Given that the selected slot is already occupied,  
when the patient attempts to book it,  
then the system must reject the booking.

**AC-03 — Concurrent booking**

Given that two patients attempt to book the same slot concurrently,  
when both requests are processed,  
then only one patient must successfully obtain the appointment.

**AC-04 — Appointment identifier**

Given that the booking is successful,  
when the operation finishes,  
then the system must return a valid appointment identifier and status.

---

# HU-04 — Consult Appointment Status

**As a patient, I want to consult my appointment status so that I know the current state of my appointment.**

### Acceptance Criteria

**AC-01 — Existing appointment**

Given that the patient has an existing appointment,  
when the patient requests its information,  
then the system must return the appointment and its current status.

**AC-02 — Appointment not found**

Given that the requested appointment does not exist,  
when the patient requests its information,  
then the system must return a not-found response.

**AC-03 — Confirmed appointment**

Given that an appointment has been confirmed,  
when the patient consults its status,  
then the system must display the appointment as confirmed.

---

# HU-05 — Prevent Duplicate Bookings

**As the system, I want to prevent duplicate bookings so that two patients cannot reserve the same appointment slot.**

### Acceptance Criteria

**AC-01 — Existing booking**

Given that a slot is already assigned to an appointment,  
when another patient attempts to book the same slot,  
then the system must reject the request.

**AC-02 — Concurrent requests**

Given that multiple booking requests for the same slot arrive concurrently,  
when the system processes the requests,  
then only one appointment must be created successfully.

**AC-03 — Clear rejection**

Given that a booking is rejected because the slot is no longer available,  
then the system must return a clear error response.

---

# HU-06 — Confirm Appointment

**As the system, I want to confirm a successful appointment so that the patient knows that the booking was registered.**

### Acceptance Criteria

**AC-01 — Successful confirmation**

Given that an appointment has been successfully created,  
when the booking transaction finishes,  
then the appointment must have the appropriate confirmed status.

**AC-02 — Failed transaction**

Given that appointment creation fails,  
when the transaction is rolled back,  
then the appointment must not be marked as confirmed.

**AC-03 — Status verification**

Given that the appointment has been confirmed,  
when the patient consults its status,  
then the system must return the confirmed status.

---

# 7. Backlog Prioritization

The MVP 1 backlog is prioritized according to the importance of each functionality for the core workflow.

| Priority | User Stories |
|---|---|
| Critical | HU-03 — Book Appointment |
| Critical | HU-05 — Prevent Duplicate Bookings |
| High | HU-01 — Patient Access |
| High | HU-02 — Consult Availability |
| High | HU-04 — Consult Appointment Status |
| High | HU-06 — Confirm Appointment |

The booking operation is the central functionality because it represents the main business value of the MVP.

---

# 8. MVP 1 End-to-End Workflow

The backlog must allow the team to demonstrate a complete workflow:

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
Select Appointment Slot
   |
   v
Book Appointment
   |
   v
Validate Availability
   |
   v
Save Appointment
   |
   v
Confirm Appointment
   |
   v
Consult Appointment Status
```

The MVP is considered **end-to-end** when the workflow can be executed from the frontend through the backend and database.

---

# 9. Session 2 Checklist

## Profile Repository

- [ ] Profile repository configured.
- [ ] `CONFIG` block completed.
- [ ] Changes committed.
- [ ] Changes pushed.

## Fork

- [ ] Fork created.
- [ ] Fork cloned.
- [ ] Remote configured.
- [ ] Push verified.

## HU Status

- [ ] `01-week/hu-status/README.md` created.
- [ ] User Stories added.
- [ ] Priorities defined.
- [ ] Status values defined.

## Docs Repository

- [ ] Team `docs` repository created.
- [ ] Initial documentation structure created.
- [ ] README created.

## ADR-001

- [ ] Architecture style selected.
- [ ] Context documented.
- [ ] Decision documented.
- [ ] Rationale documented.
- [ ] Consequences documented.
- [ ] Future evolution documented.

## MVP 1 Backlog

- [ ] User Stories defined.
- [ ] User Stories prioritized.
- [ ] Acceptance criteria added.
- [ ] Acceptance criteria are testable.
- [ ] Core workflow identified.
- [ ] End-to-end objective defined.

---

# 10. Definition of Done — Session 2

Session 2 is complete when:

> The team has configured the required repositories, created the HU status document, established the `docs` repository, accepted ADR-001, and defined the MVP 1 backlog with testable acceptance criteria.

The result of this session is the **functional and architectural foundation** required to begin implementing MVP 1.