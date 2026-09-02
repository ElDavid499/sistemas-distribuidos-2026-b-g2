# Distributed Systems — Week 5 · Session 2
## Release — Shipping MVP 1

**CORHUILA**  
**Systems Engineering · 2026-B**  
**Unit 2 · Release · Corte 1**

**Project:** GestionTurnosApp  
**MVP 1:** Appointment Management — Request and Retrieve Medical Appointments

---

# 1. Release Objective

The objective of this session is to prepare and ship **MVP 1 (Minimum Viable Product 1)** of GestionTurnosApp.

For this project, MVP 1 is the first functional release focused on the **Appointment Management** bounded context. The release must provide a running, reproducible increment in which a patient can:

1. Request a medical appointment.
2. Persist the appointment in a real database.
3. Retrieve the appointment details.
4. Verify the main success and error paths.
5. Run the service through Docker Compose.
6. Demonstrate the complete flow end to end.

> **Important terminology:** MVP 1 means **Minimum Viable Product 1**. It is the first product increment being released. It must not be confused with MVVM. The PDR uses **Clean Architecture + MVVM** as part of the Android frontend architecture, while **MVP 1** describes the product scope/release milestone.

---

# 2. What a Release Actually Is

A release is not a presentation or a collection of unfinished code.

For GestionTurnosApp, the release is a:

> **Versioned, running increment that satisfies its committed acceptance criteria and can be reproduced and executed by someone outside the development team.**

The MVP 1 release is identified by the version tag:

```text
v1.0.0
```

The release should contain the working Appointment Service, its database dependency, the required configuration, tests, documentation, and evidence of the completed acceptance criteria.

---

# 3. MVP 1 Scope

The first release is limited to the Appointment Management flow.

### Included

- Appointment creation/request.
- Appointment retrieval by ID.
- Appointment persistence.
- Appointment status.
- Patient and doctor identifiers.
- Basic domain validation.
- Conflict validation for an occupied appointment slot.
- REST API.
- Real PostgreSQL database.
- Docker containerization.
- Docker Compose execution.
- Unit and integration tests.
- Release documentation.
- Version tag `v1.0.0`.

### Not required for MVP 1

The following features remain outside the first release scope:

- Medication management.
- Symptoms and health statistics.
- Medical study scanning.
- Chat.
- Gamification.
- Advanced offline synchronization.
- Additional appointment features not committed to the MVP 1 sprint.

This keeps the release small while maintaining the required quality standards.

---

# 4. Promote Through the Environments

The release follows the course promotion flow:

```text
hu-xxx-dev
      ↓
   develop
      ↓
      qa
      ↓
     main
      ↓
   v1.0.0
```

Each feature or user story should be developed in its corresponding branch and merged into `develop`.

The integrated increment is then validated in `qa`.

After the release criteria are satisfied, the increment is promoted to `main` and tagged:

```text
v1.0.0
```

The tag identifies the exact version that represents the MVP 1 release.

---

# 5. Release Candidate

Before promoting to `main`, the team should have a release candidate containing:

- Appointment Service.
- PostgreSQL database.
- Dockerfile.
- `.dockerignore`.
- `docker-compose.yml`.
- Environment-based configuration.
- Domain and application layers.
- REST inbound adapter.
- Persistence outbound adapter.
- Unit tests.
- Integration tests.
- README.
- ADR documentation.
- API contract.
- Release evidence.

The release candidate must start successfully from a clean environment.

---

# 6. Release Checklist — Definition of Done

The following checklist is used to determine whether MVP 1 is actually releasable.

## 6.1 Functional Acceptance Criteria

- [ ] A patient can request a medical appointment.
- [ ] The appointment is persisted in PostgreSQL.
- [ ] The created appointment can be retrieved by ID.
- [ ] The appointment contains patient, doctor, date, time and status information.
- [ ] Invalid appointment data is rejected.
- [ ] An occupied doctor/date/time slot returns the appropriate conflict response.
- [ ] The API returns the expected HTTP status codes.
- [ ] The main acceptance criteria from the MVP 1 sprint are satisfied.

---

## 6.2 Testing

- [ ] Unit tests are green.
- [ ] Integration tests are green.
- [ ] Domain validation is tested.
- [ ] Appointment creation is tested.
- [ ] Appointment retrieval is tested.
- [ ] The conflict/error path is tested.
- [ ] The complete end-to-end flow has been executed.
- [ ] Test coverage is at or above the declared project floor, if a floor has been defined.

Example validation:

