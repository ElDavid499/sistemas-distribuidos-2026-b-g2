# Distributed Systems

**Week 6 · Session 2 · Planning — Environments, Config Strategy and Orchestration**

**CORHUILA**  
Systems Engineering · 2026-B

**Unit 2 · Planning · Corte 2**

---

# Planning — Environments, Config Strategy and Orchestration

Corte 2 turns the walking skeleton into an integrated system.

This session defines how the application runs across environments, how configuration and secrets are managed, how branches map to environments, and how the orchestration work is divided for MVP 2.

## Learning objectives

1. Define the environments and what changes between them.
2. Design a configuration and secrets strategy.
3. Apply the 12-factor rule for configuration.
4. Map the branch model to each environment.
5. Divide orchestration work into MVP 2 stories.

---

# 1. Environments: Same Artifact, Different Configuration

The same Docker image should run in every environment.

Only the configuration should change.

The three environments are:

| Environment | Purpose |
|---|---|
| Develop | Fast development and disposable resources |
| QA | Integration and testing |
| Prod | Real users and production operation |

### Promotion model

```text
Build Image
     │
     ▼
 Develop
     │
     ▼
    QA
     │
     ▼
   Prod
```

The principle is:

> Build once and promote the tested artifact with the configuration required by each environment.

A production image should not be rebuilt simply because it is being deployed to production.

---

# 2. Config & Secrets: The 12-Factor Rule

The 12-factor principle states that configuration should live in the **environment**, not inside the application code.

Avoid hard-coding:

```javascript
if (env == "prod") {
    // production configuration
}
```

Instead, use environment variables:

```text
DB_URL
API_URL
SECRET_KEY
```

## Configuration principles

- Configuration belongs in the environment.
- Environment names should not be hard-coded.
- Database addresses should not be hard-coded.
- Required variables should be validated at startup.
- Secrets should come from a secret store or environment injection.
- Secrets must never be committed to Git.
- Maintain a `.env.example` without real secrets.

### Example

```text
.env.example

DB_URL=
API_URL=
SECRET_KEY=
```

The real values remain outside the repository.

---

# 3. Configuration Matrix

A configuration matrix documents the variables required by the application.

| Variable | Develop | QA | Prod |
|---|---|---|---|
| `DB_URL` | `db:5432` | `qa-db:5432` | `prod-db:5432` |
| `API_URL` | `localhost:8080` | `qa-api:8080` | `api:8080` |
| `SECRET_KEY` | Environment secret | Environment secret | Secret store |

The variable names should remain consistent.

Only their values should change between environments.

---

# 4. Branch Model ↔ Environment

The branch model should map to the corresponding environment.

Example:

```text
hu-xxx-dev
      │
      ▼
 PR → develop
      │
      ▼
   Develop
      │
      ▼
hu-xxx-qa
      │
      ▼
 PR → qa
      │
      ▼
      QA
      │
      ▼
hu-xxx-main
      │
      ▼
 PR → main
      │
      ▼
     Prod
```

This creates a controlled promotion flow.

A change should reach production only after passing through the QA environment.

---

# 5. Slice the Orchestration Work

The orchestration work for MVP 2 can be divided into small and testable user stories.

## Story 1 — Complete system startup

> All services come up with one `docker compose up` command and dependencies are controlled through health checks.

### Acceptance criteria

- All required services start.
- Dependencies use health checks.
- Services communicate using service names.
- The system does not require manual startup of dependencies.

---

## Story 2 — Externalized configuration

> Configuration is read from environment variables in every service.

### Acceptance criteria

- No environment-specific values are hard-coded.
- Required variables are documented.
- Required variables are validated at startup.
- `.env.example` exists.

---

## Story 3 — Same artifact across environments

> QA runs the same images used in Develop while applying QA configuration.

### Acceptance criteria

- The image is built once.
- The same image is promoted.
- Only configuration changes.
- QA has its own configuration values.

---

# 6. A Path You Will Face in Real Life

## Scenario — Configuration Drift

The application works in Develop but fails in QA.

Possible cause:

```text
Develop:
localhost:5432
```

while QA uses:

```text
qa-db:5432
```

Another possible cause is using different variable names:

```text
Develop → DB_URL
QA      → DATABASE_URL
```

The service expects `DB_URL`, so the QA environment fails.

## Solution

Use:

- Consistent variable names.
- A documented configuration matrix.
- `.env.example`.
- Startup validation.
- Environment-specific values outside the source code.

### Recommended model

```text
              Variable Contract
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Develop       QA        Prod
       values      values      values
```

This reduces configuration drift.

---

# 7. Common Mistakes

- Rebuilding a different image for each environment.
- Using inconsistent environment variable names.
- Hard-coding configuration in the source code.
- Committing secrets to Git.
- Copying secrets into Docker images.
- Not maintaining a `.env.example`.
- Not validating required variables at startup.
- Sending changes directly to production without passing through QA.

---

# Self-Check

## Question 1

**Across environments you should...**

**Answer:** Run the same built image and change only the configuration.

---

## Question 2

**The 12-factor rule for configuration says...**

**Answer:** Configuration lives in the environment, not in the code.

---

## Question 3

**A change reaches production...**

**Answer:** After passing through QA through the defined environment flow.

---

## Question 4

**How can configuration drift be prevented?**

**Answer:** Use consistent variable names, validate required variables at startup and maintain a `.env.example`.

---

## Question 5

**Where do secrets belong?**

**Answer:** In a secret store or through environment injection, never in Git.

---

## Question 6

**"Works in Develop, breaks in QA" is often caused by...**

**Answer:** Configuration drift, such as hard-coded values or mismatched environment variable names.

---

# This Week

Define the three environments:

```text
Develop → QA → Prod
```

Create a documented configuration matrix containing:

- Variable names.
- Per-environment values.
- Required variables.
- Secret handling strategy.

Keep secrets outside Git and maintain:

```text
.env.example
```

Confirm the branch-to-environment mapping:

```text
develop → Develop
qa      → QA
main    → Prod
```

Finally, divide the orchestration work for **MVP 2** into stories with clear and testable acceptance criteria.

## Expected result

At the end of the week, the project should have:

```text
Same Docker Image
       │
       ├──────────────┐
       ▼              ▼
   Develop           QA
       │              │
       └──────┬───────┘
              ▼
             Prod
```

The artifact remains the same while each environment provides its own configuration.

---

**Distributed Systems · Week 6 · Session 2**  
**Planning — environments, config strategy and orchestration**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**