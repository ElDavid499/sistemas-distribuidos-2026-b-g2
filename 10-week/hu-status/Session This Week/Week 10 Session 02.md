# Distributed Systems
## Week 10 · Session 02 · Release — Shipping MVP 2 (Integrated System)

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 3 · Release · Corte 2**

---

# Release — Shipping MVP 2 (Integrated System)

MVP 1 demonstrated that a service could run. MVP 2 must demonstrate that the integrated distributed system works as a whole.

The release must prove that services communicate through defined contracts, cross-service workflows remain consistent, events are published reliably, and configuration and secrets are managed securely.

This session focuses on promoting the system through environments, verifying release readiness, demonstrating successful and failed workflows, and carrying lessons into Corte 3.

## Learning Objectives

1. Promote the integrated system through Develop, QA, and Production.
2. Verify the release, including failure and consistency paths.
3. Demonstrate the distributed system end to end.
4. Conduct a retrospective and prepare the backlog for Corte 3.

---

# 1. What's Different About MVP 2?

MVP 2 raises the bar from "a service runs" to **"the system works together."**

The system should demonstrate:

- Multiple services communicating through documented contracts.
- Clear ownership of data.
- Cross-service consistency using sagas and compensating actions.
- Reliable event publication using the outbox pattern.
- Idempotent consumers that safely handle duplicate events.
- Configuration separated by environment.
- Secrets kept out of source code and container images.
- Integration tests and contract tests.
- A complete end-to-end workflow.
- A demonstrated failure path and recovery behavior.

## MVP 1 vs. MVP 2

| Area | MVP 1 | MVP 2 |
|---|---|---|
| System scope | A service running | Integrated distributed system |
| Communication | Limited or local | Defined contracts between services |
| Data ownership | Initial persistence | Clear service-level ownership |
| Consistency | Primarily local | Cross-service workflows and compensations |
| Events | Basic or limited | Reliable publication and idempotent consumers |
| Configuration | Initial environment setup | Environment-specific configuration and secret management |
| Testing | Basic service validation | Unit, integration, and contract tests |
| Release evidence | Service starts | End-to-end success and failure paths are demonstrated |

A successful release must prove more than the happy path.

---

# 2. Promote and Tag

The release follows the environment flow:

```text
Develop
   |
   v
  QA
   |
   v
Production (main)
   |
   v
Tag v2.0.0
```

Each promotion should happen only after the required checks for the current environment have passed.

## Develop

- Implement and integrate approved stories.
- Run unit tests.
- Validate service contracts.
- Verify configuration and startup health checks.
- Review changes through pull requests.

## QA

- Promote the tested increment to QA.
- Run integration and contract tests.
- Validate the end-to-end business workflow.
- Test failure and compensation behavior.
- Verify outbox delivery and idempotent consumers.
- Use production-like configuration without exposing production secrets.

## Production

- Confirm that release acceptance criteria are satisfied.
- Promote the approved increment through the team's established process.
- Verify required environment configuration and secret injection.
- Confirm the rollback procedure.
- Tag the release as `v2.0.0` on `main`.
- Update the changelog and relevant ADRs.

## Artifact Promotion

The release should use the approved, tested artifact rather than rebuilding different application code for each environment.

Configuration and secrets are supplied for the target environment.

The precise image-build and promotion process must match the team's CI/CD setup.

---

# 3. The MVP 2 Release Checklist (Definition of Done)

Use this checklist before declaring MVP 2 ready for release.

## Functional Requirements

- [ ] Acceptance criteria for every committed story are met.
- [ ] Services communicate through documented contracts.
- [ ] The main business workflow works end to end.
- [ ] Data is persisted by the service that owns it.
- [ ] Service boundaries and responsibilities are documented.

## Testing

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Contract tests pass.
- [ ] Measured test coverage is reported accurately.
- [ ] Tests cover important failure conditions.
- [ ] Duplicate event delivery is tested where applicable.

## Deployment and Configuration

- [ ] `docker compose up` brings up the required system.
- [ ] Health checks gate dependent service startup.
- [ ] Configuration is supplied through environment variables.
- [ ] Required configuration is validated at startup.
- [ ] Secrets are not committed to Git or embedded in images.
- [ ] Persistent data is stored using the intended volumes or databases.

