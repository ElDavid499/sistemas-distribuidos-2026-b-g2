# Distributed Systems
## Week 5 · Session 1 · Containerization with Docker

**CORHUILA**  
Systems Engineering · 2026-B

# GestionTurnosApp — Docker Containerization

## 1. Objective

The objective of this session is to containerize the main components of **GestionTurnosApp** so that the **MVP 1 (Minimum Viable Product 1)** environment can be executed in a reproducible way.

The proposed MVP 1 architecture contains:

- **Frontend:** Android application developed with Kotlin, MVVM and Clean Architecture.
- **Backend:** Appointment Service implemented using Hexagonal Architecture.
- **Database:** PostgreSQL for backend persistence.
- **Local persistence:** Room in the Android application for offline/local data.
- **Infrastructure:** Docker, Docker Compose, environment variables and persistent volumes.

> **Architecture note:** The PDR defines the Android frontend architecture and technologies. The backend REST service, PostgreSQL deployment and Docker infrastructure below are the proposed implementation for the Distributed Systems activities. In this document, **MVP 1 means Minimum Viable Product 1**, not Model-View-Presenter.

---

# 2. Why Containers

A container packages a service with the runtime and dependencies it needs so that the same service can run consistently across different environments.

For GestionTurnosApp, Docker provides a reproducible runtime for the backend and database and allows the MVP 1 environment to be started using a single Docker Compose configuration.

---

# 3. Image vs Container vs Registry

| Concept | Description | GestionTurnosApp example |
|---|---|---|
| Dockerfile | Recipe used to build an image | `appointment-service/Dockerfile` |
| Image | Immutable template used to create containers | `appointment-service:latest` |
| Container | Running instance of an image | `appointment-service` |
| Registry | Repository that stores images | Docker Hub or GHCR |

The basic flow is:

```text
Dockerfile
    │
    ▼
Docker Image
    │
    ▼
Docker Container
```

---

# 4. Complete MVP 1 Architecture

```text
┌─────────────────────────────────────────────┐
│              GestionTurnosApp               │
├─────────────────────────────────────────────┤
│                                             │
│  FRONTEND                                   │
│  Android / Kotlin                           │
│  Clean Architecture                         │
│  Retrofit + Repository + Room               │
│                                             │
└───────────────────┬─────────────────────────┘
                    │
                    │ REST / HTTP
                    ▼
┌─────────────────────────────────────────────┐
│              BACKEND                        │
│           Appointment Service               │
├─────────────────────────────────────────────┤
│ Inbound Adapter / REST Controller            │
│                    │                        │
│                    ▼                        │
│ Application / Use Cases                      │
│ RequestAppointment / GetAppointment          │
│                    │                        │
│                    ▼                        │
│ Domain                                      │
│ Turno / Paciente / Medico                   │
│ Business Rules / Domain Events              │
│                    │                        │
│                    ▼                        │
│ Repository Port                              │
│                    │                        │
│                    ▼                        │
│ PostgreSQL Persistence Adapter               │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│                 DATABASE                    │
│               PostgreSQL                    │
│                                             │
│ appointments / patients / doctors           │
└─────────────────────────────────────────────┘
                    │
                    ▼
             Docker Volume
```

---

# 5. Docker Architecture

Docker Compose is used to run the backend and database together.

```text
┌───────────────────────────────────────────────┐
│              Docker Compose                   │
│                                               │
│  ┌─────────────────────┐                      │
│  │ appointment-service │                      │
│  │      :8080          │                      │
│  └──────────┬──────────┘                      │
│             │                                 │
│             │ database:5432                   │
│             ▼                                 │
│  ┌─────────────────────┐                      │
│  │      PostgreSQL     │                      │
│  │       :5432         │                      │
│  └──────────┬──────────┘                      │
│             │                                 │
│             ▼                                 │
│     appointment-db-data                       │
│          volume                               │
│                                               │
│     gestionturnos-network                     │
└───────────────────────────────────────────────┘
```

The frontend Android application communicates with the backend through HTTP.

During local development, the Android emulator can access the backend through the appropriate host address, while the backend accesses PostgreSQL using the Compose service name:

```text
database:5432
```

---

# 6. Backend — Appointment Service

The Appointment Service is the first backend service selected for MVP 1.

## Responsibilities

The service manages:

- Appointment creation.
- Appointment consultation.
- Appointment status.
- Patient and doctor identifiers associated with appointments.
- Appointment date and time.
- Validation of appointment availability.

## Proposed API

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

### Request Appointment

```http
POST /api/v1/appointments
```

Example request:

```json
{
  "patientId": "P001",
  "doctorId": "D001",
  "date": "2026-09-10",
  "time": "09:00"
}
```

Example response:

