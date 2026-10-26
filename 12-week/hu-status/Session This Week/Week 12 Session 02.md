# Distributed Systems — Week 12 — Session 02
## Planning: Deployment Plan, Infrastructure as Code and Rollback

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Planning · Corte 3

## Introduction

A release is safer when the deployment process is planned, reproducible, and reversible. This session focuses on artifact promotion, Infrastructure as Code (IaC), zero-downtime strategies, rollback rehearsals, and testable deployment stories for MVP 3.

## Learning Objectives

1. Plan artifact promotion across environments.
2. Use Infrastructure as Code to create reproducible environments.
3. Choose an appropriate deployment strategy and rehearse rollback.
4. Divide deployment work into testable MVP 3 user stories.

## 1. The Deployment Pipeline: One Artifact, Promoted

A deployment pipeline should build the application artifact once and promote the same artifact through the required environments.

A typical flow is:

`Source Code → CI Build → Container Registry → Develop → QA → Production`

Each environment uses its own configuration, such as environment variables, secrets, and service endpoints. The application image remains the same throughout promotion.

### Key Principles

- Build and test the artifact in CI.
- Assign a clear version or immutable image digest.
- Store the artifact in a registry.
- Promote the tested artifact rather than rebuilding it.
- Validate health and application behavior at each stage.
- Keep a record of the deployed version and release configuration.

Promotion should happen only after the required checks and approvals have passed.

## 2. Infrastructure as Code (IaC)

Infrastructure as Code describes infrastructure and environment configuration through version-controlled files instead of relying on undocumented manual setup.

Examples include:

- **Docker Compose:** Defines application services and their configuration for suitable environments.
- **Kubernetes manifests:** Describe resources such as deployments, services, and health probes.
- **Terraform:** Defines and manages supported infrastructure resources declaratively.

IaC allows teams to review infrastructure changes, reproduce environments, and detect configuration differences.

### Benefits

- Reproducible environment setup.
- Version-controlled infrastructure changes.
- Easier review and auditing.
- Less dependence on individual team members.
- Better consistency between development, QA, and production.

Infrastructure code does not automatically guarantee identical environments. Teams must also manage configuration, secrets, dependencies, and infrastructure differences deliberately.

## 3. Choose the Strategy and Rehearse the Rollback

Select a deployment strategy according to the application's architecture, risk, and available infrastructure.

### Rolling

Replace instances gradually while keeping enough healthy capacity available. This works well for compatible updates to stateless services.

### Blue-Green

Run the new environment alongside the existing one, validate it, and switch traffic when it is healthy. Retain the old environment when practical so that traffic can be switched back quickly.

### Canary

Expose a small percentage of traffic to the new version, monitor its behavior, and increase exposure only when the required signals remain healthy.

### Rollback Plan

A rollback plan should specify:

1. The conditions that trigger rollback.
2. The version or artifact to restore.
3. The exact command, pipeline action, or traffic switch required.
4. The person responsible for authorizing or executing the rollback.
5. The health checks and metrics used to confirm recovery.
6. How database changes and data compatibility will be handled.

A rollback procedure is trustworthy only after it has been tested. Database migrations and irreversible data changes may require a forward-fix or a separate recovery procedure instead of simply restoring the previous application image.

## 4. Slice the Deployment Stories

MVP 3 deployment work should be divided into small user stories with measurable acceptance criteria.

### Example Story 1: Versioned Artifact

**User story:** As a developer, I want CI to build and publish a versioned container image so that releases can be traced to a specific artifact.

**Acceptance criteria:**
- CI builds the image after the agreed trigger.
- The image is published to the configured registry.
- The image has a traceable version or digest.
- The pipeline reports build and publication failures.

### Example Story 2: Reproducible Environments

**User story:** As a developer, I want infrastructure configuration stored as code so that environments can be recreated consistently.

**Acceptance criteria:**
- Infrastructure configuration is version-controlled.
- Setup instructions are documented.
- Environment-specific configuration is separated from application code.
- A second setup or validation confirms reproducibility.

### Example Story 3: Safe Deployment

**User story:** As an operator, I want the application deployed using a suitable zero-downtime strategy so that releases minimize disruption.

**Acceptance criteria:**
- The selected strategy is documented.
- Health checks are configured.
- Traffic is directed only to healthy instances where supported.
- Deployment success and failure are recorded.

### Example Story 4: Tested Rollback

**User story:** As an operator, I want a documented and rehearsed rollback procedure so that a failed release can be recovered safely.

**Acceptance criteria:**
- The previous known-good artifact is identifiable.
- Rollback steps are documented.
- A controlled rollback exercise is completed in a suitable environment.
- Recovery is confirmed using health checks and relevant metrics.
- The rollback result and any limitations are recorded.

These are example stories. Use the identifiers and workflow established in the actual project repository rather than inventing new HU IDs.

## 5. A Real-World Scenario

Imagine production was configured manually months ago. The person who created it is no longer available, QA differs from production, and a disk failure occurs. The team cannot recreate the environment reliably.

The solution is to:

1. Capture infrastructure configuration as code.
2. Version and review the configuration in Git.
3. Recreate or validate QA using the documented configuration.
4. Identify and document intentional differences between QA and production.
5. Test recovery procedures before an incident occurs.
6. Make future infrastructure changes through reviewed code.

Reproducibility makes both deployment and recovery more reliable.

## 6. Common Mistakes

- Manually configured environments that cannot be reproduced.
- Rebuilding different artifacts for each environment.
- Having a rollback document that has never been tested.
- Allowing QA and production configurations to drift without documentation.
- Storing secrets directly in source code or infrastructure files.
- Assuming application rollback will automatically reverse database changes.

## Self-Check

1. What does artifact promotion mean?  
   **Answer:** Deploying the same built artifact across environments while supplying the appropriate configuration for each one.

2. What is the main benefit of Infrastructure as Code?  
   **Answer:** Reproducible, version-controlled, and reviewable infrastructure.

3. When is a rollback plan trustworthy?  
   **Answer:** After its steps have been tested and recovery has been verified.

4. Which strategy supports a rapid traffic switch and potential reversal?  
   **Answer:** Blue-green deployment, provided the previous environment remains available and compatible.

5. What is a snowflake server?  
   **Answer:** A manually configured machine that is difficult to reproduce consistently.

6. When is QA validation meaningful?  
   **Answer:** When QA sufficiently reflects production's relevant configuration and deployment behavior, and differences are understood.

## This Week

Write the MVP 3 deployment plan for Salud Activa / GestionTurnosApp. Document artifact promotion, the Infrastructure as Code approach, the selected deployment strategy, health checks, and a rollback procedure.

Divide the work into deployment stories with testable acceptance criteria. Rehearse rollback in an appropriate environment and record the result. Do not claim production deployment, zero downtime, or successful rollback until supported by actual test or deployment evidence.

---

**Distributed Systems · Week 12 · Session 02 · Planning — Deployment Plan, IaC and Rollback**  
Systems Engineering · CORHUILA · 2026-B