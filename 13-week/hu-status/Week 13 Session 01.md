# Distributed Systems — Week 13 — Session 01
## Security in Distributed Systems: Authentication, Authorization and Zero Trust

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Weekly · Corte 3

## Introduction

Distributed systems expose multiple services, APIs, databases, and communication channels. Each component can become an entry point for an attack if security is not consistently enforced.

This session covers authentication, authorization, token-based security, API gateways, service-to-service trust, zero-trust principles, and common vulnerability classes.

## Learning Objectives

1. Distinguish authentication from authorization in distributed systems.
2. Understand how JWT, OAuth 2.0, and OpenID Connect (OIDC) are used.
3. Secure communication between services using zero-trust principles.
4. Design defenses against common application vulnerabilities.

## 1. Authentication vs. Authorization

Authentication and authorization are different security processes.

### Authentication (AuthN)

Authentication verifies **who a user or service is**.

For example:
- A user submits login credentials.
- The identity service validates those credentials.
- The system issues an appropriate authentication token.

### Authorization (AuthZ)

Authorization determines **what an authenticated identity is allowed to do**.

For example:
- A patient can view their own appointments.
- A healthcare professional can access information permitted by their role.
- An administrator can perform restricted administrative operations.

**Key principle:** Authenticate the identity, then authorize every protected action. A successful login does not grant unrestricted access to the system.

## 2. Tokens: JWT, OAuth 2.0 and OIDC

These technologies have different responsibilities.

### JSON Web Token (JWT)

A JWT is a token format that can carry signed claims, such as:
- Subject or user identifier.
- Roles or permissions.
- Issuer and audience.
- Expiration time.

A client commonly sends a bearer token through the HTTP authorization header:

```http
Authorization: Bearer <token>
```

Services must validate the token's signature and relevant claims, including expiration, issuer, and audience. They must also use an explicitly trusted signing algorithm and key configuration.

JWT validation can avoid a database lookup for every request, but revocation and permission changes require additional design considerations.

### OAuth 2.0

OAuth 2.0 is an authorization framework that allows applications to obtain delegated access to protected resources.

### OpenID Connect (OIDC)

OIDC adds an identity layer on top of OAuth 2.0. It defines how clients can authenticate users and obtain identity information.

**Important distinction:** OAuth 2.0 is primarily about delegated authorization, OIDC provides an authentication layer, and JWT is a token format. They are related but are not interchangeable.

## 3. The Gateway as a Choke Point — But Not the Only Guard

An API gateway can provide a centralized entry point for:
- Authentication.
- Request routing.
- Rate limiting.
- Token validation.
- Basic access checks.

However, the gateway must not be the only security control.

Internal services should independently verify the identity and permissions required for their protected operations. A compromised service or an incorrectly exposed internal endpoint must not automatically gain unrestricted access.

This is a central zero-trust principle: **network location alone does not establish trust**.

## 4. Service-to-Service Trust

Services must authenticate when communicating with other services.

Common approaches include:

### Mutual TLS (mTLS)

Both communicating services present and validate certificates. This provides mutual identity verification and encrypted communication.

### Short-Lived Service Tokens

A service receives a limited-duration credential that identifies it and grants only the permissions required for its task.

### Least Privilege

Every service and credential should have only the minimum permissions needed.

Additional good practices:
- Store secrets in an appropriate secrets manager.
- Rotate credentials regularly.
- Avoid hardcoded credentials.
- Encrypt communication between services.
- Restrict access to internal APIs.

## 5. Design Against Common Vulnerabilities

Applications should be designed to prevent common security weaknesses.

### Broken Access Control

Occurs when users can perform actions or access resources beyond their permissions.

**Mitigation:** Enforce authorization on every protected operation and verify resource ownership.

### Injection

Occurs when untrusted input is interpreted as executable commands or queries.

**Mitigation:** Validate input and use parameterized queries or safe APIs.

### Broken Authentication

Occurs when authentication mechanisms, credentials, or sessions are improperly implemented.

**Mitigation:** Use secure authentication flows, strong token validation, and appropriate session management.

### Security Misconfiguration

Occurs when systems use insecure defaults, expose unnecessary services, or reveal excessive error details.

**Mitigation:** Apply secure configuration and review deployment settings.

### Sensitive Data Exposure

Occurs when confidential information is disclosed or inadequately protected.

**Mitigation:** Encrypt data in transit and at rest, restrict access, and avoid logging sensitive information.

### Server-Side Request Forgery (SSRF)

Occurs when an attacker manipulates a server into making requests to unintended internal or external resources.

**Mitigation:** Validate destinations, restrict outbound requests, and apply network controls.

### Password Storage

Passwords must never be stored in plaintext. Use a password-hashing algorithm designed for this purpose, such as Argon2id or bcrypt, with appropriate parameters and salts.

## 6. A Real-World Scenario

Imagine an endpoint such as:

`DELETE /admin/users`

The endpoint has no authorization checks because developers assume it will only be called internally.

If another service is compromised or an SSRF vulnerability provides access to the endpoint, an attacker could delete user accounts.

A safer design requires:

1. Authentication for every request.
2. An explicit administrative permission or scope.
3. Authorization checks inside the service.
4. Service-to-service authentication using mTLS or short-lived credentials.
5. Audit logging for sensitive administrative operations.

An endpoint is not safe simply because it is considered internal.

## 7. Common Mistakes

- Assuming internal network traffic is automatically trusted.
- Using long-lived tokens with excessive permissions.
- Hardcoding credentials or secrets in source code.
- Missing authorization checks on protected resources.
- Storing passwords in plaintext.
- Exposing sensitive information through error messages.
- Relying exclusively on the API gateway for security.

## Self-Check

1. When should authorization be checked?  
   **Answer:** On every protected action, not only during login or at the gateway.

2. How should a service validate a JWT?  
   **Answer:** Verify its signature and relevant claims, including expiration, issuer, and audience.

3. What does zero trust mean?  
   **Answer:** Do not automatically trust a request because it comes from an internal network; verify identity and permissions.

4. How should service-to-service calls be secured?  
   **Answer:** Use mTLS or short-lived, least-privilege service tokens.

5. What is broken access control?  
   **Answer:** A vulnerability that allows users to access resources or perform actions beyond their permissions.

6. Why is an internal endpoint without authentication dangerous?  
   **Answer:** A compromised service or SSRF vulnerability could allow an attacker to reach it.

## This Week

Review the security of Salud Activa / GestionTurnosApp. Authenticate requests at the system entry point, validate tokens in the services that handle protected operations, and enforce authorization for each sensitive action.

Review service-to-service communication, password hashing, secret management, and input validation. Identify endpoints that require additional permissions and document the evidence of security tests.

---

**Distributed Systems · Week 13 · Session 01 · Security in Distributed Systems — Authentication, Authorization and Zero Trust**  
Systems Engineering · CORHUILA · 2026-B