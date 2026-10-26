# Distributed Systems — Week 12 — Session 01
## Cloud Deployment: Models, Strategies and Zero-Downtime

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Weekly · Corte 3

## Introduction

Software containers must reach real users through reliable deployment processes. This session explores cloud deployment models, immutable artifacts, zero-downtime deployment strategies, horizontal scaling, and failure handling.

The objective is to make releases repeatable, reliable, and reversible.

## Learning Objectives

1. Compare cloud deployment models.
2. Run containers in the cloud using virtual machines, managed services, or orchestrators.
3. Apply zero-downtime strategies such as rolling, blue-green, and canary deployments.
4. Scale services horizontally and plan for instance failures.

## 1. Deployment Models: How Much Do You Manage?

Cloud deployment models offer different levels of control and convenience.

### Infrastructure as a Service (IaaS)

The provider supplies virtualized infrastructure, while the team manages operating systems, runtime environments, applications, and much of the configuration.

### Containers on Managed Services or Orchestrators

The team packages applications into container images. A container platform runs and manages those images, often providing health checks, scaling, and replacement of failed instances.

### Platform as a Service (PaaS)

The team provides application code while the platform manages much of the underlying infrastructure, runtime, and deployment process.

### Serverless / Function as a Service (FaaS)

The team deploys functions or event-driven code without managing individual servers directly. The provider manages the execution infrastructure.

**Key principle:** More managed services generally mean less infrastructure management, but may also mean less control over the underlying environment. Choose the model according to the application's requirements, operational capacity, cost, and scaling needs.

## 2. Build Once, Deploy the Artifact

A reliable deployment pipeline follows the **build → release → run** approach.

1. **Build:** Create the application artifact or container image in the CI pipeline.
2. **Release:** Combine the tested artifact with the configuration required for a specific environment.
3. **Run:** Execute that release in the target environment.

The same versioned image should be promoted through development, QA, and production. Environment-specific configuration may change, but the application artifact should remain the same.

For example, if image `salud-activa:v2.0.0` passes QA, production should use that same image rather than rebuilding it.

This improves reproducibility, traceability, and confidence in releases.

## 3. Zero-Downtime Deployment Strategies

Stopping the old version before starting the new one can interrupt service availability. Zero-downtime strategies reduce or avoid that interruption when the application and infrastructure support them.

### Rolling Deployment

Instances are replaced gradually. The platform keeps enough healthy instances running to continue serving requests.

**Best suited for:** Services that support multiple instances and compatible transitions between versions.

### Blue-Green Deployment

Two environments are maintained:

- **Blue:** The current version serving users.
- **Green:** The new version being validated.

Once Green passes its health checks, traffic is switched to it. Blue can remain available temporarily to facilitate rollback.

**Best suited for:** Releases that benefit from a rapid traffic switch and a clear rollback path.

### Canary Deployment

A small percentage of traffic is routed to the new version first. The team monitors performance and errors before gradually increasing traffic.

**Best suited for:** Risk-sensitive changes where early production feedback is valuable.

These strategies require suitable traffic routing, health checks, monitoring, and a plan for handling state and database changes.

## 4. Scale Horizontally and Expect Failure

Horizontal scaling, also called scaling out, adds more service instances instead of relying only on a larger server.

A typical architecture is:

`Clients → Load Balancer → Service Instances → Database`

Good practices include:

- Keep application instances stateless where practical.
- Store persistent data in appropriate databases or storage systems.
- Configure health checks.
- Replace or restart unhealthy instances automatically where supported.
- Use autoscaling signals such as CPU utilization, request rate, or queue depth.
- Ensure databases and other shared dependencies can handle the increased load.

Scaling out improves capacity and resilience, but it does not eliminate failures. Each instance should be treated as replaceable.

## 5. A Real-World Scenario

Imagine a team deploys manually by connecting to a server through SSH, running `git pull`, and restarting the application.

The process works until someone forgets a step. The application becomes unavailable for several minutes, and the team cannot reliably reproduce the exact running version.

A better approach is to:

1. Build a versioned, immutable artifact.
2. Store it in a container registry.
3. Deploy it through an automated pipeline.
4. Use rolling or blue-green deployment where supported.
5. Validate service health after deployment.
6. Keep the previous known-good version available for rollback.

Automated deployments reduce human error and make releases more repeatable.

## 6. Common Mistakes

- Rebuilding a different artifact for production.
- Stopping the old version before the new one is ready.
- Relying on manual, undocumented deployment steps.
- Scaling only vertically without evaluating horizontal scaling.
- Storing application state inside replaceable service instances.
- Deploying without health checks, monitoring, or rollback procedures.

## Self-Check

1. What changes when moving from IaaS toward serverless?  
   **Answer:** Convenience generally increases while direct infrastructure control decreases.

2. What does “build once, deploy the artifact” mean?  
   **Answer:** Build the image in CI and promote that same image through environments.

3. What is the main advantage of blue-green deployment?  
   **Answer:** Traffic can be switched to the new environment, with a rapid rollback option when the old environment is retained and compatible.

4. How should services handle increased load and instance failure?  
   **Answer:** Scale horizontally behind a load balancer and use health checks.

5. Why are manual SSH deployments problematic?  
   **Answer:** They are difficult to reproduce and can introduce mistakes and downtime.

6. Which strategies can support zero-downtime releases?  
   **Answer:** Rolling, blue-green, and canary deployments, when properly configured.

## This Week

Deploy the system to a cloud environment or production-like host using a versioned, tested artifact. Select a deployment strategy that fits the infrastructure, configure health checks, and document how to verify the release and restore the previous version.

For Salud Activa / GestionTurnosApp, record the deployment process and identify the operational requirements that must be met before applying the strategy to production.

---

**Distributed Systems · Week 12 · Session 01 · Cloud Deployment — Models, Strategies and Zero-Downtime**  
Systems Engineering · CORHUILA · 2026-B