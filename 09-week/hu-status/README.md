<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: DAVID FELIPE PERDOMO CASTILLO
- GITHUB_USER: ElDavid499
- TEAM: DAVID FELIPE PERDOMO CASTILLO / ANDY BRAHIAM YARA MEDINA / SEBASTIAN BERMUDEZ
- SPRINT_GOAL: Harden MVP 2 configuration and plan secure progressive delivery using environment-based configuration, secret management, startup validation, feature flags, canary releases, and rollback.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
|  | Environment-based configuration and startup validation | done | https://github.com/code-corhuila/appt-mgmt-docs.git |
|  | Secure secrets management and secret scanning | done | https://github.com/code-corhuila/appt-mgmt-docs.git |
|  | Feature flag implementation and release strategy | done | https://github.com/code-corhuila/appointment-management-app.git |
|  | Canary release and rollback planning for MVP 2 | done | https://github.com/code-corhuila/appt-mgmt-docs.git |

## 2. My individual contribution

- Documented configuration management by environment using the 12-factor approach.
- Defined the use of environment variables instead of hard-coded environment-specific configuration.
- Prepared the `.env.example` strategy for documenting required configuration variables without exposing secrets.
- Documented startup validation using a fail-fast approach for required configuration.
- Defined secure secret-management practices, including runtime injection, least-privilege access, and secret rotation.
- Identified the risks of committing secrets to Git and defined secret-scanning practices.
- Defined the use of feature flags to separate deployment from release.
- Planned a progressive delivery strategy using canary releases.
- Defined rollback through feature flags without requiring an emergency redeployment.
- Prepared MVP 2 hardening stories with testable acceptance criteria.

## 3. Blockers and risks

- Production secrets must remain outside Git and must never be included in source code, Docker images, or logs.
- Required environment variables must be validated before services accept traffic.
- Configuration differences between Develop, QA, and Prod can cause environment-specific failures if variables are not documented consistently.
- Feature flags can become technical debt if they do not have an owner or removal date.
- Canary releases require monitoring metrics and clearly defined success criteria.
- Rollback procedures must be tested before the production release.
- The exact PR or commit evidence must be added before the weekly submission.

## 4. Plan for next week

- Continue the MVP 2 release preparation.
- Validate the secure configuration strategy in the project.
- Verify that required environment variables are validated at startup.
- Continue improving secret management and scanning.
- Validate the feature-flag strategy with the selected MVP 2 capability.
- Review the canary rollout and rollback procedure.
- Prepare the project for the next persistence and MVP 2 release activities.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links

- Documentation repository: https://github.com/code-corhuila/appt-mgmt-docs.git
- MVP repository: https://github.com/code-corhuila/appointment-management-app.git
- Session 01 — Configuration, Secrets and Feature Flags: https://github.com/code-corhuila/appt-mgmt-docs.git
- Session 02 — Secure Configuration and Progressive Delivery: https://github.com/code-corhuila/appt-mgmt-docs.git
