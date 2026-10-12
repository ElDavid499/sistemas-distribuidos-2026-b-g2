# PDR — 06-data: Data Modeling and Management

## 1. Purpose
Define the requirements for modeling, documenting, protecting, and evolving Appointment Management App data while keeping data ownership within each microservice and avoiding coupling through shared databases.

## 2. Problem and context
The system includes services with different responsibilities. Without shared rules for modeling, auditing, migrations, and ownership, duplicate data, inconsistencies, and incompatible changes may arise.

## 3. Objectives
- Document each service's data models.
- Define the meaning, type, and constraints of relevant fields.
- Establish conventions for identifiers, auditing, deletion, and naming.
- Describe how migrations are applied and rolled back.
- Maintain traceability between domain entities, data models, and API contracts.

## 4. Scope
Includes relational or document models, a data dictionary, indexes, constraints, data ownership, auditing, soft deletion, and a migration strategy. The final choice of database engine or tool must reflect verified architectural decisions.

## 5. Functional requirements
- **FR-DAT-01:** Each microservice must have documented data models.
- **FR-DAT-02:** Each entity must identify its fields, types, required status, keys, and constraints.
- **FR-DAT-03:** The data dictionary must define important fields and permitted values.
- **FR-DAT-04:** The service that owns each entity must be identified.
- **FR-DAT-05:** Existing indexes and their rationale must be documented.
- **FR-DAT-06:** A strategy for versioning and running migrations must be documented.
- **FR-DAT-07:** Schema changes must be reviewed to prevent incompatibilities with APIs and other services.

## 6. Non-functional requirements
- **NFR-DAT-01:** Identifiers must be unique; use UUIDs when required by project conventions.
- **NFR-DAT-02:** Audit fields must be consistent across services; consider `created_at`, `updated_at`, and `deleted_at` where applicable.
- **NFR-DAT-03:** Apply the principle of least privilege to data access.
- **NFR-DAT-04:** Migrations must be reviewable and testable before production.
- **NFR-DAT-05:** A service must not directly read or modify another microservice's database.

## 7. Rules and constraints
1. Each microservice is responsible for its own data.
2. Information must be exchanged through documented API contracts or events.
3. Soft deletion is the default when required by domain rules; exceptions must be justified.
4. Database-engine decisions must not be described as implemented without repository evidence.

## 8. Deliverables
- `models.md`: service models, tables/collections, relationships, and indexes.
- `data-dictionary.md`: field definitions.
- Modeling conventions, normalization considerations, and a migration strategy, if maintained as separate documents.

## 9. Acceptance criteria
- [ ] Each model identifies its owning service and main entities.
- [ ] Relevant fields specify type, required status, and constraints.
- [ ] Audit and deletion rules are documented.
- [ ] The schema-evolution process and migration-failure handling are explained.
- [ ] Models do not contradict the domain or API contracts.

## 10. Dependencies and traceability
Depends on `02-domain/entities-and-rules.md` and `05-architecture/`. It informs `07-api/contracts/openapi/`, `08-uml/`, and the individual models in `09-microservices/`.

## 11. Out of scope
Implementing databases, running production migrations, or selecting tools without architectural approval.
