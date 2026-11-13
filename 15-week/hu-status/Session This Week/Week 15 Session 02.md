# CORHUILA — Systems Engineering
## Distributed Systems · 2026-B
### Week 15 · Session 02 — Release: Shipping MVP 3 (Production-Grade)

**Unit 3 · Release · Corte 3**

---

## 1. Introduction

MVP 3 represents the production-grade version of the distributed system. While MVP 1 demonstrated that the application could run and MVP 2 focused on integrating its components, MVP 3 adds the operational capabilities required to run the system reliably.

These capabilities include observability, zero-downtime deployment, security, automated quality gates, load testing, and resilience validation.

This session focuses on promoting the final release, validating the operability checklist, demonstrating the system under stress, and preparing the team for the final project presentation.

## 2. Learning Objectives

By the end of this session, students should be able to:

1. Promote the application through the `develop`, `qa`, and `main` branches.
2. Create and document the `v3.0.0` release.
3. Verify the complete MVP 3 operability checklist.
4. Demonstrate system behavior under load and controlled failures.
5. Evaluate the team's progress and prepare evidence for the final presentation.

## 3. What Production-Grade Means

A production-grade system must do more than provide the expected features.

The evolution of the project can be summarized as follows:

- **MVP 1 — Running:** The initial application works and demonstrates its core functionality.
- **MVP 2 — Integrated:** The main components and services communicate as part of a distributed system.
- **MVP 3 — Operable:** The integrated system is observable, secure, deployable, recoverable, and tested under realistic conditions.

MVP 3 should demonstrate the following capabilities:

### 3.1 Observability

The system must provide:

- Structured application logs.
- Metrics and dashboards.
- Distributed tracing.
- Alerts for relevant operational conditions.
- Runbooks describing how to respond to incidents.

### 3.2 Reliable Deployment

The release process must include:

- A zero-downtime deployment strategy.
- Health checks.
- A rehearsed rollback procedure.
- A versioned and reproducible release artifact.

### 3.3 Security

The system must enforce:

- Authentication and authorization.
- Appropriate permissions for each service.
- Secure handling of credentials and secrets.
- Dependency and secret scanning.
- Protection of sensitive endpoints and data.

### 3.4 Proven Resilience

The system must demonstrate:

- Load testing against defined SLOs.
- Controlled chaos experiments.
- Graceful degradation when dependencies fail.
- Recovery and compensation mechanisms.
- Consistency across services during failures.

## 4. Promote and Tag v3.0.0

The release must follow a controlled promotion process:

`develop → qa → main`

### 4.1 Develop

The `develop` branch contains the integrated changes intended for validation.

Before promotion, the team should verify that the required automated checks pass.

### 4.2 QA

The `qa` environment is used to validate the release candidate.

The team should verify:

- Acceptance criteria.
- Integration and contract tests.
- End-to-end critical workflows.
- Security checks.
- Deployment behavior.
- Operational readiness.

### 4.3 Main

After successful QA validation, the release can be promoted to `main`.

The final release must be tagged:

`v3.0.0`

The tag identifies the exact version of the code associated with the release.

The team should also update the CHANGELOG, relevant Architecture Decision Records (ADRs), and operational runbooks.

The release should promote the tested artifact rather than rebuilding a different artifact for production.

## 5. The MVP 3 Operability Checklist

Before declaring MVP 3 ready, verify the following requirements.

### 5.1 Functionality and Quality

- [ ] All acceptance criteria are met.
- [ ] Linting and formatting checks pass.
- [ ] Type checks pass where applicable.
- [ ] Automated tests pass.
- [ ] Required coverage thresholds are met.
- [ ] Security checks pass.

### 5.2 Deployment and Recovery

- [ ] Deployment uses a zero-downtime strategy.
- [ ] Health checks work correctly.
- [ ] Rollback has been rehearsed.
- [ ] The release artifact is versioned and reproducible.

### 5.3 Observability

- [ ] Dashboards display the golden signals.
- [ ] Distributed tracing works across service boundaries.
- [ ] Relevant alerts are configured.
- [ ] At least one operational alert has an associated runbook.

### 5.4 Security

- [ ] Authentication is enforced.
- [ ] Authorization is validated by the relevant services.
- [ ] Secrets are not stored in the Git repository.
- [ ] Dependency and secret scans pass.

### 5.5 Resilience

- [ ] Load tests meet the defined SLOs.
- [ ] A chaos experiment has been executed.
- [ ] Graceful degradation has been verified.
- [ ] Retry and circuit-breaker behavior has been validated where applicable.
- [ ] Cross-service consistency is protected through mechanisms such as idempotency and the Outbox pattern.

### 5.6 Documentation

