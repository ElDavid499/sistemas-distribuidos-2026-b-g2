<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       06-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 06

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: DAVID FELIPE PERDOMO CASTILLO
- GITHUB_USER: ElDavid499
- TEAM: DAVID FELIPE PERDOMO CASTILLO / ANDY BRAHIAM YARA MEDINA / SEBASTIAN BERMUDEZ
- SPRINT_GOAL: Define and prepare the orchestration strategy for MVP 2 using Docker Compose, health checks, environment-based configuration, persistent volumes, and the Develop/QA/Prod environment flow.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-001 | Docker Compose multi-service system | doing | https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2 |
| HU-002 | Environment-based configuration | doing | https://github.com/code-corhuila/appt-mgmt-docs |
| HU-003 | MVP 2 orchestration planning | doing | https://github.com/code-corhuila/appt-mgmt-docs |

## 2. My individual contribution

- Worked on the documentation and planning for the Week 06 orchestration activities.
- Documented the use of Docker Compose for running multiple services as a system.
- Defined shared network communication using Docker service names.
- Documented health checks and dependency management using `depends_on` and `condition: service_healthy`.
- Defined environment-based configuration for Develop, QA and Prod.
- Documented the use of environment variables instead of hard-coded configuration.
- Defined the branch-to-environment relationship.
- Documented persistent database storage using Docker volumes.
- Identified configuration drift and service startup as risks for MVP 2.

## 3. Blockers and risks

- Services may start before their dependencies are ready to accept connections.
- Configuration differences between Develop, QA and Prod may cause environment-specific failures.
- Environment variable names must remain consistent across services.
- Secrets must not be committed to Git.
- Docker Compose orchestration still needs to be validated with the complete system.
- The exact PR/commit evidence for each HU must be linked before final submission.

## 4. Plan for next week

- Validate the complete system using a single `docker compose up`.
- Verify communication between services through the shared Docker network.
- Test database health checks and dependency conditions.
- Verify configuration through environment variables.
- Validate persistent database storage using Docker volumes.
- Continue the MVP 2 orchestration work.
- Update the HU evidence with the corresponding commit or PR URLs.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
