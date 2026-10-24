# Week 11 Workshop - Observability, SLOs, and Incident Response

- **FULL_NAME:** David Felipe Perdomo Castillo
  
- **GITHUB_USER:** ElDavid499
  
- **TEAM:**  David Felipe Perdomo Castillo / Andy Brahiam Yara Medina / Sebastian Bermudez
  
- **DOCS_REPO:** [appt-mgmt-docs](https://github.com/code-corhuila/appt-mgmt-docs)
  
- **REFLECTION_DOC:** [Final reflection in Google Docs](https://docs.google.com/document/d/169-xLj8LqRaCfRjUfcyA6v_ijrzbheLrjyAGMO6DdIs/edit?usp=sharing)
  
  
- **JOURNEY:** Appointment booking and asynchronous saga confirmation: API Gateway, Appointments Service, MongoDB/outbox, RabbitMQ, and Auth Service.

## Checkpoint index

| Checkpoint | Deliverable | Status |
|---|---|---|
| CP0 | This README | Project and journey information included; student must confirm Google Docs access and submission |
| CP1 | [01-journey.md](./01-journey.md) | Journey, hop table, Mermaid sequence, span tree, and context propagation documented |
| CP2 | [02-log-contract.md](./02-log-contract.md) | Structured JSON log contract and synthetic examples documented |
| CP3 | [03-instrumentation/HOW-TO-RUN.md](./03-instrumentation/HOW-TO-RUN.md) | Real backend instrumentation documented; focused tests passed (3 suites/6 tests), full backend suite passed (8 suites/25 tests); test doubles and limitations identified |
| CP4 | [04-metrics.md](./04-metrics.md) | Golden signals documented; implemented metrics distinguished from proposals |
| CP5 | [../hu-status/README.md](../hu-status/README.md) | Current status and evidence boundary documented; commit and course-submission details remain for the student to confirm |
| CP6 | [05-slo.md](./05-slo.md) | Three request-based SLOs and illustrative error budgets documented; traffic assumptions are not production measurements |
| CP7 | [06-alert-policy.md](./06-alert-policy.md) and [06-alerts.yml](./06-alerts.yml) | Six rules passed local `promtool check rules`; live Prometheus evaluation and alert delivery are not configured |
| CP8 | [07-runbook.md](./07-runbook.md) | Local Docker Compose diagnostics and mitigations documented; production contacts are unverified |
| CP9 | [08-incident.md](./08-incident.md) | Slow-Auth incident and postmortem documented as a simulation, not an executed drill or production incident |
| CP10 | [Final reflection document](https://docs.google.com/document/d/169-xLj8LqRaCfRjUfcyA6v_ijrzbheLrjyAGMO6DdIs/edit?usp=sharing) | Student-provided Google Docs link; document access, contents, and course submission were not independently verified |



