# Work Guide — 06-data: Data Modeling and Management

## 1. Purpose of this guide
This guide explains what to inspect, complete, and validate in the Appointment Management App data documentation. It is a work plan; it does not mean that every change has already been implemented.

## 2. Expected outcome
Documented data models and fields, integrity rules, auditing, migrations, and service-level data ownership that are consistent with the architecture in `05-architecture/` and `09-microservices/`.

## 3. Files in this area
- `README.md`: folder entry point and navigation.
- `models.md`: entities, relationships, constraints, and modeling conventions.
- `data-dictionary.md`: field definitions and meanings.

## 4. Work plan

### Step 1 — Review what exists
- [ ] Read the files and identify incomplete sections, contradictions, and duplication.
- [ ] Compare entities and rules with `02-domain/entities-and-rules.md`.
- [ ] Confirm which database technologies and conventions are evidenced by the repository.

### Step 2 — Complete the models
- [ ] List each entity/table/collection and identify its owning service.
- [ ] Document fields, data types, required status, keys, relationships, and constraints.
- [ ] Document indexes only when they exist or are explicitly proposed.
- [ ] Keep naming and identifier conventions consistent.

### Step 3 — Complete the data dictionary
- [ ] Describe the meaning and format of each important field.
- [ ] Specify allowed values, validation rules, and whether a field is required.
- [ ] Identify sensitive data and document handling requirements without exposing actual data.

### Step 4 — Document lifecycle and migrations
- [ ] Explain audit fields such as `created_at`, `updated_at`, and `deleted_at` where applicable.
- [ ] Document soft-delete rules and justified exceptions.
- [ ] Describe migration versioning, application, testing, rollback, and failure handling.
- [ ] Do not claim that a migration tool is in use unless verified.

### Step 5 — Cross-check related areas
- [ ] Compare the models with domain rules and OpenAPI schemas in `07-api/`.
- [ ] Check consistency with service-level documentation in `09-microservices/` and diagrams in `08-uml/`.
- [ ] Update links and references when files move or names change.

## 5. Completion checklist
- [ ] Main entities and their owning services are identified.
- [ ] Important fields and constraints are documented.
- [ ] Audit and deletion rules are clear.
- [ ] Migration practices and rollback considerations are described.
- [ ] No known contradictions remain with domain or API documentation.

## 6. Dependencies
Coordinate with `02-domain/`, `05-architecture/`, `07-api/`, `08-uml/`, and `09-microservices/`.

## 7. Out of scope
Creating or changing production databases and executing production migrations as part of a documentation-only task.
