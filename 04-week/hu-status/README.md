<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       04-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 04

- FULL_NAME: DAVID FELIPE PERDOMO CASTILLO
- GITHUB_USER: ElDavid499
- TEAM: SALUD ACTIVA
- SPRINT_GOAL: Define the Appointment Service hexagonal structure and plan the MVP 1 vertical slice, including ports, adapters, persistence, API contracts, and a walking skeleton.

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-APP-008 | Define the Appointment Service hexagonal architecture structure | done | Pending |
| HU-APP-009 | Define the Appointment domain, application, inbound and outbound layers | done | Pending |
| HU-APP-010 | Define the AppointmentRepository port and persistence adapter boundary | done | Pending |
| HU-APP-011 | Define the application use cases for requesting and retrieving appointments | done | Pending |
| HU-APP-012 | Define the composition root and dependency injection flow | done | Pending |
| HU-APP-013 | Plan the walking skeleton with health endpoint and real database | in progress | Pending |
| HU-APP-014 | Define the MVP 1 API contract and endpoint acceptance criteria | done | Pending |
| HU-APP-015 | Plan the MVP 1 sprint backlog using story points and priorities | done | Pending |

## 2. My individual contribution

- Defined the proposed Hexagonal Architecture structure for the Appointment Service.
- Separated the domain, application, inbound adapter, and outbound adapter layers.
- Defined the `Turno` aggregate independently from HTTP and persistence technologies.
- Defined the `AppointmentRepository` port as an abstraction for persistence.
- Defined the main application use cases for requesting and retrieving appointments.
- Designed the request flow from the HTTP adapter through the application layer and domain to the repository port.
- Defined the composition root and dependency injection flow.
- Planned the walking skeleton with a health endpoint, real database, and appointment persistence.
- Defined the MVP 1 API endpoints and testable acceptance criteria.
- Planned the MVP 1 sprint backlog using story points and priorities.
- Maintained the principle that the domain must remain independent of infrastructure concerns.

## 3. Blockers and risks

- The PDR defines the Appointment Management requirements but does not provide a complete backend implementation.
- Concrete persistence and infrastructure integration are still in progress.
- The walking skeleton requires validation with a real database and containerized environment.
- API implementation and automated tests are still pending.
- Evidence links will be added when the corresponding commits and pull requests are available.

## 4. Plan for next week

- Implement the Appointment Service structure.
- Implement the `Turno` domain model and business rules.
- Implement the application use cases.
- Implement the repository port and persistence adapter.
- Configure the real database.
- Implement the `/health` endpoint.
- Implement the appointment creation and retrieval endpoints.
- Validate the walking skeleton end-to-end.
- Add unit and integration tests.
- Prepare the Docker environment for the MVP 1 service.

## 5. Compliance self-check

- Conventional Commits: Checked
- Per-environment HU branch and PR: In Progress
- Testable Acceptance Criteria: Checked
- Tests added/updated: Pending implementation
- DDD and Hexagonal Architecture boundaries: Checked
- No secrets in source code: Checked
- Configuration through environment variables: Planned
- Persistence data handled outside the domain layer: Checked

## 6. Evidence links
- https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2.git
- https://github.com/code-corhuila/appt-mgmt-docs.git
- Architecture/service design: Pending
- Service structure: Pending
- MVP 1 planning: Pending
- Walking skeleton: Pending
- Pull requests/commits: Pending

## Relationship Between Week 04 and the Project Requirements

Week 04 serves as a **guide and planning document** to help the team meet the technical requirements of GestionTurnosApp.

The main purpose of this week is to define how the **Appointment Service** should be structured using DDD and Hexagonal Architecture. It establishes the proposed domain, application layer, ports, adapters, persistence boundary, dependency injection flow, API endpoints, and the MVP 1 vertical slice.

The activities in Week 04 should be understood as a **roadmap for implementation and validation**. They describe what needs to be developed and verified to progressively fulfill the project requirements.

The work includes:

* Defining the Appointment Service structure.
* Separating domain, application, inbound adapters, and outbound adapters.
* Defining the `Turno` aggregate and its business rules.
* Defining the `AppointmentRepository` port.
* Planning the application use cases.
* Defining the API endpoints and acceptance criteria.
* Planning the walking skeleton with a real database.
* Organizing the MVP 1 sprint backlog.

Therefore, Week 04 is used as a **technical guide to move from the project design toward the implementation of MVP 1**, rather than as a statement that all planned implementation activities have already been completed.