## Distributed Consistency

- [ ] The cross-service workflow completes successfully.
- [ ] The saga handles a failed step.
- [ ] Compensating actions restore an acceptable business state.
- [ ] Critical events use the outbox pattern.
- [ ] Consumers safely handle duplicate events.
- [ ] The team can explain any expected eventual-consistency delay.

## Release Documentation

- [ ] Release version `v2.0.0` is prepared.
- [ ] The changelog is updated.
- [ ] Relevant ADRs are updated.
- [ ] Deployment and verification steps are documented.
- [ ] Rollback instructions are documented and tested.
- [ ] Required pull requests are reviewed and merged.

---

# 4. Demo the System, Including Failure

The release demonstration must show the integrated system operating through its real contracts and persistence mechanisms.

A demo that only shows the happy path is insufficient evidence of distributed-system reliability.

## Part A — Demonstrate the Happy Path

1. Start the required services.
2. Show that the health checks pass.
3. Submit a request through the gateway or the system's designated entry point.
4. Follow the request through the participating services.
5. Show where each service persists its data.
6. Demonstrate the event flow and the resulting state changes.
7. Confirm that the final business state is correct.

For Salud Activa, an example workflow could be:

```text
Patient Requests Appointment
           |
           v
Appointments Service
           |
           v
Availability / Scheduling
           |
           v
Appointment Confirmed
           |
           v
Notification Sent
```

The actual flow should match the services and contracts implemented in the project. If payment is not part of the product, it should not be included in the demonstration.

## Part B — Demonstrate a Failure

Choose a safe, repeatable failure scenario in the QA environment.

Examples include:

- Stop a participating service during a workflow.
- Force a downstream operation to fail.
- Deliver the same event twice.
- Temporarily make the event broker unavailable.

Observe the resulting state and explain how the system recovers.

## Example: Saga Compensation

```text
Start Business Workflow
          |
          v
Reserve Resource
          |
          v
Next Step Fails
          |
          v
Saga Compensation
          |
          v
Restore Acceptable State
```

For an appointment workflow, this may mean releasing a reserved time slot and marking the appointment as failed or pending according to the business rules.

## Example: Duplicate Event

1. Deliver the same event twice.
2. Verify that the consumer detects the duplicate or otherwise processes it safely.
3. Confirm that the business effect is not repeated.
4. Show the event ID or other evidence used to establish idempotency.

## Evidence to Present

- Service health status.
- API requests and responses.
- Relevant database records.
- Event or outbox records.
- Logs that do not expose secrets.
- Test results.
- The resulting state after failure and compensation.
- Contracts and ADRs explaining the design.

**Important:** demonstrate the failure in a controlled environment. Do not disrupt production to prove rollback or compensation behavior.

---

# 5. Retrospect — Corte 3

After the release, the team should review what worked, what failed, and what needs improvement.

The retrospective should use concrete evidence rather than general statements.

## Questions for the Team

### What went well?

- Which services integrated successfully?
- Which automated tests detected problems early?
- Which deployment or configuration practices reduced risk?

### What caused difficulties?

- Were service contracts unclear?
- Did configuration differences cause failures?
- Were event retries, duplicate delivery, or compensation difficult to validate?
- Were any stories too large or acceptance criteria ambiguous?

### What should change?

- Which processes should be automated?
- Which missing tests should be added?
- Which ADRs or runbooks require updates?
- Which architectural or operational risks should be addressed in Corte 3?

## Retrospective Action Items

Each action should have:

- A clearly described problem.
- Evidence or an example.
- A proposed improvement.
- An owner.
- A measurable acceptance criterion.
- A target sprint or date.

The objective is to convert lessons from MVP 2 into actionable work for Corte 3.

---

# 6. How MVP 2 Is Evaluated

The release should be evaluated using demonstrable results.

