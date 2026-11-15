<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: David Felipe Perdomo Castillo, Andy Brahiam Yara Medina, Sebastian Bermudez Gutierrez
- SPRINT_GOAL: Define the cloud deployment strategy for Salud Activa by evaluating deployment models, artifact promotion, infrastructure automation, zero-downtime deployment, and rollback procedures.

## 1. User stories worked this week

| **HU ID** | **Title** | **Status (todo/doing/done)** | **Evidence (PR or commit URL)** |
| ---------- | --------- | ---------------------------- | ------------------------------- |
| HU-001 |  Prepare backend services for cloud deployment and environment configuration | todo | Pending |
| HU-002 |  Review application deployment requirements and environment configuration | todo | Pending |
| HU-003 |  Define deployment, artifact promotion, and rollback strategy | todo | Pending |

## 2. My individual contribution

- Reviewed cloud deployment models, including IaaS, managed containers, PaaS, and serverless.
- Studied rolling, blue-green, and canary deployment strategies.
- Reviewed the build-once, deploy-many approach for promoting the same artifact across environments.
- Studied infrastructure as code, health checks, horizontal scaling, and rollback procedures.
- Analyzed how deployment strategies apply to the Salud Activa architecture.
- Prepared documentation about deployment planning and operational requirements.

## 3. Blockers and risks

- Cloud infrastructure may require additional permissions and environment configuration.
- Incorrect health checks can allow unhealthy services to be considered ready.
- Rebuilding artifacts for different environments can introduce inconsistencies.
- Deployments without a rehearsed rollback procedure increase release risk.
- Infrastructure costs and resource limits must be considered when selecting a deployment model.

## 4. Plan for next week

- Review CI/CD pipelines and automated quality gates.
- Validate branch protection and pull request workflows.
- Review automated tests and security scanning.
- Verify that release artifacts are versioned and promoted consistently.
- Prepare evidence of successful pipeline executions.

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


