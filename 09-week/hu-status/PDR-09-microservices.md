# PDR — 09-microservices: Microservice Documentation

## 1. Purpose
Define the requirements for describing the responsibilities, data, interfaces, events, dependencies, and operations of each Appointment Management App microservice.

## 2. Problem and context
A distributed architecture requires clear service boundaries. Without consistent documentation, duplicated responsibilities, circular dependencies, unauthorized access to another service's data, and difficult deployments may result.

## 3. Objectives
- Maintain a central catalog of services and their statuses.
- Define responsibility boundaries and data ownership.
- Document synchronous and asynchronous communication.
- Record published and consumed events.
- Standardize individual service documentation and operating procedures.

## 4. Scope
Includes a service catalog, boundary rules, dependency map, communication patterns, event catalog, data ownership matrix, per-service models, runbooks, and a production-readiness checklist.

## 5. Functional requirements
- **FR-MS-01:** Each service must document its name, responsibilities, status, and dependencies.
- **FR-MS-02:** Each service must explicitly define the capabilities within its domain.
- **FR-MS-03:** Each service must own its data and expose it through documented interfaces.
- **FR-MS-04:** REST and event-based communication must be described with its purpose and flow.
- **FR-MS-05:** Events must document their name, producer, consumers, main data, and channel when known.
- **FR-MS-06:** Each service must document its data models and link them to `06-data/`.
- **FR-MS-07:** Services that require them must have execution, troubleshooting, and recovery instructions.
- **FR-MS-08:** Before production, each service must pass a readiness checklist covering security, observability, testing, and operations.
- **FR-MS-09:** The dependency map must be reviewed to identify cycles and unnecessary dependencies.

## 6. Non-functional requirements
- **NFR-MS-01:** Service documentation must follow a common template.
- **NFR-MS-02:** Service dependencies must remain explicit and limited.
- **NFR-MS-03:** Operating procedures must account for dependency failures.
- **NFR-MS-04:** Events and contracts must evolve with compatibility controls.
- **NFR-MS-05:** Runbooks must not contain real secrets, passwords, or tokens.

## 7. Rules and constraints
- Do not use shared databases as the integration mechanism between microservices.
- Do not assume every service proposed in the architecture has already been implemented.
- Distinguish existing, in-development, and proposed services.
- Use stable service names and identifiers according to repository conventions.
- Keep documentation consistent with OpenAPI contracts and data models.

## 8. Deliverables
- `service-catalog.md`.
- `service-boundary-rules.md` and `dependency-map.md`.
- `communication-patterns.md` and `event-catalog.md`.
- `data-ownership-matrix.md` and `storage-and-documents.md`.
- A folder for each service containing `README.md`, `data-model.md`, `events.md`, `decisions.md`, and `runbook.md`, as applicable.
- `service-readiness-checklist.md`.

## 9. Acceptance criteria
- [ ] The catalog distinguishes existing, in-development, and proposed services.
- [ ] Each service has defined responsibilities and data ownership.
- [ ] Dependencies and communication paths are documented.
- [ ] Events identify producers and consumers where known.
- [ ] Runbooks include applicable verification and troubleshooting steps.
- [ ] Circular dependencies are not left unexplained and must include a resolution plan.

## 10. Dependencies and traceability
Based on `02-domain/`, `05-architecture/`, `06-data/`, and `07-api/`. It relates to `10-devops/` for execution and deployment, as well as quality and operations documentation.

## 11. Out of scope
Creating or deploying new services as part of documentation alone, unless an approved implementation task exists.
