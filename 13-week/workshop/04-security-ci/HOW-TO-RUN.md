# CP4 — Security gates and negative authorization test

## What is here

| File | Purpose |
|------|---------|
| `security.yml` | GitHub Actions workflow on `pull_request`: gitleaks, `npm audit`, authorization tests |
| `turnos-authz.test.js` | Negative test for `DELETE /api/turnos/:id` (Node.js built-in test runner) |

The workflow is a proposal for the team backend repository. In that repository it goes to
`.github/workflows/security.yml` and the test to `tests/security/turnos-authz.test.js`.

## Story and criteria covered

- Story: **[security] Only the owner can cancel an appointment (Turno)** — https://github.com/code-corhuila/appt-mgmt-docs/issues/27
- Criterion 1: another patient's token on `DELETE /api/turnos/:id` returns `403` and the `Turno` stays.
- Criterion 2: no token returns `401`.
- Threat: E (Elevation of privilege), risk 9, in `stride-ElDavid499.md`.

## Run locally

Requirements: Node.js 18 or newer, the backend running with a local MongoDB.

```bash
# 1. Start the backend (from the team code repository)
cd backend
npm ci
npm start                      # listens on PORT, default 10000

# 2. In another terminal, run the test
cd 13-week/workshop/04-security-ci
BASE_URL=http://localhost:10000 REGISTER_USERS=1 node --test turnos-authz.test.js
```

Optional variables:

| Variable | Default | Use |
|----------|---------|-----|
| `BASE_URL` | `http://localhost:10000` | Backend address |
| `REGISTER_USERS` | unset | `1` registers the two test patients before login |
| `PATIENT_A_EMAIL`, `PATIENT_B_EMAIL`, `TEST_PASSWORD` | test values | Use existing verified accounts |
| `TURNO_BODY` | JSON in the test | Body for `POST /api/turnos` if `Turno.js` uses other field names |

If the account needs email verification before login, create two verified patients in the
local database and pass their emails with `PATIENT_A_EMAIL` and `PATIENT_B_EMAIL`.

## Expected result

- Today (no ownership check): test 2 fails, which proves the threat is real.
- After the fix in `routes/turnos.js`: the three tests pass.

## Real console output (CP8)

```text
✔ DELETE /api/turnos/:id without token returns 401
✔ DELETE /api/turnos/:id with another patient token returns 403
✔ the Turno of patient A still exists after the rejected cancel

ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

## Workflow validation (CP8)

```text
$ actionlint .github/workflows/security.yml

Validation successful (no errors).
```
