<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: David Felipe Perdomo Castillo / Andy Brahiam Yara Medina / Sebastian Bermudez
- SPRINT_GOAL: Prepare and validate the integrated MVP 2 release, focusing on distributed persistence, reliable event delivery, data consistency, and release readiness.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-001 | Backend — Distributed Persistence and Data Consistency | doing | https://github.com/code-corhuila/appt-mgmt-docs.git |
| HU-003 | MVP Delivery — Integrated MVP 2 Release and Validation | doing | https://github.com/code-corhuila/appt-mgmt-docs.git |

## 2. My individual contribution
- Prepared technical documentation about database-per-service, Saga, Outbox, CQRS, and eventual consistency.
- Reviewed how compensating actions, reliable event publishing, and idempotent consumers help maintain consistency across distributed services.
- Prepared release-readiness checks for MVP 2, including environment configuration, automated testing, health checks, and rollback preparation.
- Identified the importance of demonstrating successful workflows and controlled failure scenarios before considering the release ready.

## 3. Blockers and risks
- Cross-service operations may leave inconsistent data if compensating actions and retry mechanisms are not correctly implemented.
- Events may be lost or processed more than once without reliable event publishing and idempotent consumers.
- Missing environment variables or incorrect configuration may prevent the application from starting correctly after deployment.
- The MVP 2 release should not be considered complete until integration tests, end-to-end workflows, and failure scenarios have been verified.

## 4. Plan for next week
- Complete pending MVP 2 release tasks and validate the integrated system.
- Run unit, integration, contract, and end-to-end tests.
- Validate Saga compensation and Outbox event delivery where implemented.
- Review environment variables, health checks, release notes, and rollback instructions.
- Record test results and evidence, and prepare the backlog for the next sprint.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (`hu-xxx-dev` -> `develop`, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
- Documentation repository: https://github.com/code-corhuila/appt-mgmt-docs.git
- Application repository: https://github.com/code-corhuila/appointment-management-app.git
- Week 10 documentation and release work: https://github.com/code-corhuila/appt-mgmt-docs.git
