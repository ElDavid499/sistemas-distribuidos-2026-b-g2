
# ADR-C3-02: Build Once and Promote the Backend Image Using SWR

## Status

Proposed

## Context

Salud Activa uses a modular Node.js/Express backend as its initial deployment unit. Building a new Docker image separately for each environment can create differences between the version tested in qa and the version deployed to production. It can also make rollbacks more difficult because the previous version may need to be built again from the source code. Section 2 (Operations) and Section 5 of the design note require a consistent deployment process, where the same application artifact can be tested, promoted, and restored when necessary.

## Decision

Build the Docker image of the modular backend once after the changes are merged into the `qa` branch, and push it to Huawei Cloud SWR with a versioned tag. Promote the same image to the production environment after successful validation in qa. If a problem occurs, restore the previous version by deploying the image already stored in SWR instead of rebuilding it.

## Alternatives considered

- Build the image separately for each environment: this could result in different application artifacts between qa and production, making deployments less consistent and rollbacks more complicated.
- Use Docker Hub or GitHub Container Registry: these platforms provide image storage, but Huawei Cloud SWR is preferred to keep the container images within the same cloud ecosystem as the proposed infrastructure.

## Consequences

- Positive: qa and production use exactly the same backend image, improving deployment consistency and allowing previous versions to be restored without rebuilding.
- Negative: image tags must be properly managed, and unused images must be cleaned up periodically to control storage consumption and costs.

