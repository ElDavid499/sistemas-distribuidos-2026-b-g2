<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: David Felipe Perdomo Castillo, Andy Brahiam Yara Medina, Sebastian Bermudez Gutierrez
- SPRINT_GOAL: Validate the production readiness of Salud Activa through integration, contract, end-to-end, load, and chaos testing, and prepare the MVP 3 release with operational evidence and documentation.

## 1. User stories worked this week

| **HU ID** | **Title** | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | --------- | ---------------------------- | ------------------------------- |
| HU-001 |  Validate integration, contract, and resilience tests across backend services | todo | In progress |
| HU-002 |  Validate critical end-to-end user journeys | todo | In progress |
| HU-003 |  Prepare and validate the MVP 3 production-grade release | todo | In progress |

## 2. My individual contribution

- Reviewed the distributed testing pyramid and the role of unit, integration, contract, and end-to-end tests.
- Studied Testcontainers and its use for integration testing with real dependencies such as PostgreSQL.
- Reviewed load-testing tools and performance measurements, including latency, throughput, and error rates.
- Studied chaos engineering and controlled failure injection to validate graceful degradation.
- Reviewed the MVP 3 release process through `develop`, `qa`, and `main`.
- Studied release versioning and the purpose of the `v3.0.0` tag.
- Prepared the production-readiness checklist and documentation for Salud Activa.

## 3. Blockers and risks

- Integration tests may require additional configuration of databases and other dependencies.
- Missing contract tests can allow incompatible changes between services.
- Load testing without defined SLOs makes performance results difficult to evaluate.
- Chaos experiments must be controlled to avoid affecting real users or production data.
- The MVP 3 release must not be tagged before the required quality and operability checks pass.
- Incomplete individual `hu-status` evidence can affect the evaluation.

## 4. Plan for next week

- Review the final project documentation and technical evidence.
- Organize the final presentation of Salud Activa.
- Verify the status of services, tests, deployment, and operational documentation.
- Prepare an explanation of the architecture and distributed-system decisions.
- Complete the individual contribution record and verify all evidence links.
- Prepare the final project handover.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (`hu-xxx-dev` -> `develop`, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links

- Evidence repository: https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2
- Documentation repository: https://github.com/code-corhuila/appt-mgmt-docs

