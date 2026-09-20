# Distributed Systems

**Week 6 · Session 1 · Docker Compose and Orchestration Basics**

**CORHUILA**  
Systems Engineering · 2026-B

**Unit 2 · Weekly · Corte 2**

---

# Docker Compose and Orchestration Basics

One container is easy; a distributed system is many containers that must start in the right order, find each other, stay healthy and scale.

This session covers Docker Compose, shared networks, dependencies, health checks, environments, volumes and the role of orchestration when a system grows beyond a single host.

## Learning objectives

1. Compose a multi-service system with a shared network.
2. Control startup using health checks and `depends_on`.
3. Externalize configuration per environment.
4. Understand what an orchestrator adds and when it is needed.

---

# 1. From "a container" to "a system"

Docker Compose describes the complete system as a group of **services** connected through a shared network.

Each service can have:

- An image or Dockerfile.
- Environment variables.
- Volumes.
- Ports.
- Dependencies.
- Health checks.

Services communicate using their **service name** through Docker's internal DNS.

### Example

```text
Docker Compose Network

┌──────────────┐
│  orders-api  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│      db      │
└──────────────┘

┌──────────────────┐
│ inventory-api    │
└──────────────────┘
```

The API can reach the database using:

```text
postgres://db:5432/orders
```

Instead of using a hard-coded IP address.

---

# 2. A Compose File

A Compose file defines the services and how they interact.

```yaml
services:
  orders-api:
    build: ./orders
    environment:
      DB_URL: postgres://db:5432/orders
      INVENTORY_URL: http://inventory-api:8080
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: orders
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s

volumes:
  dbdata:
```

## Important elements

| Element | Purpose |
|---|---|
| `services` | Defines the application services |
| `build` | Builds an image from a Dockerfile |
| `image` | Specifies the image to use |
| `environment` | Provides configuration |
| `depends_on` | Defines service dependencies |
| `ports` | Exposes container ports |
| `volumes` | Provides persistent storage |
| `healthcheck` | Verifies service health |

---

# 3. Startup Order Is a Lie You Must Handle

A common mistake is assuming that `depends_on` means the dependency is ready.

It does not necessarily mean that.

A container can be running while the application inside it is still initializing.

### Problem

```text
docker compose up
       │
       ▼
     DB starts
       │
       ▼
 orders-api starts
       │
       ▼
DB is still initializing
       │
       ▼
Connection fails
```

### Solution

Use:

- `healthcheck`
- `depends_on`
- `condition: service_healthy`
- Application retry with backoff

```text
DB starts
   │
   ▼
Health check
   │
   ├── Not healthy → Retry
   │
   └── Healthy
         │
         ▼
   orders-api starts
         │
         ▼
      System ready
```

This makes startup more deterministic.

---

# 4. One File, Many Environments

A base Compose file can be reused across different environments.

Typical environments are:

- **Develop** — fast and disposable.
- **QA** — integration and testing.
- **Prod** — real users and production resources.

Example:

```text
compose.yml
compose.override.yml
compose.qa.yml
compose.prod.yml
```

The configuration changes depending on the environment.

Secrets should come from environment variables or a secret-management system.

**Secrets must never be committed to Git.**

---

# 5. When Compose Is Not Enough: Orchestrators

Docker Compose is useful for:

- Local development.
- Testing.
- Small deployments.
- Applications running on one host.

When the system needs more infrastructure, an orchestrator such as Kubernetes can provide:

- Multiple hosts.
- Self-healing.
- Automatic container restarts.
- Rolling updates.
- Autoscaling.
- Cluster-level management.

### Conceptual model

```text
Docker Compose
      │
      ▼
 Single Host
 ┌────┼────┐
 │    │    │
API   DB   Other


Kubernetes
      │
      ▼
    Cluster
 ┌────┼────┐
Node Node Node
 │    │    │
Pods Pods Pods
```

The concepts remain similar: services, networks, configuration and health checks, but at cluster scale.

---

# 6. A Path You Will Face in Real Life

## Scenario

The API fails when executing:

```bash
docker compose up
```

However, it works when the database is started manually first.

## Cause

The API connects to PostgreSQL before PostgreSQL finishes initializing.

## Fix

Add a health check:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
```

Then configure:

```yaml
depends_on:
  db:
    condition: service_healthy
```

Finally, implement retry with backoff inside the application.

## Result

The system can start without manually starting the database first.

---

# 7. Common Mistakes

- Relying only on `depends_on`.
- Confusing container startup with service readiness.
- Hard-coding IP addresses.
- Using IPs instead of service names.
- Committing secrets to Git.
- Baking environment configuration into images.
- Storing database data only in the container filesystem.
- Not using volumes for persistent data.

---

# Self-Check

## Question 1

**In Compose, a service reaches another by...**

**Answer:** Its service name on the shared network.

Example:

```text
http://inventory-api:8080
```

---

## Question 2

**`depends_on` without a condition guarantees...**

**Answer:** Start order only. It does not guarantee that the dependency is ready.

---

## Question 3

**Database data should live in...**

**Answer:** A named volume.

```yaml
volumes:
  dbdata:
```

---

## Question 4

**Per-environment differences are handled by...**

**Answer:** Compose configuration and environment values.

---

## Question 5

**When do you move from Compose to an orchestrator?**

**Answer:** When the system requires capabilities such as multiple hosts, self-healing, rolling updates or autoscaling.

---

## Question 6

**`docker compose up` fails in CI but works locally after starting the DB manually. What is the solution?**

**Answer:** Add a database health check, use `condition: service_healthy` and implement application retry/backoff.

---

# This Week

Bring the whole system up with a single:

```bash
docker compose up
```

The system should include:

- A shared Docker network.
- Multiple services.
- Service-name-based communication.
- Health checks.
- `depends_on` with `service_healthy`.
- Application retry/backoff.
- Configuration through environment variables.
- Persistent database volumes.
- No secrets committed to Git.

The objective is to have a reproducible system where the services can start and communicate correctly without manual intervention.

---

**Distributed Systems · Week 6 · Session 1**  
**Docker Compose and orchestration basics**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**