```text
POST /api/v1/appointments
        ↓
Appointment created
        ↓
PostgreSQL persistence
        ↓
GET /api/v1/appointments/{appointmentId}
        ↓
Appointment returned
```

---

# 7. Docker and Runtime Checklist

The MVP 1 release must be executable through Docker Compose.

Run:

```bash
docker compose up --build
```

Verify:

```bash
docker compose ps
```

The Appointment Service must connect to PostgreSQL through the Compose service name:

```text
database:5432
```

The application must not depend on:

```text
localhost
```

for communication with the database from inside the container.

### Docker checklist

- [ ] Multi-stage Dockerfile is present.
- [ ] `.dockerignore` is present.
- [ ] Runtime image does not contain development tooling unnecessarily.
- [ ] `.env` and secrets are not copied into the image.
- [ ] Configuration is supplied through environment variables.
- [ ] PostgreSQL runs as a separate container.
- [ ] Database data uses a persistent Docker volume.
- [ ] Services communicate through the Docker Compose network.
- [ ] `docker compose up --build` starts the system successfully.

---

# 8. Health Check

The service should expose:

```http
GET /health
```

Expected response:

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

This verifies that the service is running before demonstrating the business functionality.

---

# 9. MVP 1 API Demo

## 9.1 Request an Appointment

```http
POST /api/v1/appointments
Content-Type: application/json
```

Example body:

```json
{
  "patientId": "patient-001",
  "doctorId": "doctor-001",
  "date": "2026-09-15",
  "time": "09:00"
}
```

Expected result:

```http
201 Created
```

Example response:

```json
{
  "id": "appointment-001",
  "patientId": "patient-001",
  "doctorId": "doctor-001",
  "date": "2026-09-15",
  "time": "09:00",
  "status": "REQUESTED"
}
```

---

## 9.2 Retrieve an Appointment

```http
GET /api/v1/appointments/appointment-001
```

Expected result:

```http
200 OK
```

The response should contain the appointment that was persisted by the previous request.

---

## 9.3 Conflict Path

Attempt to request the same doctor's appointment slot again:

```http
POST /api/v1/appointments
```

with the same:

```text
doctorId
date
time
```

Expected result:

```http
409 Conflict
```

This demonstrates that the service is enforcing a key business rule instead of only executing the happy path.

---

# 10. Persistence Demonstration

The demo should prove that the appointment is actually persisted.

### Step 1

Start the system:

```bash
docker compose up --build
```

### Step 2

Create an appointment.

### Step 3

Retrieve the appointment.

### Step 4

Stop the containers:

```bash
docker compose down
```

### Step 5

Start the system again:

```bash
docker compose up
```

### Step 6

Retrieve the appointment again.

The appointment should remain available because PostgreSQL uses the configured Docker volume.

> The exact persistence behavior depends on the final implementation and volume configuration. The release evidence should demonstrate it rather than merely claim it.

---

# 11. Architecture During the Demo

The release should demonstrate the complete request path:

```text
Android Frontend
      |
      | HTTP/REST
      v
Appointment Service
      |
      v
Application Use Case
      |
      v
Domain Model
      |
      v
AppointmentRepository Port
      |
      v
PostgreSQL Adapter
      |
      v
PostgreSQL Database
```

The architecture follows the principles established in the previous sessions:

- Domain rules remain independent of HTTP and persistence.
- Application use cases coordinate the business operation.
- Inbound adapters receive external requests.
- Outbound adapters communicate with infrastructure.
- Dependency inversion is maintained through ports.
- The composition root selects concrete implementations.

---

# 12. Frontend and MVP 1

The Android application is the frontend of GestionTurnosApp.

The PDR defines the Android side using **Clean Architecture + MVVM**.

For this release:

```text
MVP 1
Minimum Viable Product 1
        |
        +-- Android Frontend
        |      Clean Architecture + MVVM
        |
        +-- Appointment Service
        |      REST API
        |
        +-- PostgreSQL
        |      Persistent database
        |
        +-- Docker Compose
               Runtime environment
```

**MVP 1 is the product/release scope. MVVM is only an architectural pattern used by the Android frontend.**

---

# 13. Release Evidence

The team should collect evidence that the release criteria were actually verified.

Recommended evidence:

- [ ] Screenshot or terminal output of `docker compose up --build`.
- [ ] Screenshot/output of `GET /health`.
- [ ] Evidence of successful appointment creation.
- [ ] Evidence of successful appointment retrieval.
- [ ] Evidence of the `409 Conflict` path.
- [ ] Evidence of tests passing.
- [ ] Evidence of PostgreSQL persistence.
- [ ] Git commit containing the release candidate.
- [ ] Git tag `v1.0.0`.
- [ ] Updated README.
- [ ] Updated ADR.
- [ ] CHANGELOG entry.
- [ ] Each team member's weekly `hu-status` evidence.

