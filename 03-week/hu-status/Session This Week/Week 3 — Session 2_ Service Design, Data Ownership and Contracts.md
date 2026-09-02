# Week 3 — Session 2: Service Design, Data Ownership and Contracts

## This Week: MVP 1 Planning

For **MVP 1**, the selected vertical feature is **requesting a medical appointment** within the **Appointment Management** bounded context.

The goal is to define the service contracts, establish data ownership, protect the domain from external models using an Anti-Corruption Layer (ACL), and divide the feature into small stories with testable acceptance criteria.

The PDR identifies appointment management as a core module and includes requirements for consulting appointments, viewing appointment details, and requesting new medical appointments.

---

## 1. Service Contracts

For MVP 1, the system will use a combination of **synchronous REST APIs** and **asynchronous domain events**.

The course recommends synchronous communication when an immediate decision is required and asynchronous events when the caller does not need an immediate response.

### Appointment Service — Synchronous API

#### Get Appointment Details

```text
GET /api/v1/appointments/{appointmentId}
```

**Response — 200 OK**

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

**Errors**

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

### Request a New Appointment

```text
POST /api/v1/appointments
```

**Request**

```json
{
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00"
}
```

**Response — 201 Created**

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

**Possible errors**

```text
400 BAD_REQUEST
```

```json
{
  "error": {
    "code": "INVALID_APPOINTMENT",
    "message": "Invalid appointment data"
  }
}
```

```text
409 CONFLICT
```

```json
{
  "error": {
    "code": "TIME_SLOT_UNAVAILABLE",
    "message": "The selected time slot is not available"
  }
}
```

The contract defines the method, path, request, response, and errors, following the course requirement for versioned and testable service contracts.

---

## 2. Asynchronous Domain Events

The Appointment Service can publish events when important changes occur.

### `AppointmentRequested`

```json
{
  "eventType": "AppointmentRequested",
  "version": 1,
  "appointmentId": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001",
  "date": "2026-09-10",
  "time": "10:00"
}
```

### `AppointmentConfirmed`

```json
{
  "eventType": "AppointmentConfirmed",
  "version": 1,
  "appointmentId": "APT-001",
  "patientId": "PAT-001",
  "doctorId": "DOC-001"
}
```

### `AppointmentCancelled`

```json
{
  "eventType": "AppointmentCancelled",
  "version": 1,
  "appointmentId": "APT-001",
  "reason": "Patient cancelled the appointment"
}
```

These events allow other services to react without directly accessing the Appointment Service database.

---

## 3. Data Ownership

The main rule is that **each piece of data has exactly one owning service**. Other services must consume the owner's contract instead of accessing its database directly.

| Data | Owner | Reason |
|---|---|---|
| User account | User/Auth Service | Owns authentication and user identity |
| Patient profile | User/Patient Service | Owns patient information |
| Appointment | Appointment Service | Owns appointment lifecycle |
| Appointment status | Appointment Service | Controlled by the appointment aggregate |
| Doctor availability | Appointment Service | Required to validate appointment slots |
| Medication | Health Service | Owns medication tracking |
| Symptoms | Health Service | Owns symptom records |
| Health statistics | Health Service | Owns health-related statistics |
| Medical studies | Medical Studies Service | Owns medical study information |
| Chat messages | Communication Service | Owns communication data |
| Achievements | Gamification Service | Owns achievement information |

The PDR already separates the application into modules such as Authentication, Appointment Management, Health/Medication, Medical Studies, Communication, and Gamification.

### Important Rule

No service should directly read or write another service's database.

```text
BAD:

Appointment Service ──────► User Database
Appointment Service ──────► Health Database


GOOD:

Appointment Service ──► User Service Contract
Appointment Service ──► Appointment Database
```

This avoids creating a distributed monolith through shared database access.

---

## 4. Anti-Corruption Layer (ACL)

An **Anti-Corruption Layer** will be used whenever the Appointment Service consumes an external or legacy model.

The ACL translates the external representation into the application's internal domain model so that external naming and rules do not leak into the domain.

### Example

Suppose an external medical system returns:

