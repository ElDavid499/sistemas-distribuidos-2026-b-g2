<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: Appt-Mgmt
- SPRINT_GOAL: Threat model of TB1 (patient clients -> /api/turnos) and security backlog for the appointment module
<!-- CONFIG-END -->

# Week 13 · HU Status

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W13-TM-001 | STRIDE threat model for TB1 (`/api/turnos`) | doing | [PR #30](https://github.com/code-corhuila/appt-mgmt-docs/pull/30) |
| W13-SEC-E | [security] Only the owner can cancel a Turno (E, risk 9) | todo | [Issue #27](https://github.com/code-corhuila/appt-mgmt-docs/issues/27) |
| W13-SEC-I | [security] Prevent unauthorized access to appointment information (I, risk 6) | todo | [Issue #28](https://github.com/code-corhuila/appt-mgmt-docs/issues/28) |
| W13-SEC-T | [security] Prevent appointment tampering and duplicate bookings (T, risk 6) | todo | [Issue #29](https://github.com/code-corhuila/appt-mgmt-docs/issues/29) |

## 2. My individual contribution

- (Write here, in your own words, what you did: STRIDE table for TB1, the 3 security issues, the CI workflow and the negative test, and the review you answered.)

## 3. Blockers and risks

- (Write here what blocked you, for example, running the backend locally for the negative test.)

## 4. Plan for next week

- (Write here what you will implement first.)

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (`hu-xxx-dev` → `develop`, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links

- **Fork folder:** [Week 13 Workshop](https://github.com/ElDavid499/sistemas-distribuidos-2026-b-g2/tree/main/13-week/workshop)
- **STRIDE Pull Request:** [PR #30](https://github.com/code-corhuila/appt-mgmt-docs/pull/30)
- **Review comment on a teammate PR:** [PR #22](https://github.com/code-corhuila/appt-mgmt-docs/pull/22)
- **Reflection document:** [Google Docs](https://docs.google.com/document/d/1_Bk9jMd40fX6uFHSg6zFfY0_bFPTllHcq15XBc0rZng/edit?usp=sharing)