---

# 14. Version Tag

The MVP 1 release should be tagged:

```bash
git checkout main
git pull
git tag -a v1.0.0 -m "Release MVP 1 - Appointment Management"
git push origin v1.0.0
```

The tag makes the release reproducible and identifies the exact version used for evaluation.

---

# 15. CHANGELOG

Example:

```markdown
# Changelog

## [v1.0.0] - 2026-09-02

### Added
- Appointment Management bounded context.
- Request appointment endpoint.
- Retrieve appointment endpoint.
- Appointment persistence with PostgreSQL.
- Appointment conflict validation.
- Docker Compose runtime.
- Unit and integration tests.

### Documentation
- Updated README.
- Added/updated architecture ADR.
- Added MVP 1 release documentation.
```

The actual release date should be changed if the release is performed on another date.

---

# 16. Demo Script

The demo should focus on **working software**, not slides.

## Step 1 — Explain the MVP

> “MVP 1 is the first functional release of GestionTurnosApp. It focuses on Appointment Management and allows a patient to request and retrieve a medical appointment.”

## Step 2 — Start the environment

```bash
docker compose up --build
```

## Step 3 — Verify health

```http
GET /health
```

Show:

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

## Step 4 — Request an appointment

Execute:

```http
POST /api/v1/appointments
```

Show the successful response.

## Step 5 — Retrieve the appointment

Execute:

```http
GET /api/v1/appointments/{appointmentId}
```

Show that the data persisted.

## Step 6 — Demonstrate the error path

Request the same doctor/date/time slot.

Show:

```http
409 Conflict
```

## Step 7 — Explain the architecture

Point out:

```text
Frontend → REST API → Use Case → Domain → Repository Port → PostgreSQL
```

## Step 8 — Show release evidence

Show:

```text
Tests: PASS
Docker: RUNNING
Database: CONNECTED
Version: v1.0.0
```

## Step 9 — Explain what comes next

Identify the stories that remain for Corte 2.

---

# 17. Retrospective

After the release demo, the team should conduct a short retrospective.

Use three sections:

| What went well | What hurt | What we will change |
|---|---|---|
| What helped the team complete MVP 1? | What caused delays or problems? | What concrete action will improve Corte 2? |
| What worked in the architecture? | What was difficult to test or integrate? | What will be changed? |
| What worked in Docker/Compose? | What configuration problems appeared? | What will be automated? |

The retrospective should produce **concrete backlog items**, not only observations.

---

# 18. Retrospective Backlog

Example:

| ID | Improvement | Priority | Owner | Corte |
|---|---|---|---|---|
| RET-01 | Improve integration test setup | High | Team | Corte 2 |
| RET-02 | Improve API error documentation | Medium | Team | Corte 2 |
| RET-03 | Automate Docker validation | Medium | Team | Corte 2 |
| RET-04 | Improve appointment validation messages | Medium | Team | Corte 2 |

These are examples and should be replaced with the team's actual retrospective conclusions.

---

# 19. Carrying the Backlog Forward

At the end of the corte:

- Completed **Must** stories remain part of the release.
- Unfinished **Should** stories move to the next backlog.
- Unfinished **Could** stories move to the next backlog if still valuable.
- Carried stories should be **re-estimated**.
- Stories should not simply be copied without reviewing their scope.
- New retrospective improvement items should be added to the next backlog.

Example:

```text
Corte 1
  |
  +-- Completed → v1.0.0
  |
  +-- Unfinished Should/Could
  |       ↓
  |    Re-estimate
  |       ↓
  |    Corte 2 backlog
  |
  +-- Retrospective improvements
          ↓
       Corte 2 backlog
```

---

# 20. How MVP 1 Is Evaluated

The release should be evaluated beyond the question:

> “Does it run?”

The important dimensions are:

### Functionality and Demo

- Does the product meet the MVP 1 sprint goal?
- Can the team demonstrate the complete flow?
- Does the error path work?

### Code Quality

- Is the code understandable?
- Are business rules tested?
- Are unit and integration tests green?
- Are responsibilities separated appropriately?

### Architecture

- Are DDD boundaries respected?
- Is the Appointment Management context clearly defined?
- Are hexagonal boundaries respected?
- Are domain rules independent from infrastructure?
- Is dependency inversion maintained?

