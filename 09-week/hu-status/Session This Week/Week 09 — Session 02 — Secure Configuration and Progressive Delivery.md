# Distributed Systems
## Week 09 · Session 02 · Planning — Secure Configuration and Progressive Delivery

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 3 · Planning · Corte 2**

---

## Introduction

With MVP 2 approaching, planning focuses on shipping safely.

The objective is to transform secure configuration practices into a concrete plan covering:

- Secret management.
- Secret ownership and rotation.
- Feature flags.
- Progressive delivery.
- Canary releases.
- Rollback procedures.
- Testable MVP 2 stories.

The goal is to ensure that a bad change does not take the entire system down.

### Learning Objectives

1. Plan secret ownership and rotation.
2. Define a feature-flag strategy for the product.
3. Design a canary and rollback plan.
4. Divide hardening work into MVP 2 stories with testable acceptance criteria.

---

# 1. A Secrets Plan, Not Good Intentions

A real secrets plan must define what happens to each secret.

For every secret, the team should identify:

| Element | Definition |
|---|---|
| Secret | Sensitive value being managed |
| Owner | Person or team responsible |
| Store | Where the secret is stored |
| Injection | How the application receives it |
| Access | Who or what service can read it |
| Rotation | When and how it is rotated |

### Example

| Secret | Owner | Store | Injection | Access | Rotation |
|---|---|---|---|---|---|
| Database password | Backend team | Secret store | Runtime environment | Backend service | Defined schedule |
| JWT secret | Backend team | Secret store | Runtime environment | Authentication service | Defined schedule |
| External API key | Integration owner | Secret store | Runtime environment | Integration service | Provider policy |

The principle of **least privilege** must be applied.

A service should only have access to the secrets it actually needs.

> "Be careful with secrets" is not a plan. A real plan defines owners, storage, access and rotation.

---

# 2. Feature-Flag Strategy

Feature flags should have clear rules so they do not become permanent technical debt.

Every feature flag should have:

- A clear name.
- A defined purpose.
- An owner.
- A default state.
- A release strategy.
- A removal date.

### Example

```text
Feature:
NEW_APPOINTMENT_FLOW

Default:
OFF

Owner:
Backend Team

Purpose:
Enable the new appointment scheduling flow.

Release:
Canary → 5% → 25% → 50% → 100%

Removal:
After complete validation and release.
```

New feature flags should normally start **OFF**.

After the feature has been completely released and validated, the flag should be removed.

### Feature-flag lifecycle

```text
Create flag
     |
     v
Default OFF
     |
     v
Deploy code
     |
     v
Test
     |
     v
Canary
     |
     v
Progressive rollout
     |
     v
100% release
     |
     v
Remove flag
```

Feature flags are temporary switches, not permanent architecture.

---

# 3. Progressive Delivery: Canary + Rollback

A risky feature should not be enabled for 100% of users immediately.

A **canary release** enables a feature for a small percentage of users or a controlled internal group.

The team monitors the system before increasing the percentage.

### Example

```text
5% Canary
    |
    v
Monitor metrics
    |
    +---- Problem ----> Feature flag OFF
    |
    v
25%
    |
    v
50%
    |
    v
100%
```

### Metrics to monitor

Depending on the feature, the team can monitor:

- Error rate.
- HTTP 4xx/5xx responses.
- Response time.
- Database errors.
- Authentication failures.
- Appointment creation failures.
- Service availability.

### Rollback

If the feature causes problems, the fastest response is to turn the feature flag OFF.

```text
Feature flag = ON
       |
       v
Problem detected
       |
       v
Feature flag = OFF
       |
       v
Previous behavior restored
```

This can happen without rebuilding or redeploying the application.

Every risky feature should have a rollback plan before release.

---

# 4. Slice the Hardening Stories

The hardening work for MVP 2 should be divided into small stories with testable acceptance criteria.

## Story 1 — Startup Configuration Validation

**Objective:**  
Validate all required configuration before the service accepts traffic.

### Acceptance Criteria

- Required variables are documented.
- Configuration is validated during startup.
- Missing variables stop the application.
- Invalid configuration produces a clear error.
- Configuration validation is tested.

---

## Story 2 — Secure Secret Management

**Objective:**  
Ensure production secrets are not stored in Git and are securely injected at runtime.

### Acceptance Criteria

