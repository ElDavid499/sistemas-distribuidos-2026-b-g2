# Distributed Systems — Week 4 · Session 2
## MVP 1 Sprint Planning — GestionTurnosApp

**CORHUILA**  
**Systems Engineering · 2026-B**

---

## 1. MVP 1 — What We Are Building

For GestionTurnosApp, MVP 1 will focus on the **Appointment Management** module.

The PDR defines the following requirements related to medical appointments:

- **RF04:** The system must allow users to consult medical appointments.
- **RF05:** The system must allow users to view appointment details.
- **RF06:** The system must allow users to request new medical appointments.

These requirements are part of the Appointment Management module defined in the PDR.

### Sprint Goal

> **A patient can request a medical appointment and retrieve its details through the Appointment Service, with the appointment persisted in a real database.**

---

# 2. Contract-First API

The API must be defined before implementation.

The Appointment Service will expose the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check service availability |
| `POST` | `/api/v1/appointments` | Request a medical appointment |
| `GET` | `/api/v1/appointments/{appointmentId}` | Retrieve appointment details |

The PDR specifies Retrofit for consuming REST APIs, so a REST API is consistent with the existing project architecture.

---

# 3. API Contract

## 3.1 Health Check

### Request

```http
GET /health
```

### Response

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

---

## 3.2 Request Appointment

### Request

```http
POST /api/v1/appointments
Content-Type: application/json
```

```json
{
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-15",
  "time": "10:30"
}
```

### Successful Response

```http
201 Created
```

```json
{
  "appointmentId": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-15",
  "time": "10:30",
  "status": "REQUESTED"
}
```

### Errors

#### Invalid data

```http
400 Bad Request
```

```json
{
  "error": {
    "code": "INVALID_APPOINTMENT",
    "message": "The appointment data is invalid."
  }
}
```

#### Occupied slot

```http
409 Conflict
```

```json
{
  "error": {
    "code": "APPOINTMENT_SLOT_OCCUPIED",
    "message": "The selected appointment slot is already occupied."
  }
}
```

---

# 4. Get Appointment Details

### Request

```http
GET /api/v1/appointments/APT-001
```

### Successful Response

```http
200 OK
```

```json
{
  "appointmentId": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-15",
  "time": "10:30",
  "status": "REQUESTED"
}
```

### Appointment Not Found

```http
404 Not Found
```

```json
{
  "error": {
    "code": "APPOINTMENT_NOT_FOUND",
    "message": "Appointment was not found."
  }
}
```

---

# 5. OpenAPI File

The API contract should be stored as:

```text
openapi.yaml
```

Basic structure:

```yaml
openapi: 3.0.3

info:
  title: GestionTurnosApp Appointment Service
  version: 1.0.0

servers:
  - url: http://localhost:8080

paths:

  /health:
    get:
      summary: Check service health
      responses:
        '200':
          description: Service is running

  /api/v1/appointments:
    post:
      summary: Request a medical appointment
      responses:
        '201':
          description: Appointment created
        '400':
          description: Invalid appointment data
        '409':
          description: Appointment slot occupied

  /api/v1/appointments/{appointmentId}:
    get:
      summary: Get appointment details
      responses:
        '200':
          description: Appointment found
        '404':
          description: Appointment not found
```

The complete OpenAPI contract should be treated as the source of truth between the mobile application and the backend.

---

# 6. User Stories

## US01 — View Appointment Details

**As a patient,**  
I want to retrieve my appointment information  
so that I can know the date, time, doctor and status of my appointment.

### Acceptance Criteria

- Given an existing appointment ID, when the client sends `GET /api/v1/appointments/{appointmentId}`, the service returns `200 OK`.
- The response contains the appointment ID.
- The response contains the patient ID.
- The response contains the doctor ID.
- The response contains the date.
- The response contains the time.
- The response contains the appointment status.
- If the appointment does not exist, the service returns `404 Not Found`.

---

## US02 — Request a Medical Appointment

**As a patient,**  
I want to request a medical appointment  
so that I can schedule a consultation with a doctor.

### Acceptance Criteria

- The request requires a patient ID.
- The request requires a doctor ID.
- The request requires a date.
- The request requires a time.
- A valid request creates an appointment.
- The service returns `201 Created`.
- The appointment receives a unique ID.
- The appointment is persisted in the database.
- The initial status is `REQUESTED`.
- An occupied appointment slot returns `409 Conflict`.

---

## US03 — Validate Appointment Data