### Scrum Compliance

- Is the backlog documented?
- Are user stories defined?
- Is the Definition of Done satisfied?
- Is there release evidence?
- Was the retrospective completed?
- Was unfinished work carried forward correctly?

---

# 21. Common Mistakes

Avoid the following:

- Calling the project “released” while tests are red.
- Demonstrating only slides instead of running software.
- Not having a version tag.
- Not updating the CHANGELOG.
- Having a service that does not start from Docker Compose.
- Using hard-coded database addresses.
- Including secrets in the repository or Docker image.
- Demonstrating only the happy path.
- Claiming persistence without verifying it.
- Skipping the retrospective.
- Moving unfinished stories to the next corte without re-estimating them.
- Confusing **MVP 1 (Minimum Viable Product 1)** with **MVVM**, which is an Android frontend architecture pattern.

---

# 22. Self-Check

### Question 1
What is a release?

**Answer:** A versioned, running increment that meets its acceptance criteria and can be reproduced/deployed.

### Question 2
What identifies the MVP 1 release?

**Answer:** Promotion to `main` and the version tag:

```text
v1.0.0
```

### Question 3
If the tests are red or the service does not start, is it released?

**Answer:** No. It is still a draft. MVP reduces scope, not quality standards.

### Question 4
What should the demo show?

**Answer:** The running system executing the sprint goal end to end, including an important error path.

### Question 5
What happens to unfinished Should/Could stories?

**Answer:** They move to the next backlog and are re-estimated.

### Question 6
What does the MVP 1 evaluation consider besides functionality?

**Answer:** Code quality, architecture compliance, testing, and Scrum compliance.

---

# 23. This Corte — Final Deliverables

For **Week 5 Session 2**, the team should finish:

- [ ] MVP 1 release candidate.
- [ ] Acceptance criteria verified.
- [ ] Unit tests green.
- [ ] Integration tests green.
- [ ] Docker Compose execution verified.
- [ ] Real PostgreSQL database verified.
- [ ] Happy path demonstrated.
- [ ] Key error path demonstrated.
- [ ] README updated.
- [ ] ADR updated.
- [ ] CHANGELOG updated.
- [ ] `main` updated.
- [ ] Version `v1.0.0` tagged.
- [ ] Demo completed.
- [ ] Retrospective completed.
- [ ] Corte 2 backlog prepared.
- [ ] Each member's `hu-status` evidence completed.

---

# 24. Relationship with the GestionTurnosApp PDR

The PDR identifies **Appointment Management** as a main module and includes requirements related to:

- Consulting appointments.
- Viewing appointment details.
- Requesting new appointments.

The PDR also defines the Android application architecture and the technologies used by the frontend.

The distributed-systems release activities in this document extend that project definition by organizing the Appointment Management work as a deployable MVP 1 service with REST, PostgreSQL and Docker.

Therefore:

```text
GestionTurnosApp PDR
        |
        v
Appointment Management
        |
        v
MVP 1 — Minimum Viable Product 1
        |
        +-- Request appointment
        +-- Retrieve appointment
        +-- Validate conflict
        +-- Persist in PostgreSQL
        +-- Run with Docker Compose
        +-- Test
        +-- Demo
        +-- Release v1.0.0
```

---

# 25. Final Release Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                  GestionTurnosApp                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Android Frontend                                  │  │
│  │ Kotlin + Clean Architecture + MVVM                │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │ REST                         │
│                          ▼                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Appointment Service                               │  │
│  │                                                   │  │
│  │ Inbound HTTP → Application → Domain → Port        │  │
│  │                                  ↓                │  │
│  │                         Persistence Adapter       │  │
│  └──────────────────────────┬────────────────────────┘  │
│                             │                            │
│                             ▼                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │ PostgreSQL                                        │  │
│  │ Persistent appointment data                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Docker Compose                                        │
└─────────────────────────────────────────────────────────┘

                    RELEASE
                      ↓
                    v1.0.0
```

---

# 26. Final Statement

**MVP 1 is shipped when the Appointment Management increment is running, tested, documented, versioned and demonstrable.**

The final release flow is:

```text
Develop
   ↓
Integrate
   ↓
QA validation
   ↓
Definition of Done
   ↓
Demo
   ↓
Retrospective
   ↓
main
   ↓
v1.0.0
   ↓
Corte 2 backlog
```

The goal is not simply to show that code exists. The goal is to demonstrate that **GestionTurnosApp MVP 1 is a reproducible, tested and working increment of the distributed system**.
