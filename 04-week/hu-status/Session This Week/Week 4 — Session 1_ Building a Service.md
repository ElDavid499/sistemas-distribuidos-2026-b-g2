# Week 4 — Session 1: Building a Service

## Appointment Service — Structure, Layers and Walking Skeleton

### Project: GestionTurnosApp

For Week 4, the service selected from the previous MVP 1 planning is the **Appointment Service**.

The purpose of this session is to transform the previous domain and service design into a running service using **Hexagonal Architecture**. The first goal is not to implement all appointment functionality, but to create a **walking skeleton** that runs end to end, connects to a real database, and exposes at least one working endpoint.

The PDR identifies **Appointment Management** as one of the main modules of GestionTurnosApp, including appointment listing, appointment details, and requesting new medical appointments.

---

# 1. Service Responsibilities

The **Appointment Service** is responsible for the appointment lifecycle.

Its main responsibilities are:

- Create medical appointments.
- Consult appointments.
- Retrieve appointment details.
- Validate appointment information.
- Validate appointment availability.
- Manage appointment status.
- Persist appointment information.
- Publish appointment-related domain events.

The appointment domain is based on the `Turno` aggregate defined in the previous session.

```text
Appointment Service
│
├── Turno
├── Paciente reference
├── Medico reference
├── FechaTurno
├── HoraTurno
└── EstadoTurno
```

The PDR explicitly defines requirements for consulting appointments, viewing appointment details, and requesting new appointments.

---

# 2. Hexagonal Folder Structure

The folder structure should make the architecture visible immediately.

```text
appointment-service/
│
├── src/
│   │
│   ├── domain/
│   │   ├── model/
│   │   │   ├── Turno
│   │   │   ├── Paciente
│   │   │   ├── Medico
│   │   │   ├── FechaTurno
│   │   │   ├── HoraTurno
│   │   │   └── EstadoTurno
│   │   │
│   │   ├── events/
│   │   │   ├── AppointmentRequested
│   │   │   ├── AppointmentConfirmed
│   │   │   └── AppointmentCancelled
│   │   │
│   │   └── ports/
│   │       └── AppointmentRepository
│   │
│   ├── application/
│   │   └── usecases/
│   │       ├── RequestAppointment
│   │       └── GetAppointment
│   │
│   └── adapters/
│       │
│       ├── inbound/
│       │   └── http/
│       │       ├── AppointmentController
│       │       └── HealthController
│       │
│       └── outbound/
│           └── persistence/
│               ├── AppointmentRepositoryImpl
│               └── Database
│
├── tests/
│   ├── domain/
│   ├── application/
│   └── adapters/
│
└── main
```

This structure follows the course's recommendation that the directory tree should clearly expose the **domain**, **application**, and **adapters**, with inbound and outbound adapters separated.

---

# 3. Layer Responsibilities

## Domain Layer

The domain contains the business rules of appointments.

It must not depend on:

- HTTP.
- REST frameworks.
- Databases.
- Room.
- Retrofit.
- Controllers.
- Infrastructure.

Example:

```text
domain/
├── model/
├── events/
└── ports/
```

The `Turno` aggregate is responsible for enforcing rules such as:

- A patient is required.
- A doctor is required.
- The date and time must be valid.
- An occupied time slot cannot be reserved.
- A cancelled appointment cannot be confirmed again.

---

## Application Layer

The application layer contains the use cases.

For MVP 1, the main use cases are:

```text
RequestAppointment
GetAppointment
```

The use case coordinates the operation but does not contain infrastructure details.

Example:

```text
RequestAppointment
       │
       ▼
Validate request
       │
       ▼
Create Turno
       │
       ▼
Check availability
       │
       ▼
Save through repository port
       │
       ▼
Publish AppointmentRequested
```

---

## Inbound Adapters

Inbound adapters receive requests from external clients.

For the Appointment Service, the first inbound adapter is HTTP.

```text
HTTP Request
     │
     ▼
AppointmentController
     │
     ▼
RequestAppointment
```

The controller should not contain appointment business rules.

---

## Outbound Adapters

Outbound adapters communicate with external infrastructure.

For the walking skeleton, the main outbound adapter is the database repository.

```text
Application
     │
     ▼
AppointmentRepository
     │
     ▼
AppointmentRepositoryImpl
     │
     ▼
Database
```

The application depends on the **port**, not on the concrete database implementation.

---

# 4. Request Journey Through the Layers

A request to create an appointment should travel through the service as follows:

```text
Client
  │
  │ POST /api/v1/appointments
  ▼
HTTP Controller
  │
  ▼
Application Use Case
  │
  ▼
Turno Aggregate
  │
  ├── Validate patient
  ├── Validate doctor
  ├── Validate date/time
  └── Validate business rules
  │
  ▼
AppointmentRepository Port
  │
  ▼
Database Adapter
  │
  ▼
Real Database
```

The important principle is that each layer has one responsibility.