**As the Appointment Service,**  
I want to validate appointment information  
so that invalid appointments are not stored.

### Acceptance Criteria

- A missing patient ID is rejected.
- A missing doctor ID is rejected.
- A missing date is rejected.
- A missing time is rejected.
- Invalid date/time information is rejected.
- An occupied appointment slot cannot be reserved.

---

# 7. Sprint Task Board

The sprint should be divided into small and verifiable tasks.

| ID | Task | Story | Points | Priority |
|---|---|---|---:|---|
| T01 | Define OpenAPI contract | All | 2 | Must |
| T02 | Create Appointment Service project | Infrastructure | 2 | Must |
| T03 | Create hexagonal architecture folders | Architecture | 2 | Must |
| T04 | Implement `Turno` domain model | US02 | 3 | Must |
| T05 | Implement appointment validation | US03 | 3 | Must |
| T06 | Define `AppointmentRepository` port | US02 | 2 | Must |
| T07 | Create database entity | US02 | 2 | Must |
| T08 | Implement repository adapter | US02 | 3 | Must |
| T09 | Implement `RequestAppointment` use case | US02 | 3 | Must |
| T10 | Implement `GetAppointment` use case | US01 | 2 | Must |
| T11 | Implement POST endpoint | US02 | 2 | Must |
| T12 | Implement GET endpoint | US01 | 2 | Must |
| T13 | Implement `/health` | Infrastructure | 1 | Must |
| T14 | Configure dependency injection | Architecture | 2 | Must |
| T15 | Configure Docker + database | Infrastructure | 3 | Must |
| T16 | Create unit tests | US01/US02/US03 | 3 | Must |
| T17 | Create integration tests | US01/US02 | 3 | Must |
| T18 | Update README and ADR | Documentation | 1 | Should |

---

# 8. Story Point Estimation

Story points represent **relative complexity**, not exact hours.

| Points | Meaning |
|---:|---|
| 1 | Very simple |
| 2 | Small |
| 3 | Medium |
| 5 | Complex |
| 8 | Very complex |

Examples:

- Health endpoint → **1 point**
- GET appointment → **2 points**
- Domain model → **3 points**
- Database adapter → **3 points**
- Integration tests → **3 points**

The team should not treat points as exact time commitments.

---

# 9. MoSCoW Prioritization

## Must Have

The following features are required for MVP 1:

- Appointment Service starts successfully.
- Real database connection.
- `/health` endpoint.
- `POST /api/v1/appointments`.
- `GET /api/v1/appointments/{appointmentId}`.
- Appointment persistence.
- Appointment validation.
- Duplicate appointment-slot detection.
- `400 Bad Request`.
- `404 Not Found`.
- `409 Conflict`.
- Unit tests.
- Integration tests.
- Docker/container execution.
- Basic documentation.

---

## Should Have

Important features that can be implemented if capacity allows:

- Appointment filtering.
- Pagination.
- More detailed doctor information.
- Extended API documentation.
- Additional domain events.

---

## Could Have

Optional improvements:

- Appointment reminders.
- Push notifications.
- Calendar integration.
- Advanced appointment search.
- Additional UI improvements.

---

## Won't Have

These features are outside MVP 1:

- Medication management.
- Symptom registration.
- Health statistics.
- Medical study scanning.
- Integrated chat.
- Gamification.
- Biometric authentication.
- Complete offline synchronization.
- Payment integration.

These are part of the broader GestionTurnosApp scope, but they are not required to achieve the MVP 1 Appointment Service goal.

---

# 10. Sprint Goal Protection

The sprint goal is:

> **A patient can request a medical appointment and retrieve its details through the Appointment Service, with the appointment persisted in a real database.**

Any feature that does not directly contribute to this goal should not automatically enter the sprint.

For example:

```text
"Let's add payments."

→ Move to backlog.
```

```text
"Let's add chat."

→ Move to backlog.
```

```text
"Let's add medication tracking."

→ Move to backlog.
```

The feature can be considered during a future sprint.

This prevents scope creep and protects the MVP release.

---

# 11. Definition of Done

MVP 1 is considered **Done** when all of the following are satisfied.

## Functional

- [ ] A patient can request an appointment.
- [ ] An appointment can be retrieved.
- [ ] Appointment details are returned correctly.
- [ ] Appointment status is returned.
- [ ] Invalid data is rejected.
- [ ] Occupied slots are rejected.
- [ ] Missing appointments return `404`.

## Architecture

