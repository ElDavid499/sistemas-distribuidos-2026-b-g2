<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       07-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 07

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: Group DAVID FELIPE PERDOMO CASTILLO / ANDY BRAHIAM YARA MEDINA / SEBASTIAN BERMUDEZ
- SPRINT_GOAL: Define the inter-service communication strategy and establish versioned contracts and contract testing practices for reliable service integration.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Define the inter-service communication strategy using synchronous and asynchronous patterns | doing | https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2.git |
| HU-XXX-002 | Define versioned service contracts and consumer-driven contract testing | doing | https://github.com/code-corhuila/appt-mgmt-docs.git |
| HU-XXX-003 | Integrate and validate the appointment management application services | doing | https://github.com/code-corhuila/appointment-management-app.git |

## 2. My individual contribution

- Reviewed and documented the differences between synchronous and asynchronous inter-service communication.
- Compared REST, gRPC, queues, and Pub/Sub messaging according to the communication requirements of the distributed system.
- Reviewed delivery semantics, including at-most-once, at-least-once, and exactly-once processing.
- Documented the importance of idempotent consumers and deduplication when processing messages.
- Documented the use of machine-readable contracts such as OpenAPI, `.proto`, JSON Schema, and Avro.
- Reviewed backward-compatible and breaking changes for service contracts.
- Documented API versioning and deprecation practices.
- Studied Consumer-Driven Contract Testing with Pact and its integration into CI.
- Prepared the Week 7 Session 1 and Session 2 documentation in English.
- Worked with the distributed systems repository and the related documentation and application repositories.

## 3. Blockers and risks

- The main risk is making changes to service contracts without verifying their impact on existing consumers.
- Service integration can be affected by breaking changes if versioning and compatibility rules are not followed.
- Asynchronous communication introduces the possibility of duplicate message delivery, requiring idempotent consumers.
- Synchronous service chains may create cascading failures under high load if timeouts and circuit breakers are not properly configured.
- Contract tests still need to be integrated and verified in the project CI pipeline.

## 4. Plan for next week

- Finalize the Week 7 user stories and their corresponding evidence.
- Publish and validate the service contracts in the repository.
- Define the versioning and backward-compatibility rules for the APIs and events.
- Implement or complete at least one Consumer-Driven Contract Test.
- Integrate contract testing into the CI pipeline.
- Validate the communication strategy between the services.
- Continue the integration work required for MVP 2.
- Verify that the acceptance criteria of the integration stories are testable and documented.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria

## 6. Evidence links

- **Distributed Systems repository:** https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2.git
- **Appointment Management documentation repository:** https://github.com/code-corhuila/appt-mgmt-docs.git
- **Appointment Management application repository:** https://github.com/code-corhuila/appointment-management-app.git
