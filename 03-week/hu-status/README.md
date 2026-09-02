<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       03-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 03

* **FULL_NAME:** DAVID FELIPE PERDOMO CASTILLO
* **GITHUB_USER:** ElDavid499
* **TEAM:** Salud Activa
* **SPRINT_GOAL:** Define the Appointment Management domain and plan the first MVP 1 vertical slice using DDD, Hexagonal Architecture, service contracts, data ownership, and an Anti-Corruption Layer.

## 1. User stories worked this week

| **HU ID**  | **Title**                                                  | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | ---------------------------------------------------------- | ---------------------------- | ------------------------------- |
| HU-APP-001 | Model the Appointment Management bounded context using DDD | done                         | TBD                             |
| HU-APP-002 | Define the `Turno` aggregate and its domain invariants     | done                         | TBD                             |
| HU-APP-003 | Define Appointment domain events                           | done                         | TBD                             |
| HU-APP-004 | Define Appointment Service data ownership                  | done                         | TBD                             |
| HU-APP-005 | Define Appointment Service API and event contracts         | done                         | TBD                             |
| HU-APP-006 | Define the Anti-Corruption Layer for external models       | done                         | TBD                             |
| HU-APP-007 | Slice MVP 1: Request a Medical Appointment                 | done                         | TBD                             |

## 2. My individual contribution

* Selected **Appointment Management** as the bounded context for MVP 1.
* Defined `Turno` as the Appointment aggregate root.
* Identified the main domain entities: `Turno`, `Paciente`, and `Medico`.
* Defined value objects for appointment date, time, and status.
* Defined the main appointment invariants, including valid date/time, patient and doctor requirements, occupied-slot validation, and valid state transitions.
* Defined the domain events `TurnoSolicitado`, `TurnoConfirmado`, and `TurnoCancelado`.
* Planned the Appointment Service as the owner of appointment data and status.
* Defined the initial synchronous REST contracts for creating and retrieving appointments.
* Defined asynchronous appointment events for communication between contexts.
* Designed the Anti-Corruption Layer to prevent external models from leaking into the Appointment domain.
* Selected **Request a Medical Appointment** as the first MVP 1 vertical slice.

## 3. Blockers and risks

* The PDR does not define the complete backend microservice boundaries or final API contracts, so the service design is currently a proposed design.
* The synchronization strategy between online and offline functionality still requires further definition.
* Appointment availability requires coordination between appointment data and doctor/time-slot information.
* The final implementation and integration evidence still need to be completed and linked to the corresponding PRs or commits.

## 4. Plan for next week

* Define the Appointment Service project structure using Hexagonal Architecture.
* Separate domain, application, inbound adapters, and outbound adapters.
* Define repository ports and persistence adapters.
* Implement the first walking skeleton for the Appointment Service.
* Create the health endpoint and the first appointment persistence flow.
* Prepare the service to work with a real database.

## 5. Compliance self-check

* [x] Conventional Commits - `type(scope): summary`
* [x] Per-environment HU branch + PR to that environment (`hu-xxx-dev -> develop`, ...)
* [x] Testable acceptance criteria
* [ ] Tests added/updated (unit / integration)
* [x] DDD / hexagonal boundaries respected (domain has no I/O)
* [x] No secrets; config via environment variables

## 6. Evidence links
* https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2.git
* https://github.com/code-corhuila/appt-mgmt-docs.git


* PDR: `TBD`
* Week 3 Session 1 deliverable: `TBD`
* Week 3 Session 2 deliverable: `TBD`
* Appointment Service design: `TBD`
* Pull Request / Commit: `TBD`

