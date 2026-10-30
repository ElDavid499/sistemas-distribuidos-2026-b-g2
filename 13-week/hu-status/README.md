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

- I modeled the trust boundary TB1 (patient clients -> /api/turnos) with STRIDE and opened the Pull Request #30 in the team docs repository.
- I created three security issues (#27 E, #28 I, #29 T) with acceptance criteria and priority labels.
- I wrote a security workflow (gitleaks, npm audit, authorization test) and a negative test for DELETE /api/turnos/:id in my fork.
- I answered the review comment on my STRIDE table and reviewed a teammate's Pull Request (#22).

## 3. Blockers and risks

- I needed to run the backend and MongoDB locally to execute the negative test.
- A reviewer found a threat I did not see (the response of /api/turnos exposes internal fields), so I had to update my table.
- The library book I registered is not about security, so it supports few rows of my table.

## 4. Plan for next week

- First, add the ownership check in DELETE /api/turnos/:id (return 403) and make the negative test pass.
- Then return only the needed fields in the Turno response and add a unique index for doctor, date and time.

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