```json
{
  "id": "A001",
  "patientId": "P001",
  "doctorId": "D001",
  "date": "2026-09-10",
  "time": "09:00",
  "status": "REQUESTED"
}
```

### Get Appointment

```http
GET /api/v1/appointments/{appointmentId}
```

Example response:

```json
{
  "id": "A001",
  "patientId": "P001",
  "doctorId": "D001",
  "date": "2026-09-10",
  "time": "09:00",
  "status": "REQUESTED"
}
```

---

# 7. Backend Folder Structure

```text
appointment-service/
├── src/
│   ├── main/
│   │   └── kotlin/
│   │       └── com/gestionturnos/appointment/
│   │           ├── domain/
│   │           │   ├── model/
│   │           │   │   ├── Turno.kt
│   │           │   │   ├── Paciente.kt
│   │           │   │   └── Medico.kt
│   │           │   ├── valueobject/
│   │           │   │   ├── FechaTurno.kt
│   │           │   │   ├── HoraTurno.kt
│   │           │   │   └── EstadoTurno.kt
│   │           │   ├── event/
│   │           │   │   ├── TurnoSolicitado.kt
│   │           │   │   ├── TurnoConfirmado.kt
│   │           │   │   └── TurnoCancelado.kt
│   │           │   └── port/
│   │           │       └── AppointmentRepository.kt
│   │           │
│   │           ├── application/
│   │           │   ├── RequestAppointment.kt
│   │           │   └── GetAppointment.kt
│   │           │
│   │           ├── adapters/
│   │           │   ├── inbound/
│   │           │   │   └── AppointmentController.kt
│   │           │   └── outbound/
│   │           │       └── PostgreSQLAppointmentRepository.kt
│   │           │
│   │           └── config/
│   │               └── ApplicationConfig.kt
│   │
│   └── test/
│
├── pom.xml
├── Dockerfile
├── .dockerignore
└── README.md
```

---

# 8. Multi-Stage Dockerfile

The backend uses a multi-stage Dockerfile.

The first stage contains the build tools and produces the application JAR. The second stage contains only the runtime needed to execute the application.

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Why multi-stage?

The final image does not need the complete Maven build environment.

```text
Build Stage
Maven + JDK + source code
        │
        ▼
      app.jar
        │
        ▼
Runtime Stage
JRE + app.jar
```

This produces a smaller runtime image and avoids shipping unnecessary build tools.

---

# 9. `.dockerignore`

The `.dockerignore` prevents unnecessary or sensitive files from being sent to the Docker build context.

```text
.git
.gitignore

.env
.env.*
!.env.example

.idea
.vscode

target
node_modules

*.log

README.md
Dockerfile
docker-compose.yml
```

The most important rule is that secrets such as `.env` files must never be copied into the image.

---

# 10. Database Configuration

The PostgreSQL configuration is provided through environment variables.

Example:

```text
DB_HOST=database
DB_PORT=5432
DB_NAME=appointments
DB_USER=appointment_user
DB_PASSWORD=appointment_password
```

The backend must not hard-code the database host as `localhost`.

Inside Docker Compose, the database is available through its service name:

```text
database:5432
```

This is possible because the containers share the same Docker network.

---

# 11. Docker Compose

The following Compose configuration starts the Appointment Service and PostgreSQL database together.

```yaml
services:

  appointment-service:
    build:
      context: ./appointment-service
      dockerfile: Dockerfile

    container_name: appointment-service

    ports:
      - "8080:8080"

    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: appointments
      DB_USER: appointment_user
      DB_PASSWORD: appointment_password

    depends_on:
      - database

    networks:
      - gestionturnos-network

  database:
    image: postgres:16

    container_name: gestionturnos-database

    environment:
      POSTGRES_DB: appointments
      POSTGRES_USER: appointment_user
      POSTGRES_PASSWORD: appointment_password

    ports:
      - "5432:5432"

    volumes:
      - appointment-db-data:/var/lib/postgresql/data

    networks:
      - gestionturnos-network

networks:
  gestionturnos-network:
    driver: bridge

volumes:
  appointment-db-data:
```

---

# 12. Configuration and Data

## Configuration

Configuration belongs outside the image.

Examples:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

This allows the same image to be used in different environments.

```text
Same Image
    │
    ├── Development configuration
    ├── QA configuration
    └── Production configuration
```

## Data

Database data must not depend on the container's writable layer.

PostgreSQL uses:

```text
appointment-db-data
```

as a Docker volume.

Therefore:

```text
PostgreSQL Container
        │
        ▼
appointment-db-data
        │
        ▼
Persistent database data
```

If the PostgreSQL container is recreated, the volume can preserve the database data.

---

# 13. Frontend

The frontend is the Android application defined in the PDR.

## Technologies

