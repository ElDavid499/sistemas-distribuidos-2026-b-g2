<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       14-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 14

- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: David Felipe Perdomo Castillo, Andy Brahiam Yara Medina, Sebastian Bermudez Gutierrez
- SPRINT_GOAL: Strengthen the CI/CD workflow of Salud Activa by defining automated quality gates, validating service pipelines, protecting branches, and ensuring that releases promote tested artifacts.

## 1. User stories worked this week

| **HU ID** | **Title** | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | --------- | ---------------------------- | ------------------------------- |
| HU-001 | Integrate automated validation and testing into backend service pipelines | todo | In progress |
| HU-002 |  Validate frontend build and quality checks through CI/CD | todo | In progress  |
| HU-003 |  Define branch protection, release gates, and artifact promotion | In progress  |

## 2. My individual contribution

- Reviewed the differences between Continuous Integration, Continuous Delivery, and Continuous Deployment.
- Studied CI/CD pipeline stages, including build, linting, type checking, automated tests, and security scanning.
- Reviewed branch protection rules and short-lived feature branches.
- Studied the importance of pull request validation before merging changes.
- Reviewed DORA metrics: deployment frequency, lead time for changes, change failure rate, and time to restore.
- Analyzed how quality gates and artifact promotion apply to the Salud Activa repositories.
- Prepared documentation about pipeline planning and release validation.

## 3. Blockers and risks

- Incomplete pipeline configuration can allow defective changes to reach protected branches.
- Incorrect environment variables or missing secrets can cause deployment failures.
- Service changes may introduce compatibility problems if contract tests are missing.
- Bypassing quality gates increases the risk of releasing unverified code.
- Different services may require specific build and test configurations.

## 4. Plan for next week

- Review the distributed testing strategy.
- Validate integration and contract testing requirements.
- Prepare end-to-end tests for critical user journeys.
- Review load and chaos testing strategies.
- Prepare the MVP 3 release checklist and operational evidence.

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


