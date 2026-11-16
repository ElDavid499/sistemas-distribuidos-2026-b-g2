# ADR-C3-01: Keep the Modular Backend as the First Deployment Unit

> Template. Replace every `<...>` and delete this note. Text left as `<...>` counts as missing.


# ADR-C3-01: Keep the Modular Backend as the First Deployment Unit

## Status

Proposed

## Context

Salud Activa currently uses a modular backend developed with Node.js and Express, where the main functionalities, including appointments, medication, medical studies, chat, identity, and administration, operate within the same application. The current service catalog describes this structure as one backend, while older architecture documents mention six independently deployed services. Since the actual deployment of those six services has not been verified, the team needs a consistent architecture for the Huawei Cloud design. The goal is to maintain the modular backend as the initial deployment unit and avoid treating proposed services as already implemented.

## Decision

Keep the existing Node.js/Express backend as a single deployment unit, with two proposed application instances distributed across two availability zones behind a load balancer. Maintain the existing module boundaries and domain responsibilities without creating separate deployments or databases for each module. The use of Huawei Cloud services such as ELB and ECS remains part of the proposed design and must be validated by the team before implementation.

## Alternatives considered

- Deploy all six microservices immediately: although older architecture documents describe this approach, the current service catalog does not confirm that all six services have independent deployments, databases, and configurations. Implementing them now would increase infrastructure complexity and costs.
- Extract only selected modules into independent services: this would allow individual modules to scale and deploy separately, but the current service boundaries and shared data models need further analysis before making this change.

## Consequences

- Positive: maintaining one modular backend simplifies deployment, keeps the architecture aligned with the current service catalog, and reduces infrastructure complexity while allowing future service extraction.
- Negative: the entire API must scale as one unit, and a failure in the main application process could affect several functional modules. The architecture and deployment documentation must also be updated to reflect the team's final decision.
