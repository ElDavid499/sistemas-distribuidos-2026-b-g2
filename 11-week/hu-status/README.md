<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: David Felipe Perdomo Castillo, Andy Brahiam Yara Medina, Sebastian Bermudez Gutierrez
- SPRINT_GOAL: Strengthen the observability strategy of Salud Activa by reviewing structured logging, metrics, distributed tracing, SLIs, SLOs, alerts, and operational runbooks.

## 1. User stories worked this week

| **HU ID** | **Title** | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | --------- | ---------------------------- | ------------------------------- |
| HU-001 | Backend: Review and improve observability across backend services | todo | In progress |
| HU-002 | Frontend: Review application monitoring and error visibility | todo | In progress  |
| HU-003 | Project delivery: Complete the observability workshop and document its evidence | todo | In progress  |

## 2. My individual contribution

- Reviewed the three pillars of observability: logs, metrics, and distributed tracing.
- Studied structured logging and the use of correlation IDs and trace IDs to follow requests across services.
- Reviewed the golden signals: latency, traffic, errors, and saturation.
- Studied SLIs, SLOs, error budgets, and alerting strategies.
- Reviewed the importance of operational runbooks and actionable alerts.
- Worked on the Week 11 workshop and its supporting evidence.
- Related the observability concepts to the Salud Activa distributed architecture.

## 3. Blockers and risks

- Missing or inconsistent trace IDs can make it difficult to follow requests across services.
- Monitoring tools may require additional configuration.
- Alerts without clear thresholds or runbooks can generate unnecessary notifications.
- SLO values must be measurable and realistic.
- The workshop evidence must be uploaded and linked correctly to make the individual contribution verifiable.

## 4. Plan for next week

- Review the cloud deployment strategy and deployment models.
- Study artifact promotion between development, QA, and production environments.
- Review zero-downtime deployment strategies and rollback procedures.
- Document health checks and infrastructure automation requirements.
- Continue improving the operational readiness of Salud Activa.

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
- Week 11 workshop: https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2/tree/main/11-week/workshop
