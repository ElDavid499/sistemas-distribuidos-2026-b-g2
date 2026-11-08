# Distributed Systems — Week 14 — Session 02
## Planning: Your Pipeline, DoD-as-Gates and Branch Protection

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Planning · Corte 3

## Introduction

A reliable CI/CD pipeline requires more than automated builds. The team's Definition of Done must become a set of verifiable quality gates, branch protection must enforce those requirements, and each service must have an appropriate delivery process.

This session focuses on translating quality requirements into automated checks, protecting environment branches, designing pipelines for multi-service systems, and planning CI/CD work for MVP 3.

## Learning Objectives

1. Map every Definition of Done requirement to an automated quality gate.
2. Define branch-protection rules for the project's environments.
3. Design a pipeline for a multi-service architecture.
4. Divide CI/CD implementation into testable MVP 3 user stories.

## 1. DoD Becomes a Checklist of Machines

The Definition of Done describes what must be true before a task can be considered complete.

Each requirement should have a corresponding verification method.

For example:

| Definition of Done requirement | Automated gate |
|---|---|
| Application builds successfully | CI build |
| Code follows conventions | Lint and format |
| Functionality works correctly | Unit and integration tests |
| Services communicate correctly | Contract tests |
| Coverage meets the minimum | Coverage check |
| No exposed credentials | Secret scanning |
| Dependencies are secure | Dependency scanning |
| Deployment is functional | Smoke test |

A requirement without a verification method depends entirely on manual confirmation.

The objective is to make quality measurable and enforceable.

## 2. Branch Protection Makes Gates Unavoidable

Branch protection rules prevent changes from bypassing the project's quality process.

For the `develop`, `qa`, and `main` branches, consider the following rules:

### No Direct Pushes

Developers must submit changes through pull requests instead of pushing directly to protected branches.

### Required Status Checks

The required CI jobs must complete successfully before a pull request can be merged.

### Required Review

At least one authorized reviewer must approve the changes, according to the team's review policy.

### Up-to-Date Branch

The pull request should be updated with its target branch before merging, where this requirement is enabled.

### Environment Promotion

A possible promotion flow is:

`Feature Branch → develop → qa → main`

Each environment should receive changes through the project's agreed workflow and required validations.

Branch protection must be configured for the actual repository and verified in its settings. Merely documenting the rules does not enforce them.

## 3. Design the Pipeline for Many Services

In a multi-service architecture, each service should have a pipeline that validates its own code and artifacts.

For example, Salud Activa / GestionTurnosApp contains different application components, such as the API gateway, appointment service, identity service, frontend, and database-related components.

A practical pipeline design includes:

### Per-Service Pipelines

Each repository or service should execute the checks relevant to its code:

- Build.
- Lint and static analysis.
- Unit tests.
- Integration tests.
- Dependency and secret scanning.
- Container image creation.
- Artifact publication.

### Path Filters

Path filters allow a pipeline to run only when relevant files change.

For example, a change in the appointment service should trigger its corresponding validation workflow without unnecessarily rebuilding unrelated components.

### Cross-Service Contract Tests

Contract tests verify that services communicate according to their agreed interfaces.

They help detect incompatible API changes before integration or deployment.

### Shared Release Process

A release process promotes the validated, versioned images to the next environment.

The same tested artifact should be promoted rather than rebuilt separately for each environment.

## 4. Slice the CI/CD Stories

MVP 3 pipeline work should be divided into manageable user stories with testable acceptance criteria.

The following are examples that can be adapted to the project's actual backlog.

### Example Story 1: Required CI Checks

**User story:** As a developer, I want pull requests to run automated build, lint, and test checks so that invalid changes cannot be merged.

**Acceptance criteria:**
- Pull requests trigger the required CI workflow.
- The build and tests execute successfully.
- A failed required check blocks merging.
- Successful and failed executions are visible in the pull request.

### Example Story 2: Coverage Gate

