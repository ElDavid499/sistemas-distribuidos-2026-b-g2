# Distributed Systems
## Week 09 · Session 1 · Configuration, Secrets and Feature Flags

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 3 · Weekly · Corte 2**

---

# Configuration, Secrets and Feature Flags

As the system grows across environments, configuration and secrets can become a source of outages and security breaches if they are handled incorrectly.

This session focuses on strict 12-factor configuration, secure secret management and rotation, startup configuration validation, and feature flags that separate deployment from release.

## Learning Objectives

1. Manage configuration strictly by environment using the 12-factor approach.
2. Handle secrets with a secure store, never in Git, and rotate them regularly.
3. Validate required configuration at startup using a fail-fast strategy.
4. Use feature flags to decouple deployment from release.

---

# 1. Config Strictly by Environment

The same application image should run everywhere. **Only environment values should change.**

The application should not contain environment-specific branches such as:

```text id="1yl6r4"
if (env == "prod")
```

There should be no hard-coded production hosts or environment-specific configuration inside the application code.

Configuration should be read from the **environment at startup** and documented in a `.env.example` file.

### Main Principle

```text id="b8h8wi"
Same Application Image
        |
        +---- Develop values
        |
        +---- QA values
        |
        +---- Production values
```

The application image remains the same while the configuration values change according to the environment.

### Example

```env id="t3hjw4"
APP_ENV=qa
PORT=3000
DB_URL=postgresql://database:5432/gestion_turnos
JWT_SECRET=<provided-at-runtime>
```

The `.env.example` file should document the required variables without containing real secrets.

Example:

```env id="zhkz5v"
APP_ENV=
PORT=
DB_URL=
JWT_SECRET=
FEATURE_NEW_APPOINTMENT_FLOW=
```

### Recommended Practices

- Use environment variables for configuration.
- Keep configuration outside the application code.
- Do not hard-code environment-specific hosts.
- Use the same application image across environments.
- Document required variables using `.env.example`.
- Validate configuration before the service accepts traffic.

---

# 2. Secrets: Never in Git, Rotate Often

Secrets are sensitive values used by applications and infrastructure.

Examples include:

- Database passwords.
- JWT secrets.
- API keys.
- Cloud credentials.
- Authentication tokens.
- Third-party service credentials.

A secret must never be committed to Git.

A committed secret remains in **Git history even after the file is deleted**.

### Secure Secret Flow

```text id="yq0jpm"
Secret Store
      |
      v
Runtime Injection
      |
      v
Application
```

Secrets should be stored in a **secret store or secret manager** and injected into the application at runtime.

### Secret Management Rules

1. Never store secrets in source code.
2. Never commit `.env` files containing real credentials.
3. Never include secrets in Docker images.
4. Never log secrets.
5. Scope secrets according to the environment.
6. Apply least-privilege access.
7. Rotate secrets regularly.
8. Immediately rotate compromised secrets.

### Important

A committed secret is considered compromised even if the repository is private.

---

# 3. Validate Config at Startup — Fail Fast

A missing or malformed configuration variable should stop the service **immediately**.

The application should not start with invalid configuration and fail later when it receives traffic.

This approach is called **fail fast**.

### Example

```go id="8h87xk"
func mustEnv(k string) string {
    v := os.Getenv(k)

    if v == "" {
        log.Fatalf("missing required env: %s", k)
    }

    return v
}

dbURL := mustEnv("DB_URL")
jwtSecret := mustEnv("JWT_SECRET")
```

### Startup Validation Flow

```text id="8y3zcv"
Application Starts
        |
        v
Validate Configuration
        |
    +---+---+
    |       |
  Valid   Invalid
    |       |
    v       v
 Start    Stop
Service  Immediately
```

A service with invalid configuration should not continue running.

This makes configuration problems visible immediately and simplifies troubleshooting.

---

# 4. Feature Flags: Deploy ≠ Release

A **feature flag** wraps new behavior in a configurable switch.

It allows a team to deploy code to production while keeping the new functionality disabled.

### Example

```env id="p76r2j"
FEATURE_NEW_APPOINTMENT_FLOW=false
```

The code can be deployed while the feature remains inactive.

When the team is ready:

```env id="ijc7sr"
FEATURE_NEW_APPOINTMENT_FLOW=true
```

The feature can then be released without requiring another deployment.

### Deploy vs Release