| Evaluation area | Expected evidence |
|---|---|
| Functional integration | End-to-end workflow completes successfully |
| Service contracts | Documented and tested API or event contracts |
| Persistence | Each service owns and persists its data appropriately |
| Distributed consistency | Saga failure and compensation demonstrated |
| Event reliability | Outbox mechanism and duplicate-safe consumption validated |
| Configuration and security | Environment-specific configuration; no exposed secrets |
| Testing | Passing unit, integration, and contract tests |
| Deployment | Required services start with health checks |
| Release management | Approved promotion flow, version tag, changelog and ADR updates |
| Failure handling | Controlled failure and recovery demonstrated |

Evaluation should be based on the implementation and evidence, not merely on the presence of documentation.

---

# 7. Common Mistakes

- Treating MVP 2 as a collection of services that start independently but do not work together.
- Demonstrating only the happy path.
- Ignoring service contracts or testing them only manually.
- Claiming that a saga works without demonstrating compensation.
- Publishing events without handling failed delivery or duplicate processing.
- Allowing secrets into source code, logs, or container images.
- Promoting changes to Production before QA verification.
- Tagging a release before acceptance criteria are met.
- Having no tested rollback procedure.
- Updating the version without updating the changelog or relevant ADRs.
- Ending the corte without recording lessons and follow-up actions.

---

# Self-Check

## Question 1. What distinguishes MVP 2 from MVP 1?

- A single service that starts.
- **An integrated system with service contracts, distributed consistency, and environment-specific configuration.**
- A larger README file.

## Question 2. What is the expected promotion flow?

- `main → develop → qa`
- Deploy directly to Production.
- **`develop → qa → main`, with verification before promotion.**

## Question 3. Why must the release demo include a failure?

- To make the demonstration longer.
- **To prove the system handles failures and maintains an acceptable business state.**
- Because the happy path is not required.

## Question 4. What should happen when a saga step fails?

- Ignore the error.
- Leave all services in an inconsistent state.
- **Execute the appropriate compensation or recovery process.**

## Question 5. Why are idempotent consumers important?

- They prevent all network failures.
- They guarantee that events are delivered only once.
- **They prevent duplicate deliveries from repeating business effects.**

## Question 6. What should be verified before tagging `v2.0.0`?

- Only that the application compiles.
- Only that the README is updated.
- **Release acceptance criteria, required tests, integration, security, and failure-handling evidence.**

---

# This Corte

For **Salud Activa / GestionTurnosApp**, complete the following release activities.

## 1. Promote the Integrated System

- Verify the changes in Develop.
- Promote the approved increment to QA.
- Run the required integration and contract tests.
- Confirm release readiness before promotion to `main`.
- Prepare the `v2.0.0` release tag when the required checks pass.

## 2. Verify Persistence and Consistency

- Verify that each service owns its data.
- Demonstrate the selected cross-service workflow.
- Validate the saga's compensating behavior.
- Verify that critical events are recorded in the outbox.
- Test duplicate event delivery and idempotent processing.

## 3. Validate Configuration and Security

- Verify required environment variables.
- Confirm that configuration is appropriate for each environment.
- Ensure secrets are not present in Git, images, or logs.
- Verify service health checks and persistent storage.
- Confirm that release and rollback instructions are available.

## 4. Prepare the Release Evidence

Collect:

- Pull requests and commit references.
- Test execution results.
- End-to-end workflow evidence.
- Database and event-processing evidence.
- Failure and compensation results.
- Release tag and changelog.
- Relevant ADRs and operational documentation.

## 5. Run the MVP 2 Demonstration

Demonstrate both:

1. A successful end-to-end workflow.
2. A controlled failure that proves compensation or duplicate-safe event processing.

Explain how the system uses service contracts, persistence, the outbox pattern, idempotency, and environment-specific configuration.

## 6. Conduct the Retrospective

- Record real incidents and challenges.
- Identify improvements supported by evidence.
- Assign owners to action items.
- Carry unresolved work into the Corte 3 backlog.

## Expected Result

MVP 2 should be presented as a tested and integrated distributed system, not simply a collection of running services.

The release must show that the system can complete its main workflow, respond to failure, preserve acceptable consistency, protect secrets, and provide evidence that its release requirements have been met.

---

**Distributed Systems · Week 10 · Session 02 · Release — Shipping MVP 2 (Integrated System)**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**