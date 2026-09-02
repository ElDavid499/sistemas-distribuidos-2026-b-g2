<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       05-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 05

* FULL_NAME: DAVID FELIPE PERDOMO CASTILLO
* GITHUB_USER: ElDavid499
* TEAM: SALUD ACTIVA
* SPRINT_GOAL: Containerize the MVP 1 Appointment Service using Docker and Docker Compose, with a multi-stage Dockerfile, environment-based configuration, persistent database storage, and service networking.

## 1. User stories worked this week

| HU ID      | Title                                                             | Status (todo/doing/done) | Evidence (PR or commit URL) |
| ---------- | ----------------------------------------------------------------- | ------------------------ | --------------------------- |
| HU-APP-016 | Define Docker containerization strategy for MVP 1                 | done                     | In progress                 |
| HU-APP-017 | Create multi-stage Dockerfile                                     | doing                    | In progress                 |
| HU-APP-018 | Define `.dockerignore`                                            | done                     | In progress                 |
| HU-APP-019 | Configure env vars without secrets                                | done                     | In progress                 |
| HU-APP-020 | Define Docker Compose config for Appointment Service + PostgreSQL | doing                    | In progress                 |
| HU-APP-021 | Configure Docker service networking                               | doing                    | In progress                 |
| HU-APP-022 | Configure persistent PostgreSQL storage using volumes             | doing                    | In progress                 |
| HU-APP-023 | Prepare containerized runtime environment for MVP 1               | doing                    | In progress                 |

## 2. My individual contribution

* Defined the Docker containerization strategy for MVP 1.
* Planned a multi-stage Dockerfile to separate the build environment from the runtime environment.
* Defined a `.dockerignore` strategy to avoid unnecessary files and prevent sensitive files from being included in the image.
* Planned environment-based configuration instead of hard-coded configuration values.
* Defined the Docker Compose structure for the Appointment Service and PostgreSQL database.
* Defined service-to-service communication using Docker Compose service names.
* Planned persistent PostgreSQL storage using Docker volumes.
* Reviewed common Docker mistakes such as large single-stage images, copying `.env` files into images, storing database data inside containers, and using hard-coded IP addresses.
* Maintained the distinction between **MVP 1 (Minimum Viable Product 1)** and **MVVM (Model-View-ViewModel)**. MVP 1 defines the first functional product increment, while MVVM is an Android frontend architecture pattern.
* Connected the containerization plan with the previously defined Hexagonal Architecture and Appointment Service boundaries.

## 3. Blockers and risks

* The complete Docker environment is still being implemented and validated.
* The Dockerfile, Docker Compose configuration, PostgreSQL database, volume persistence, and environment configuration require end-to-end validation.
* The Appointment Service must be validated against a real PostgreSQL database inside the containerized environment.
* Automated tests and containerized integration tests still need to be completed and verified.
* Evidence for the implementation work is currently **in progress** and will be updated as the corresponding commits and pull requests are completed.

## 4. Plan for next week

* Complete and validate the multi-stage Dockerfile.
* Complete the Docker Compose configuration.
* Build and run the Appointment Service container.
* Start PostgreSQL using Docker Compose.
* Validate communication between the Appointment Service and PostgreSQL.
* Validate persistent database storage using Docker volumes.
* Validate environment variables and ensure that no secrets are included in the Docker image.
* Test the Appointment Service API using the real PostgreSQL database.
* Complete unit and integration tests.
* Update the README with the containerization and execution instructions.

## 5. Compliance self-check

* Conventional Commits — checked
* Per-environment HU branch + PR — in progress
* Testable AC — checked
* Tests added/updated — in progress
* DDD/hexagonal boundaries — checked
* No secrets/config via env — checked

## 6. Evidence links
* https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2.git
* https://github.com/code-corhuila/appt-mgmt-docs.git
* Architecture/containerization strategy: In progress
* Multi-stage Dockerfile: In progress
* `.dockerignore`: In progress
* Docker Compose configuration: In progress
* PostgreSQL volume configuration: In progress
* Environment configuration: In progress
* Containerized runtime: In progress
* PR/commits: In progress