- [ ] The release is tagged as `v3.0.0`.
- [ ] The CHANGELOG is updated.
- [ ] Relevant ADRs are updated.
- [ ] Runbooks and deployment documentation are available.
- [ ] Each team member has complete and verifiable `hu-status` evidence.

## 6. Demo Under Stress

The final demonstration should prove that the application works under realistic conditions, not only during the happy path.

A recommended demonstration sequence is:

1. Start the application and show that the main services are healthy.
2. Execute a complete user journey.
3. Display the dashboards and distributed traces.
4. Run a controlled load test.
5. Show latency and error rates in relation to the defined SLOs.
6. Introduce a controlled failure, such as stopping one service.
7. Show the alert or relevant monitoring event.
8. Demonstrate graceful degradation and recovery.
9. Explain the architectural decisions and mechanisms that support reliability.

For Salud Activa, the team could demonstrate a patient booking an appointment while the system is monitored, then simulate an interruption in a non-critical dependency and explain how the platform responds.

Any failure injection must be performed in a controlled environment.

## 7. Retrospective Toward the Final Presentation

The team should review the technical work completed during the project and identify what contributed most to system reliability.

Suggested retrospective questions:

- What worked well during the development and integration process?
- Which technical decisions improved reliability?
- What problems were discovered through testing?
- What do the SLO and DORA metrics reveal?
- Which deployment or recovery procedures should be improved?
- What would the team do differently in another project?

The retrospective should provide concrete lessons and evidence, not only general opinions.

The results will support Week 16, which focuses on the final presentation, documentation, and project handover.

## 8. How MVP 3 Is Evaluated

The evaluation considers multiple dimensions of the final system.

### 8.1 Functionality and Operability

The application must run correctly and demonstrate observability, deployment reliability, and resilience.

### 8.2 Code Quality

The project should include appropriate automated tests, quality checks, security validation, and performance evidence.

### 8.3 Architecture

The system should demonstrate sound distributed-system practices, including service contracts, Saga, Outbox, security, and fault handling where applicable.

### 8.4 Scrum Compliance

The team should demonstrate its work through the agreed development process, sprint activities, and verifiable evidence.

### 8.5 Corte 3 Components

Corte 3 also includes certification and final project components. Each student's `hu-status` documentation and evidence contribute to the individual evaluation.

## 9. Common Mistakes

- Demonstrating features without showing observability or resilience.
- Deploying without a rehearsed rollback procedure.
- Creating alerts without documenting how to respond.
- Assuming resilience without executing load and chaos tests.
- Promoting an unverified build to production.
- Failing to tag and document the final release.
- Presenting screenshots or test results that cannot be verified.
- Leaving individual `hu-status` evidence incomplete.

## 10. Self-Check

**Question 1. What does MVP 3 add compared with MVP 2?**

Correct answer: Operability, including observability, zero-downtime deployment, security, and proven resilience.

**Question 2. Where should the final release be tagged?**

Correct answer: On `main`, after passing the gated promotion process, using the `v3.0.0` tag.

**Question 3. What should a production-grade demonstration include?**

Correct answer: Live metrics and traces, a load test within the SLO, and a demonstration of graceful failure.

**Question 4. When is resilience considered credible?**

Correct answer: When it has been validated through load and chaos testing rather than simply assumed.

**Question 5. What belongs in the MVP 3 operability checklist?**

Correct answer: A rehearsed rollback, alerts with runbooks, security validation, and proven resilience.

**Question 6. What additional components are included in Corte 3 evaluation?**

Correct answer: Certification and final project components.

## 11. This Corte — Application to Salud Activa / GestionTurnosApp

The team should prepare the final MVP 3 release using a structured and evidence-based process.

Suggested activities:

1. Review the status of the services and repositories that form the Salud Activa platform.
2. Verify that the required CI/CD quality gates pass.
3. Promote the tested version through `develop`, `qa`, and `main`, following the team's established release process.
4. Validate the application in the QA environment.
5. Confirm that observability, security, rollback, load testing, and resilience evidence are available.
6. Prepare the `v3.0.0` release tag only after the release requirements have been met.
7. Update the CHANGELOG, ADRs, runbooks, and technical documentation.
8. Complete each team member's `hu-status` with actual commits, pull requests, test results, and other verifiable evidence.
9. Prepare a demonstration that shows the platform operating under stress and responding to a controlled failure.

**Important:** The `v3.0.0` tag and production-grade status should only be declared after the required checks have actually passed. The checklist is a validation guide, not evidence of completed work.

---

**Distributed Systems · Week 15 · Session 02**  
**Release — Shipping MVP 3 (Production-Grade)**  
Systems Engineering · Faculty of Engineering · © 2026 CORHUILA