```json
{
  "patient_code": "PAT-001",
  "appointment_state": "AGENDADA",
  "appointment_date": "10/09/2026",
  "appointment_hour": "10:00 AM"
}
```

The ACL converts it into the internal model:

```text
patient_code
      ↓
patientId

appointment_state
      ↓
CONFIRMED

appointment_date
      ↓
FechaTurno

appointment_hour
      ↓
HoraTurno
```

The domain therefore works with its own concepts:

```text
Appointment
PatientId
FechaTurno
HoraTurno
EstadoTurno
```

instead of depending directly on the external system's terminology.

---

## 5. First Vertical Feature for MVP 1

### Feature: Request a Medical Appointment

**As a patient, I want to request a medical appointment so that I can schedule a consultation with a doctor.**

This is a thin vertical slice because it goes from the user interface through the application and domain layers to persistence/API and can be demonstrated end to end.

The course recommends vertical slices that work from UI/API → use case → domain → data instead of horizontal tasks such as building all databases first.

---

## 6. User Stories

### Story 1 — View Available Appointments

**As a patient, I want to view available appointment slots so that I can choose a suitable date and time.**

#### Acceptance Criteria

- **Given** the patient is authenticated,
- **When** the patient opens the appointment request screen,
- **Then** the system displays available doctors, dates, and time slots.

- **Given** there are no available slots,
- **When** the patient opens the appointment request screen,
- **Then** the system displays an appropriate empty state.

---

### Story 2 — Request an Appointment

**As a patient, I want to select an available appointment slot so that I can request a medical appointment.**

#### Acceptance Criteria

- **Given** an available time slot,
- **When** the patient selects the doctor, date, and time,
- **Then** the system sends a request to the Appointment Service.

- **Given** the selected slot is still available,
- **When** the request is processed,
- **Then** a new appointment is created with status `REQUESTED`.

- **Given** the selected slot is no longer available,
- **When** the request is processed,
- **Then** the system returns a `TIME_SLOT_UNAVAILABLE` error.

---

### Story 3 — View Appointment Details

**As a patient, I want to view the details of my requested appointment so that I can verify the information.**

#### Acceptance Criteria

- **Given** the appointment exists,
- **When** the patient opens its details,
- **Then** the system displays the doctor, date, time, and status.

- **Given** the appointment does not exist,
- **When** the patient requests its details,
- **Then** the system displays an appointment-not-found error.

---

## 7. End-to-End MVP Flow

```text
Patient
   │
   ▼
Appointment Screen
   │
   ▼
ViewModel
   │
   ▼
Repository
   │
   ▼
Appointment API
   │
   ▼
Appointment Service
   │
   ├── Validate Patient
   ├── Validate Doctor
   ├── Validate Date/Time
   ├── Check Availability
   └── Create Turno
          │
          ▼
    Appointment Database
          │
          ▼
 AppointmentRequested Event
```

For the Android implementation, the PDR already specifies a Repository Pattern, Room for local persistence, Retrofit for remote REST APIs, and an `OfflineCacheManager` for offline operation.

---

## 8. MVP 1 Summary

| Requirement | MVP 1 Decision |
|---|---|
| Bounded Context | Appointment Management |
| First Vertical Feature | Request a Medical Appointment |
| Main Service | Appointment Service |
| Synchronous Communication | REST API |
| Asynchronous Communication | Domain Events |
| Aggregate Root | `Turno` |
| Appointment Data Owner | Appointment Service |
| Patient Data Owner | User/Patient Service |
| External Integration Protection | Anti-Corruption Layer |
| Main Event | `AppointmentRequested` |
| Persistence | Room / remote API according to the architecture |
| MVP Stories | View slots, request appointment, view details |

### Important Note

The PDR defines the application's modules, appointment requirements, REST/Retrofit architecture, local Room persistence, and offline strategy, but it does **not** explicitly define distributed services, service contracts, data ownership, or ACLs. Therefore, the service boundaries and contracts above are a **proposed design for MVP 1**, created from the PDR and the Session 2 DDD/service-design requirements. 