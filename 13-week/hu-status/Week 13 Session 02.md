# Distributed Systems — Week 13 — Session 02
## Planning: Threat Modeling and the Security Backlog

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Planning · Corte 3

## Introduction

Security should be considered throughout software design and development, not only during the final review before deployment.

This session introduces threat modeling using STRIDE, attack-surface mapping, security-story prioritization, and automated security testing in CI. The objective is to identify risks early and turn them into actionable tasks for MVP 3.

## Learning Objectives

1. Map the system's attack surface and identify trust boundaries.
2. Identify threats using the STRIDE methodology.
3. Convert security findings into a prioritized backlog.
4. Integrate security tests and checks into the CI pipeline.

## 1. Map the Attack Surface First

The attack surface includes all the points through which an attacker could interact with the system.

To identify it, create a data-flow diagram that shows:
- Users and external clients.
- API gateways.
- Application services.
- Databases and storage systems.
- External APIs and third-party services.
- Communication channels between components.

### Trust Boundaries

A trust boundary is a point where information crosses between components or environments with different trust levels.

Examples include:
- Internet to API gateway.
- API gateway to internal services.
- Application service to database.
- Internal service to external API.

These boundaries deserve special attention because data, identities, and permissions must be verified when crossing them.

**Key principle:** You cannot adequately protect components and interactions that have not been identified.

## 2. Find Threats with STRIDE

STRIDE is a threat-modeling methodology that groups security threats into six categories.

### S — Spoofing

An attacker impersonates another user or service.

**Mitigation:** Strong authentication, token validation, and service identity verification.

### T — Tampering

An attacker modifies data or messages without authorization.

**Mitigation:** Integrity controls, input validation, authorization, and protected communication.

### R — Repudiation

A user or service denies having performed an action.

**Mitigation:** Audit logs with timestamps, identity information, and correlation or trace IDs.

### I — Information Disclosure

Sensitive information is exposed to unauthorized parties.

**Mitigation:** Encryption, access control, data minimization, and secure logging.

### D — Denial of Service

An attacker makes a service unavailable by exhausting its resources.

**Mitigation:** Rate limiting, resource limits, monitoring, and appropriate scaling strategies.

### E — Elevation of Privilege

An attacker gains permissions beyond those assigned to their identity.

**Mitigation:** Least privilege, authorization checks, secure role management, and permission tests.

STRIDE helps teams analyze each component and trust boundary systematically.

## 3. Turn Threats into a Prioritized Backlog

Identified threats should become security stories with owners, priorities, and testable acceptance criteria.

A common risk assessment approach is:

**Risk = Likelihood × Impact**

The result helps the team decide which issues should be addressed first.

Example priorities:

- **P0:** Critical risk requiring immediate attention.
- **P1:** High risk that should be addressed urgently.
- **P2:** Moderate risk that should be scheduled.
- **P3:** Lower risk that can be planned according to capacity.

### Example Security Story

**User story:** As a system administrator, I want all administrative endpoints to require the ADMIN permission so that unauthorized users cannot execute privileged operations.

**Acceptance criteria:**
- Requests without a valid token receive HTTP 401.
- Authenticated users without the ADMIN permission receive HTTP 403.
- Users with the required permission can execute authorized operations.
- Automated authorization tests cover these cases in CI.

### Additional Example

**User story:** As a patient, I want the system to verify resource ownership so that I cannot access another patient's appointments.

**Acceptance criteria:**
- A patient can access their own appointments.
- A patient cannot access another patient's appointments.
- Unauthorized resource access is rejected.
- Integration tests verify both permitted and denied scenarios.

Security tasks should be part of the regular development backlog, not postponed until the end of the project.

## 4. Plan Security Testing into CI

Security checks should be integrated into the continuous integration pipeline.

### Dependency Scanning

Identifies known vulnerabilities in third-party libraries and packages.

### Secret Scanning

Detects credentials, API keys, tokens, and other sensitive values accidentally committed to source code.

### Static Application Security Testing (SAST)

Analyzes source code to identify potentially insecure programming patterns.

### Authorization Tests

Verify that users and services cannot access operations or resources beyond their permissions.

### Security Quality Gates

The pipeline should define which findings cause a build to fail, based on severity and project policy.

Automating these checks helps identify security problems before changes reach production.

## 5. A Real-World Scenario

Imagine a security review performed two days before a release discovers an IDOR vulnerability.

An IDOR (Insecure Direct Object Reference) occurs when a user can access another user's resource by manipulating an identifier without the application properly checking authorization.

For example, patient A changes an appointment identifier in a request and receives information belonging to patient B.

A better approach is to:

1. Map the application's data flows and trust boundaries.
2. Use STRIDE to identify possible access-control threats.
3. Create a security story requiring resource-ownership validation.
4. Add integration tests for authorized and unauthorized access.
5. Run those tests in CI before allowing the change to be released.

Designing security early reduces the cost and impact of late corrections.

## 6. Common Mistakes

- Treating security as a final scan instead of a design activity.
- Failing to map trust boundaries.
- Leaving security findings without owners or priorities.
- Postponing security stories until after feature development.
- Not integrating dependency and secret scanning into CI.
- Failing to test authorization for individual resources and operations.

## Self-Check

1. Where do threats commonly concentrate?  
   **Answer:** At trust boundaries where data crosses between different trust levels.

2. What does the E in STRIDE represent?  
   **Answer:** Elevation of Privilege.

3. What should happen to an identified security threat?  
   **Answer:** It should become a prioritized security story with testable acceptance criteria.

4. How can repudiation risks be reduced?  
   **Answer:** Through audit logs that record relevant actions, identities, timestamps, and correlation information.

5. Which security checks can be integrated into CI?  
   **Answer:** Dependency scanning, secret scanning, SAST, and authorization tests.

6. Why is waiting until the final security review risky?  
   **Answer:** It can reveal cross-cutting vulnerabilities too late, making fixes more expensive and delaying releases.

## This Week

Create a threat model for Salud Activa / GestionTurnosApp. Map its data flows and trust boundaries, then analyze relevant components using STRIDE.

Convert the findings into a prioritized security backlog with testable acceptance criteria. Plan and integrate appropriate dependency scanning, secret scanning, static analysis, and authorization tests into CI.

Record the identified risks, assigned tasks, test results, and evidence of completed security improvements.

---

**Distributed Systems · Week 13 · Session 02 · Planning — Threat Modeling and the Security Backlog**  
Systems Engineering · CORHUILA · 2026-B