```text
Android
Kotlin
Clean Architecture
Repository Pattern
Retrofit
Room
Hilt
Coroutines
```

## Frontend flow

```text
User
 │
 ▼
View / Fragment
 │
 ▼
ViewModel
 │
 ▼
Use Case
 │
 ▼
Repository
 │
 ├──────────────► Retrofit ──────► Appointment Service
 │
 └──────────────► Room
```

The Android application uses Retrofit to communicate with the backend and Room for local persistence/offline behavior.

---

# 14. Frontend and Backend Communication

For MVP 1, the main communication flow is:

```text
Patient
   │
   ▼
Android App
   │
   │ POST /api/v1/appointments
   ▼
Appointment Service
   │
   ▼
Domain Validation
   │
   ▼
Appointment Repository
   │
   ▼
PostgreSQL
```

For consultation:

```text
Android App
   │
   │ GET /api/v1/appointments/{id}
   ▼
Appointment Service
   │
   ▼
PostgreSQL
   │
   ▼
Appointment
   │
   ▼
Android App
```

---

# 15. Complete Project Structure

A proposed repository structure is:

```text
GestionTurnosApp/
│
├── frontend/
│   └── GestionTurnosApp/
│       ├── app/
│       ├── data/
│       ├── domain/
│       ├── presentation/
│       └── ...
│
├── backend/
│   └── appointment-service/
│       ├── src/
│       ├── pom.xml
│       ├── Dockerfile
│       └── .dockerignore
│
├── database/
│   └── init/
│       └── schema.sql
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# 16. Environment File

A local `.env` file can provide environment-specific configuration.

Example `.env.example`:

```env
POSTGRES_DB=appointments
POSTGRES_USER=appointment_user
POSTGRES_PASSWORD=appointment_password

DB_HOST=database
DB_PORT=5432
```

> Do not commit a real `.env` containing production secrets to the repository.

---

# 17. Running the System

From the project root:

```bash
docker compose up --build
```

This command builds the backend image and starts the backend and PostgreSQL containers.

Check the running containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs appointment-service
```

View database logs:

```bash
docker compose logs database
```

Stop the environment:

```bash
docker compose down
```

Stop containers without removing the volume:

```bash
docker compose down
```

Remove containers and the database volume:

```bash
docker compose down -v
```

> `docker compose down -v` removes the PostgreSQL volume and therefore deletes the persisted database data.

---

# 18. Walking Skeleton / End-to-End Validation

The MVP 1 walking skeleton should demonstrate a complete path from HTTP request to database and back.

## Step 1 — Start the environment

```bash
docker compose up --build
```

## Step 2 — Check the service

```http
GET http://localhost:8080/health
```

Expected response:

```json
{
  "status": "UP",
  "service": "appointment-service"
}
```

## Step 3 — Create an appointment

```http
POST http://localhost:8080/api/v1/appointments
```

Body:

```json
{
  "patientId": "P001",
  "doctorId": "D001",
  "date": "2026-09-10",
  "time": "09:00"
}
```

## Step 4 — Retrieve the appointment

```http
GET http://localhost:8080/api/v1/appointments/A001
```

The created appointment should be returned.

## Step 5 — Restart the environment

```bash
docker compose down
docker compose up
```

## Step 6 — Verify persistence

Request the same appointment again:

```http
GET http://localhost:8080/api/v1/appointments/A001
```

The appointment should still exist because PostgreSQL data is stored in the Docker volume.

---

# 19. Common Mistakes Avoided

## Mistake 1 — Single-stage image

Bad:

```text
Maven + JDK + source code + dependencies + application
```

Solution:

```text
Multi-stage build
        │
        ▼
Small runtime image
```

## Mistake 2 — Copying `.env`

Bad:

```dockerfile
COPY . .
```

when `.env` is inside the build context.

Solution:

```text
.dockerignore
+
runtime environment variables
```

## Mistake 3 — Using localhost for PostgreSQL

Bad:

```text
DB_HOST=localhost
```

inside the backend container.

Correct:

```text
DB_HOST=database
```

because `database` is the Docker Compose service name.

## Mistake 4 — Storing database data only in the container

Bad:

```text
PostgreSQL container
└── database data
```

Correct:

```text
PostgreSQL container
        │
        ▼
Docker volume
```

---

# 20. Security Considerations

The Docker configuration follows these principles:

- Do not bake secrets into Docker images.
- Do not commit production passwords.
- Do not copy `.env` files into images.
- Use environment variables for runtime configuration.
- Keep the runtime image smaller than the build environment.
- Use Docker volumes for persistent database data.
- Use service names instead of hard-coded IP addresses.

For production, secrets should be managed using an appropriate secret-management mechanism rather than storing real credentials directly in a Compose file.

---

# 21. Week 5 Task Board — This Week