The HTTP controller receives the request, the use case coordinates the operation, the domain makes business decisions, and the repository adapter handles persistence.

---

# 5. Repository Port

The domain/application core should define a repository interface instead of depending directly on a database implementation.

```text
interface AppointmentRepository {

    save(appointment)

    findById(appointmentId)

    existsByDoctorAndDateTime(
        doctorId,
        date,
        time
    )
}
```

The interface belongs to the core.

The implementation belongs to the outbound adapter.

```text
Domain / Application
        │
        ▼
AppointmentRepository
        ▲
        │ implements
        │
AppointmentRepositoryImpl
        │
        ▼
Database
```

This follows Dependency Inversion because the core depends on an abstraction while the infrastructure provides the concrete implementation.

---

# 6. Composition Root

All concrete dependencies should be connected in one place: the **composition root**.

For the Appointment Service:

```text
main
 │
 ├── create Database
 │
 ├── create AppointmentRepositoryImpl
 │
 ├── inject repository into RequestAppointment
 │
 ├── inject use case into AppointmentController
 │
 └── start HTTP server
```

Conceptually:

```text
Database
   │
   ▼
AppointmentRepositoryImpl
   │
   ▼
RequestAppointment
   │
   ▼
AppointmentController
   │
   ▼
HTTP Server
```

The use case must not create its own database dependency.

### Incorrect

```text
class RequestAppointment {

    repository = new PostgresAppointmentRepository()

}
```

### Correct

```text
class RequestAppointment {

    constructor(repository) {
        this.repository = repository
    }

}
```

The concrete implementation is injected from the composition root.

This makes the service easier to test and allows the database implementation to be replaced without modifying the domain or application layers.

---

# 7. Walking Skeleton

For MVP 1, the walking skeleton will be the smallest possible end-to-end implementation.

It will contain:

1. A running Appointment Service.
2. A `/health` endpoint.
3. A real database connection.
4. An `Appointment` persistence model.
5. One endpoint that creates an appointment.
6. One endpoint that retrieves an appointment.
7. The complete flow through the architecture.

The course defines a walking skeleton as the thinnest end-to-end slice that actually runs, rather than simply having code that compiles.

---

# 8. Health Endpoint

The first endpoint verifies that the service is running.

```text
GET /health
```

### Response

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

Expected result:

```text
HTTP 200 OK
```

This endpoint does not contain business logic. Its purpose is to verify that the application starts correctly and can receive HTTP requests.

---

# 9. Persisted Appointment Entity

The walking skeleton must also demonstrate persistence using a real database.

The first persisted entity will be `Turno`.

```text
Turno
├── id
├── patientId
├── doctorId
├── date
├── time
└── status
```

Example database record:

```json
{
  "id": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "REQUESTED"
}
```

The PDR already establishes local persistence through Room and remote communication through Retrofit/API.

For the distributed-service exercise, the important requirement is that the service connects to an actual database at runtime rather than using only an in-memory mock.

---

# 10. Create Appointment Endpoint

The first real business endpoint will be:

```text
POST /api/v1/appointments
```

### Request

```json
{
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00"
}
```

### Processing

```text
POST /api/v1/appointments
          │
          ▼
AppointmentController
          │
          ▼
RequestAppointment
          │
          ▼
Turno
          │
          ▼
AppointmentRepository
          │
          ▼
Real Database
```

### Response

```text
201 Created
```

```json
{
  "id": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "REQUESTED"
}
```

---

# 11. Get Appointment Endpoint

The second endpoint verifies that the persisted entity can be retrieved.

```text
GET /api/v1/appointments/{appointmentId}
```

### Example

```text
GET /api/v1/appointments/APT-001
```

### Response

```text
200 OK
```

```json
{
  "id": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "REQUESTED"
}
```

If the appointment does not exist:

```text
404 NOT_FOUND
```

```json
{
  "error": {
    "code": "APPOINTMENT_NOT_FOUND",
    "message": "Appointment not found"
  }
}
```

---

# 12. Complete Walking Skeleton

The final structure should look like this:

```text
                         ┌──────────────────┐
                         │      Client      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  HTTP Adapter    │
                         │   Controller     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Application   │
                         │    Use Cases     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Domain       │
                         │      Turno       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Repository Port  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Database Adapter │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Real Database  │
                         └──────────────────┘
```

This proves the entire request path from the HTTP adapter to real persistence.

---

# 13. Docker / Real Database

The service should run together with a real database in containers.

Conceptually:

```text
Docker Environment
│
├── appointment-service
│
└── database
```

Example:

```text
appointment-service
       │
       │ database connection
       ▼
    PostgreSQL
```

The exact database technology can depend on the team's implementation, but the important requirement for the walking skeleton is that the service starts against a **real database**.

The objective is to validate the runtime environment early instead of waiting until the end of development.

---

# 14. Runtime Validation

The walking skeleton is considered successful when the following sequence works:

### Step 1 — Start the containers