```text id="0q7xqd"
DEPLOY
  |
  v
Code reaches Production
  |
  v
Feature Flag = OFF
  |
  v
Feature remains inactive
  |
  v
Enable Feature Flag
  |
  v
RELEASE
```

Feature flags enable:

- Safe rollout.
- Canary releases.
- Progressive delivery.
- Instant rollback.
- Controlled releases.
- Reduced deployment risk.

---

# 5. A Path You Will Face in Real Life

## Scenario — The 2 a.m. Secret Leak

A developer commits a `.env` file containing a production database password just to test CI.

The problem is discovered one week later.

Deleting the file is not enough because the credential remains available in Git history.

### Correct Response

1. Rotate the production secret immediately.
2. Revoke the old credential.
3. Verify whether the exposed credential was used.
4. Remove the exposed secret from the repository where appropriate.
5. Add `.env` to `.gitignore`.
6. Add a pre-commit secret scanner.
7. Add secret scanning to CI.
8. Move secrets to a secure secret store.
9. Inject secrets at runtime.
10. Validate configuration during startup.
11. Never log secrets.

### Main Lesson

Security should depend on a defined process and controls, not on developers remembering not to commit secrets.

---

# 6. Common Mistakes

- Secrets stored in Git.
- Secrets included in Docker images.
- Secrets written to logs.
- Hard-coded environment-specific hosts.
- `if (env == "prod")` logic scattered throughout the code.
- Missing configuration allowed during startup.
- Features released to 100% of users without a feature flag.
- No rollback mechanism.
- Feature flags left permanently without an owner or removal plan.

---

# Self-Check

## Question 1

**Configuration across environments should...**

- Live in Git as secrets.
- Be hard-coded per environment in the code.
- **Change only environment values; the same image runs everywhere.**

## Question 2

**A committed secret is dangerous because...**

- It is automatically encrypted.
- Git ignores it.
- **It remains in Git history even after deletion.**

## Question 3

**Missing required configuration at startup should...**

- Be ignored.
- Let the service start and fail later.
- **Fail fast with a clear message.**

## Question 4

**A feature flag lets you...**

- **Deploy code dark and release by flipping it on, including canary and rollback.**
- Replace CI.
- Encrypt the database.

## Question 5

**Secrets should be...**

- In the committed Compose file.
- **In a secret store, injected as environment variables at runtime, and rotated.**
- In the Dockerfile.

## Question 6

**After a leaked production secret you must first...**

- Do nothing if the repository is private.
- Just delete the file.
- **Rotate the secret immediately because it is compromised.**

---

# This Week

For **Salud Activa / GestionTurnosApp**, harden the project configuration by completing the following activities:

### 1. `.env.example`

Create or update a `.env.example` file containing all required configuration variables without exposing real secrets.

Example:

```env id="q93z7y"
APP_ENV=
PORT=
DB_URL=
JWT_SECRET=
FEATURE_NEW_APPOINTMENT_FLOW=
```

### 2. Startup Validation

Implement validation for all required configuration variables.

The service must:

- Validate configuration at startup.
- Stop when a required variable is missing.
- Display a clear error.
- Avoid starting with invalid configuration.

### 3. Secret Management

Ensure that:

- Production secrets are never committed to Git.
- `.env` files with real credentials are ignored.
- Secrets are stored in a secret store.
- Secrets are injected at runtime.
- Secrets are rotated when necessary.
- Secrets never appear in logs.

### 4. Secret Scanning

Add a mechanism to detect accidentally committed secrets.

This can include:

- Pre-commit secret scanning.
- CI secret scanning.
- Repository security controls.

### 5. Feature Flag

Implement at least **one feature flag** protecting a new capability.

For example:

```env id="atxw3f"
FEATURE_NEW_APPOINTMENT_FLOW=false
```

The feature should be deployable while remaining disabled.

### Expected Result

At the end of this session, the project should have:

```text id="m3c2a5"
.env.example
     |
     v
Startup Configuration Validation
     |
     v
Secure Secret Injection
     |
     v
Secret Scanning
     |
     v
Feature Flag
     |
     v
Safe Feature Release
```

**Session 2** will turn these practices into a secure-configuration, feature-flag, canary, and rollback plan for MVP 2.

---

**Distributed Systems · Week 09 · Session 01 · Configuration, Secrets and Feature Flags**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**