| ID | Task | Description | Priority | Points |
|---|---|---|---|---:|
| D01 | Backend Dockerfile | Create multi-stage Dockerfile for Appointment Service | Must | 3 |
| D02 | `.dockerignore` | Exclude secrets, build artifacts and unnecessary files | Must | 2 |
| D03 | PostgreSQL Container | Add PostgreSQL service | Must | 2 |
| D04 | Docker Volume | Persist PostgreSQL data | Must | 2 |
| D05 | Docker Network | Configure shared Compose network | Must | 2 |
| D06 | Environment Config | Configure database through environment variables | Must | 3 |
| D07 | Backend Container | Build and run Appointment Service | Must | 3 |
| D08 | Health Endpoint | Validate backend availability | Must | 1 |
| D09 | Database Connection | Connect backend to PostgreSQL | Must | 3 |
| D10 | Create Appointment | Validate POST endpoint end-to-end | Must | 3 |
| D11 | Get Appointment | Validate GET endpoint end-to-end | Must | 2 |
| D12 | Persistence Test | Restart containers and verify database persistence | Should | 2 |
| D13 | Frontend Integration | Connect Android app to Appointment Service | Should | 3 |
| D14 | Documentation | Document Docker execution and validation | Must | 2 |

---

# 22. Definition of Done

The Week 5 containerization work is considered complete when:

- [ ] The Appointment Service has a multi-stage Dockerfile.
- [ ] The `.dockerignore` excludes `.env`, `.git` and build artifacts.
- [ ] PostgreSQL runs as a Docker Compose service.
- [ ] Backend and database share the same Docker network.
- [ ] The backend connects to PostgreSQL using the service name.
- [ ] Configuration is provided through environment variables.
- [ ] PostgreSQL uses a persistent Docker volume.
- [ ] `docker compose up --build` starts the MVP 1 backend environment successfully.
- [ ] `GET /health` returns `UP`.
- [ ] An appointment can be created through the REST API.
- [ ] An appointment can be retrieved through the REST API.
- [ ] Appointment data survives container recreation when the volume is preserved.
- [ ] The Android frontend can consume the Appointment Service API.
- [ ] No production secrets are stored in the Docker image.
- [ ] The setup and validation steps are documented.

---

# 23. Relationship with MVP 1

The Docker environment provides the runtime base for MVP 1.

```text
MVP 1
 │
 ├── Android Frontend
 │      │
 │      ▼
 │   Retrofit
 │      │
 │      ▼
 ├── Appointment Service
 │      │
 │      ▼
 └── PostgreSQL
        │
        ▼
   Docker Volume
```

The main MVP 1 capability is:

> **A patient can request a medical appointment and retrieve its details through the Appointment Service, with the appointment persisted in a real database.**

---

# 24. Final Deliverables

The Week 5 Session 1 deliverables are:

```text
GestionTurnosApp/
│
├── frontend/
│   └── Android application
│
├── backend/
│   └── appointment-service/
│       ├── Dockerfile
│       ├── .dockerignore
│       └── source code
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Required Docker artifacts

1. `Dockerfile`
2. `.dockerignore`
3. `docker-compose.yml`
4. `.env.example`
5. Docker volume configuration
6. Docker network configuration
7. Documentation of the execution and validation process

---

# 25. Final Architecture

```text
                         USER
                           │
                           ▼
              ┌────────────────────────┐
              │   Android Frontend     │
              │                        │
              │ Kotlin                 │
              │ MVVM                   │
              │ Clean Architecture    │
              │ Retrofit               │
              │ Room                   │
              └───────────┬────────────┘
                          │
                     REST / HTTP
                          │
                          ▼
              ┌────────────────────────┐
              │   Appointment Service  │
              │                        │
              │ REST Controller        │
              │ Application Layer      │
              │ Domain Layer           │
              │ Repository Port        │
              │ PostgreSQL Adapter     │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │      PostgreSQL        │
              │                        │
              │ appointments           │
              │ patients               │
              │ doctors                │
              └───────────┬────────────┘
                          │
                          ▼
                 Docker Volume
              appointment-db-data


              Docker Compose
        ─────────────────────────────
        Shared network:
        gestionturnos-network
```

---

# Conclusion

For **Week 5 Session 1**, GestionTurnosApp is prepared as a containerized MVP 1 environment composed of an Android frontend, an Appointment Service backend and a PostgreSQL database.

The containerization strategy follows the session requirements:

- Multi-stage Dockerfile.
- `.dockerignore`.
- Docker Compose.
- Shared Docker network.
- Environment-based configuration.
- Persistent database volume.
- End-to-end validation.

This structure provides the runtime foundation required for the MVP 1 release and follows the principle that services should be reproducible, configurable and independently deployable.