```text
docker compose up
```

### Step 2 — Verify the service

```text
GET /health
```

Expected:

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

### Step 3 — Create an appointment

```text
POST /api/v1/appointments
```

Expected:

```text
201 Created
```

### Step 4 — Retrieve the appointment

```text
GET /api/v1/appointments/APT-001
```

Expected:

```text
200 OK
```

### Step 5 — Verify persistence

Restart the service and request the appointment again.

```text
GET /api/v1/appointments/APT-001
```

The appointment should still exist because it was persisted in the real database.

---

# 15. Relationship With the PDR Architecture

The walking skeleton complements the architecture already defined in the PDR.

| PDR Component | Appointment Service |
|---|---|
| MVVM | Used by the Android client |
| Repository Pattern | Used between application and data access |
| Room | Local mobile persistence |
| Retrofit | Remote API communication |
| OfflineCacheManager | Mobile offline resilience |
| Appointment Management | Main bounded context |
| Turno | Appointment aggregate |
| Appointment API | Service interface |
| Database | Service persistence |

The PDR specifically describes a data layer using the Repository Pattern, Room for local persistence, Retrofit for remote APIs, and `OfflineCacheManager` for offline support.

Therefore, the Week 4 service does not replace the Android architecture. Instead, it introduces the backend/service boundary that the Android application can consume through its remote API.

---

# 16. Walking Skeleton Acceptance Criteria

### AC1 — Service starts

**Given** the Appointment Service and database are running,

**When** the application starts,

**Then** the service successfully connects to the database and starts accepting HTTP requests.

---

### AC2 — Health endpoint works

**Given** the Appointment Service is running,

**When** the client calls:

```text
GET /health
```

**Then** the service returns:

```text
200 OK
```

with the service status.

---

### AC3 — Appointment is persisted

**Given** valid appointment data,

**When** the client calls:

```text
POST /api/v1/appointments
```

**Then** the service creates the appointment and persists it in the real database.

---

### AC4 — Appointment can be retrieved

**Given** an appointment exists in the database,

**When** the client calls:

```text
GET /api/v1/appointments/{id}
```

**Then** the service returns the persisted appointment.

---

### AC5 — Persistence survives restart

**Given** an appointment has been persisted,

**When** the service is restarted,

**Then** the appointment can still be retrieved from the database.

---

### AC6 — Invalid appointment is rejected

**Given** invalid appointment information,

**When** the client sends a creation request,

**Then** the service rejects the request with an appropriate error response.

---

# 17. Definition of Done

The Week 4 walking skeleton will be considered complete when:

- [x] Hexagonal folder structure is defined.
- [x] Domain is separated from infrastructure.
- [x] Application use cases are defined.
- [x] Inbound HTTP adapter is defined.
- [x] Outbound persistence adapter is defined.
- [x] Repository is represented as a port.
- [x] Dependencies are wired at the composition root.
- [x] `/health` endpoint is available.
- [x] Appointment entity can be persisted.
- [x] Appointment can be retrieved.
- [x] Service runs against a real database.
- [x] The complete request path works end to end.
- [x] Persistence is verified after restarting the service.

---

# 18. Final Architecture

```text
                    APPOINTMENT SERVICE
┌─────────────────────────────────────────────────────┐
│                                                     │
│   INBOUND             APPLICATION        DOMAIN     │
│                                                     │
│ ┌─────────────┐     ┌──────────────┐  ┌──────────┐ │
│ │ HTTP        │────►│ Use Cases    │─►│  Turno   │ │
│ │ Controller  │     │              │  │ Aggregate│ │
│ └─────────────┘     └──────────────┘  └────┬─────┘ │
│                                            │       │
│                                            ▼       │
│                                  ┌────────────────┐│
│                                  │ Repository Port││
│                                  └───────┬────────┘│
│                                          │         │
│   OUTBOUND                               ▼         │
│                                  ┌────────────────┐│
│                                  │ DB Adapter     ││
│                                  └───────┬────────┘│
│                                          │         │
└──────────────────────────────────────────┼─────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Real Database│
                                    └──────────────┘
```

## Conclusion

For Week 4, the proposed implementation for **GestionTurnosApp** is to build the **Appointment Service** as the first concrete service derived from the previous MVP 1 design.

The service follows Hexagonal Architecture by separating the **domain**, **application**, and **adapters**. Dependencies are connected at the composition root, while the repository is exposed as a port so that the domain and application layers remain independent of the database.

The first deliverable is the **walking skeleton**: a running service with `/health`, appointment persistence, and appointment retrieval through a real database. This provides an end-to-end foundation on which the MVP 1 appointment-request functionality can be built in the following sessions.

> **Note:** The PDR supports the Appointment Management module, its requirements, and the existing Android architecture. The specific backend service structure, containerized database, composition root, and walking skeleton described here are the proposed implementation for this Week 4 exercise, not features explicitly documented as already implemented in the PDR.