**User story:** As a developer, I want the pipeline to verify the minimum test coverage so that changes maintain the project's testing requirements.

**Acceptance criteria:**
- The minimum coverage threshold is documented.
- CI generates a coverage report.
- The pipeline compares measured coverage against the configured threshold.
- A result below the required threshold fails the gate.

### Example Story 3: Security Scanning

**User story:** As a developer, I want dependency and secret scanning in CI so that known vulnerabilities and exposed credentials are detected before release.

**Acceptance criteria:**
- Dependency scanning runs automatically.
- Secret scanning is included in the workflow.
- Findings are reported with sufficient detail.
- Findings that violate the project's security policy block the pipeline.

### Example Story 4: Versioned Image Publication

**User story:** As a developer, I want the pipeline to publish a versioned container image so that the team can deploy a traceable artifact.

**Acceptance criteria:**
- The image is built after the agreed release trigger.
- The image is tagged with a version or immutable digest.
- The image is published to the configured registry.
- The published artifact can be identified and promoted.

### Example Story 5: Deployment Smoke Test

**User story:** As an operator, I want a smoke test after deployment so that I can verify the deployed system responds correctly.

**Acceptance criteria:**
- The deployment pipeline executes the smoke test.
- The test checks the relevant health endpoint, such as `/health`, where available.
- The test reports success or failure.
- A failed smoke test prevents the release from being considered successful.

These examples should be mapped to the real HU identifiers and repository structure before being submitted as completed work.

## 5. A Real-World Scenario

Imagine the team is approaching a deadline. A required test fails, and someone suggests disabling the gate or force-merging the pull request to save time.

The change reaches the main branch with a known problem, and confidence in the pipeline decreases.

A better approach is:

1. Identify why the test or gate failed.
2. Correct the underlying problem.
3. Review the pipeline configuration if the gate itself is incorrect.
4. Make any gate changes through a reviewed pull request.
5. Keep branch protection enabled.
6. Merge only after the required checks pass.

Quality gates should not be bypassed simply because a deadline is approaching. If a gate is incorrect, fix it deliberately and preserve the review process.

## 6. Common Mistakes

- Definition of Done requirements without automated verification.
- Optional or easily bypassed quality gates.
- Missing branch protection on important environment branches.
- Using one oversized pipeline for every service.
- Running unnecessary workflows instead of using path filters.
- Skipping cross-service contract tests.
- Rebuilding different artifacts for each environment.
- Failing to verify the deployed system with smoke tests.

## Self-Check

1. What is the risk of a Definition of Done item without an automated gate?  
   **Answer:** It depends on manual confirmation and is not consistently enforced.

2. What does branch protection guarantee?  
   **Answer:** It enforces rules such as required checks, review approval, and restrictions on direct pushes.

3. How should pipelines work in a multi-service product?  
   **Answer:** Each service should have its own relevant pipeline, with path filters and cross-service contract tests where appropriate.

4. What should happen when a required gate fails under deadline pressure?  
   **Answer:** The team should fix the underlying problem instead of bypassing the gate.

5. What should the release step do?  
   **Answer:** Promote the validated, tagged artifacts to the next environment.

6. What does a final smoke test verify?  
   **Answer:** That the deployed system actually responds and its essential health checks pass.

## This Week

Finalize the CI/CD plan for Salud Activa / GestionTurnosApp.

Map every Definition of Done requirement to a blocking quality gate. Define branch-protection rules for `develop`, `qa`, and `main`, and design appropriate per-service pipelines with path filters and cross-service contract tests.

Include versioned artifact publication and a smoke test after deployment. Divide the work into MVP 3 stories with measurable acceptance criteria, and collect evidence from actual workflow executions and repository settings.

Next: testing at scale and the MVP 3 release.

---

**Distributed Systems · Week 14 · Session 02 · Planning — Your Pipeline, DoD-as-Gates and Branch Protection**  
Systems Engineering · CORHUILA · 2026-B