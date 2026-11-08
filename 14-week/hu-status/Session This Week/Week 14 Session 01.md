# Distributed Systems — Week 14 — Session 01
## CI/CD: Pipelines and Quality Gates

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Weekly · Corte 3

## Introduction

Continuous Integration and Continuous Delivery/Deployment help distributed teams deliver software changes frequently and safely.

This session explores the differences between CI and CD, automated pipeline stages, quality gates, trunk-based development, pull request checks, and DORA metrics for measuring delivery performance.

## Learning Objectives

1. Distinguish Continuous Integration, Continuous Delivery, and Continuous Deployment.
2. Design a pipeline with automated quality gates.
3. Protect the main branch through pull request checks and branch protection.
4. Measure software delivery health using DORA metrics.

## 1. CI vs. CD vs. CD

These practices are related, but they have different objectives.

### Continuous Integration (CI)

Developers integrate code changes frequently into a shared branch. Each change triggers automated processes such as:

- Building the application.
- Running automated tests.
- Checking code quality.
- Detecting integration problems early.

The goal is to receive fast feedback and avoid large, difficult integrations.

### Continuous Delivery (CD)

Every successful build is kept in a releasable state. The software can be deployed to production when the team or an authorized person approves the release.

### Continuous Deployment (CD)

Every change that passes all required checks is automatically deployed to production without a manual release approval.

**Key difference:**
- CI automatically builds and tests changes.
- Continuous Delivery keeps changes ready for release.
- Continuous Deployment automatically releases successful changes to production.

## 2. The Pipeline Is the Enforcer

A CI/CD pipeline automates the steps required to validate and deliver software.

A typical pipeline follows this flow:

`Code → Build → Test → Quality Gates → Package → Deploy`

Each stage verifies a specific requirement. If a required gate fails, the pipeline must stop and prevent the change from being promoted.

Typical pipeline stages include:

1. **Checkout:** Retrieve the source code.
2. **Build:** Compile or package the application.
3. **Lint and format:** Check coding conventions and formatting.
4. **Type checking:** Detect type-related problems where applicable.
5. **Testing:** Run unit, integration, and contract tests.
6. **Coverage:** Verify the project's minimum coverage requirement.
7. **Security:** Scan dependencies, secrets, and source code.
8. **Packaging:** Generate a versioned artifact or container image.
9. **Deployment:** Promote the validated artifact to the appropriate environment.

A pipeline turns quality requirements into automated verification instead of relying only on manual confirmation.

## 3. The Quality Gates: Definition of Done, Automated

The Definition of Done (DoD) describes the conditions that must be satisfied before a task can be considered complete.

A quality gate is an automated check that verifies one or more of those conditions.

### Typical Quality Gates

- **Lint and formatting:** Code follows the project's standards.
- **Static type checking:** Type errors are detected.
- **Unit tests:** Individual components behave correctly.
- **Integration tests:** Components work together correctly.
- **Contract tests:** Services respect their agreed API contracts.
- **Coverage threshold:** Measured coverage meets the declared minimum.
- **Security scanning:** Dependencies, secrets, and code are checked.
- **Placeholder detection:** Unfinished `TODO`, `FIXME`, or placeholder content is detected according to project policy.

Example pipeline commands:

```yaml
jobs:
  quality:
    steps:
      - run: make lint
      - run: make typecheck
      - run: make test
      - run: make coverage-check
      - run: make scan
      - run: ./no-todo.sh
```

The commands are illustrative. Each project must define and implement the corresponding scripts.

**Important:** A gate should block the merge or release when a required condition fails. A warning that can be ignored does not enforce the Definition of Done.

## 4. Trunk-Based Flow and Pull Request Checks

Trunk-based development encourages frequent integration into a shared mainline through short-lived branches.

A typical workflow is:

1. Create a short-lived feature or fix branch.
2. Implement a small change.
3. Open a pull request to the target branch.
4. Run automated quality checks.
5. Request and complete code review.
6. Merge only when required checks pass and approval is obtained.

### Protecting Main

Branch protection helps keep the main branch stable.

Recommended rules include:

- No direct pushes to protected branches.
- Required status checks must pass.
- At least one review approval is required, when appropriate.
- The branch must be up to date with its base branch.
- Force pushes should be restricted.

This keeps the main branch in a releasable state and reduces integration problems.

## 5. Measure Delivery Health: DORA

DORA metrics help teams understand the performance and reliability of their software delivery process.

### Deployment Frequency

Measures how often the team successfully deploys changes to production.

### Lead Time for Changes

Measures the time between a code change being committed and that change reaching production.

### Change Failure Rate

Measures the proportion of deployments that cause failures requiring remediation, such as rollback or urgent fixes.

### Time to Restore Service

Measures how long it takes to recover service after a production failure.

These metrics should be interpreted together. Increasing deployment frequency is not an improvement if failures increase and recovery becomes slower.

## 6. A Real-World Scenario

Imagine a developer merges code that does not compile because the repository has no required CI checks.

Other team members pull the broken code, and the entire team loses time correcting the problem.

A better process includes:

1. Branch protection on the main branch.
2. Required CI checks on every pull request.
3. Automated build and test execution.
4. Required code review.
5. Blocking failed checks from being merged.

The pipeline protects the team by preventing changes that do not meet the agreed quality requirements.

## 7. Common Mistakes

- Running builds and tests manually instead of automating them.
- Configuring quality gates as warnings rather than blocking checks.
- Allowing direct pushes to main.
- Working with long-lived branches that create difficult merges.
- Merging changes without code review.
- Measuring delivery speed without considering reliability.

## Self-Check

1. What does Continuous Integration mean?  
   **Answer:** Frequent code integration with automated builds and tests.

2. What should a quality gate do when it fails?  
   **Answer:** Block the merge or deployment when the check is required.

3. How can a team keep main releasable?  
   **Answer:** Use branch protection, required checks, and code review.

4. What is Continuous Deployment?  
   **Answer:** Automatically deploying every change that passes the required pipeline checks to production.

5. Which metrics are included in DORA?  
   **Answer:** Deployment frequency, lead time for changes, change failure rate, and time to restore service.

6. How can a team prevent broken code from reaching main?  
   **Answer:** Require successful CI checks and approval before merging pull requests.

## This Week

Review and configure the CI/CD pipeline for Salud Activa / GestionTurnosApp. Identify the required build, lint, type-checking, testing, coverage, and security stages.

Protect the relevant branches so that changes cannot be merged without passing the required checks and reviews. Ensure that deployment uses the validated, versioned artifact.

Record actual pipeline results and evidence of branch-protection rules. Do not report a gate as implemented until it has been configured and verified.

---

**Distributed Systems · Week 14 · Session 01 · CI/CD — Pipelines and Quality Gates**  
Systems Engineering · CORHUILA · 2026-B