- No production secrets exist in source code.
- `.env` files containing secrets are ignored.
- `.env.example` contains safe example values.
- Secrets are stored in an approved secret store.
- Secrets are injected at runtime.
- Secret scanning is configured.
- A rotation procedure is documented.

---

## Story 3 — Feature Flag

**Objective:**  
Deploy a new MVP 2 capability behind a feature flag.

### Acceptance Criteria

- The feature has a clear flag name.
- The flag defaults to OFF.
- The flag has an owner.
- The release strategy is documented.
- The feature can be enabled without redeployment.
- The flag has a planned removal date.

---

## Story 4 — Canary Release

**Objective:**  
Release the feature gradually instead of enabling it for all users at once.

### Acceptance Criteria

- Initial canary percentage is defined.
- Monitoring metrics are identified.
- Success criteria are defined.
- Rollout percentages are documented.
- The team validates the feature before increasing the percentage.

---

## Story 5 — Rollback

**Objective:**  
Provide a fast rollback mechanism using the feature flag.

### Acceptance Criteria

- Rollback instructions are documented.
- The feature can be disabled without redeployment.
- The team can execute the rollback in less than one minute.
- The rollback procedure is tested before production release.

---

# 5. A Path You Will Face in Real Life

## Scenario — The All-or-Nothing Release

The team merges a large change and releases it to 100% of production users immediately.

The feature contains a serious bug.

The team has no feature flag and no rollback mechanism.

The only solution is an emergency redeployment.

This increases the impact on users and the recovery time.

### Better approach

```text
Feature developed
       |
       v
Feature flag OFF
       |
       v
Deploy to production
       |
       v
Canary — 5%
       |
       v
Monitor metrics
       |
    +--+--+
    |     |
 Healthy Problem
    |     |
    v     v
  25%   Flag OFF
    |
    v
  50%
    |
    v
 100%
```

Progressive delivery reduces the blast radius of a failure.

The rollback plan must be defined **before the release**, not during the incident.

---

# 6. Common Mistakes

- A secrets plan that only says "do not commit them".
- No owner assigned to secrets.
- No rotation strategy.
- Feature flags without owners.
- Permanent feature flags that are never removed.
- Risky changes released to 100% immediately.
- No monitoring during a canary release.
- No rollback procedure.
- Defining rollback only after an incident occurs.

---

# Self-Check

### Question 1

**A real secrets plan specifies...**

- "Be careful with secrets."
- Only a `.gitignore`.
- **Owner, store, injection, access and rotation.**

### Question 2

**Feature flags should be...**

- Permanent architecture.
- Left in the system forever.
- **Temporary, owned, defaulted OFF and removed after release.**

### Question 3

**A canary release means...**

- Never release.
- Enable for 100% immediately.
- **Enable for a small percentage first, watch metrics and then ramp up.**

### Question 4

**The fastest rollback for a flagged feature is...**

- Emergency redeployment of the old version.
- Restore the database.
- **Flip the feature flag OFF without redeployment.**

### Question 5

**The rollback plan should be defined...**

- During the incident.
- **Before the release.**
- After users complain.

### Question 6

**An all-or-nothing 100% release of a risky change is...**

- The safest option.
- **High blast radius; prefer feature flag + canary + rollback.**
- Required for MVP.

---

# This Week

For **Salud Activa / GestionTurnosApp**, complete the following planning activities:

### 1. Secrets Plan

Document:

- Secret owners.
- Secret storage.
- Runtime injection.
- Access permissions.
- Rotation strategy.

### 2. Feature-Flag Policy

Define:

- Naming convention.
- Feature owner.
- Default state.
- Release strategy.
- Removal date.

### 3. Canary + Rollback Plan

Define:

- Initial canary percentage.
- Metrics to monitor.
- Success criteria.
- Progressive rollout percentages.
- Rollback procedure.
- Maximum rollback time.

### 4. MVP 2 Hardening Stories

Create stories with measurable and testable acceptance criteria for:

- Startup configuration validation.
- Secure secret management.
- Feature flags.
- Canary releases.
- Rollback.

The objective is to turn **"we should be careful"** into a concrete, secure and testable MVP 2 release plan.

---

**Next week:** persistence, followed by the MVP 2 release.

---

**Distributed Systems · Week 09 · Session 02 · Planning — Secure Configuration and Progressive Delivery**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**