- [ ] `domain/` exists.
- [ ] `application/` exists.
- [ ] `adapters/inbound/` exists.
- [ ] `adapters/outbound/` exists.
- [ ] Domain does not depend on HTTP.
- [ ] Domain does not depend on the database.
- [ ] Use cases depend on repository interfaces.
- [ ] Concrete dependencies are configured at the composition root.

## Database

- [ ] A real database is used.
- [ ] The database runs in a container.
- [ ] Appointments are actually persisted.
- [ ] Data remains available after service restart.

## Testing

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] API tests pass.
- [ ] Happy path is tested.
- [ ] Key error cases are tested.

## API

- [ ] OpenAPI contract exists.
- [ ] Requests are documented.
- [ ] Responses are documented.
- [ ] Errors are documented.
- [ ] API uses `/api/v1`.

## Documentation

- [ ] README is updated.
- [ ] Architecture is documented.
- [ ] MVP scope is documented.
- [ ] Relevant ADR is updated.

---

# 12. End-to-End MVP 1 Flow

```text
Mobile Application
        |
        | POST /api/v1/appointments
        v
+-----------------------+
| AppointmentController |
+-----------+-----------+
            |
            v
+-----------------------+
| RequestAppointment    |
| Use Case              |
+-----------+-----------+
            |
            v
+-----------------------+
| Turno Aggregate       |
| Domain Rules          |
+-----------+-----------+
            |
            v
+-----------------------+
| AppointmentRepository |
| Port                  |
+-----------+-----------+
            |
            v
+-----------------------+
| PostgreSQL Adapter    |
+-----------+-----------+
            |
            v
+-----------------------+
| PostgreSQL Database   |
+-----------------------+
```

---

# 13. Relationship With the PDR

| PDR Requirement | MVP 1 Implementation |
|---|---|
| RF04 — Consult appointments | `GET /api/v1/appointments/{appointmentId}` |
| RF05 — View appointment details | Appointment response |
| RF06 — Request appointments | `POST /api/v1/appointments` |
| Appointment Management module | Appointment Service |
| Retrofit | REST API client |
| Repository Pattern | `AppointmentRepository` |
| Clean Architecture | Hexagonal architecture |
| Room | Mobile local persistence |
| OfflineCacheManager | Future synchronization scope |

The PDR establishes Appointment Management as a key application module and defines consultation, detail and appointment requests as its main functionality.

The PDR also establishes Room for local persistence, Retrofit for remote communication, and Hilt for dependency injection.

---

# 14. Final MVP 1 Backlog

```text
MUST
├── OpenAPI contract
├── Appointment domain
├── Appointment validation
├── Repository port
├── Database entity
├── Database adapter
├── PostgreSQL container
├── RequestAppointment use case
├── GetAppointment use case
├── POST /appointments
├── GET /appointments/{id}
├── /health
├── Error handling
├── Unit tests
└── Integration tests

SHOULD
├── Filtering
├── Pagination
├── Detailed doctor information
└── Extended API documentation

COULD
├── Notifications
├── Calendar integration
├── Appointment reminders
└── Advanced search

WON'T
├── Payments
├── Medication
├── Symptoms
├── Health statistics
├── Medical studies
├── Chat
├── Gamification
└── Complete offline synchronization
```

---

# 15. Final Deliverables

For **Week 4 Session 2**, the team should have these artifacts:

```text
Week 4 - Session 2
│
├── 1. openapi.yaml
│      └── API contract
│
├── 2. MVP 1 Sprint Backlog
│      └── Tasks + User Stories
│
├── 3. Acceptance Criteria
│      └── Testable AC for each story
│
├── 4. Story Point Estimation
│      └── Relative complexity
│
├── 5. MoSCoW Prioritization
│      └── Must / Should / Could / Won't
│
├── 6. Sprint Goal
│      └── Appointment Service MVP 1
│
└── 7. Definition of Done
       └── Conditions for release
```

---

# 16. Conclusion

The objective of Week 4 Session 2 is to transform the **walking skeleton from Session 1 into a committed MVP 1 sprint**.

For GestionTurnosApp, the sprint will focus exclusively on the **Appointment Service** and the requirements RF04, RF05 and RF06.

The MVP will be considered successful when a patient can:

```text
Request an appointment
        ↓
Validate the appointment
        ↓
Persist it in a real database
        ↓
Retrieve the appointment
        ↓
Receive the correct API response
```

The remaining GestionTurnosApp functionality will remain in the backlog for future iterations.

> **MVP reduces scope, not quality.**