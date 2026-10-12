# Work Guide — 09-microservices: Microservice Documentation

## 1. Purpose of this guide
Describe how to maintain verifiable information about services, responsibilities, data, dependencies, events, and operations. Services may have different levels of maturity, so prioritize consistency and do not invent capabilities.

## 2. Expected outcome
A reliable catalog that explains what each service does, which data it owns, how it communicates, and what remains undocumented before it can be considered ready.

## 3. Main files
- `README.md`: overview and navigation.
- `service-catalog.md`: service inventory.
- `service-boundary-rules.md`: criteria for separating responsibilities.
- `data-ownership-matrix.md`: data ownership.
- `dependency-map.md`: service dependencies.
- `communication-patterns.md` and `event-catalog.md`: communication and events.
- `service-readiness-checklist.md`: operational readiness.
- `services/`: individual service records; `_template/` is the template.

## 4. Work plan

### Step 1 — Confirm the inventory
- [ ] Read the catalog and inspect each folder under `services/`.
- [ ] Classify each service as existing, in development, proposed, or pending confirmation.
- [ ] Compare the catalog with OpenAPI contracts and architecture documentation.
- [ ] Do not assume a folder or contract means a microservice is deployed.

### Step 2 — Complete individual service records
For each service, use the template and document:
- [ ] Purpose and included/excluded responsibilities.
- [ ] Interfaces and related contracts.
- [ ] Owned data and access rules.
- [ ] Published/consumed events, where applicable.
- [ ] Known dependencies, configuration, and operational requirements.
- [ ] Design decisions and open risks.
- [ ] Execution, troubleshooting, and recovery procedures only when verified.

### Step 3 — Review boundaries and ownership
- [ ] Ensure each data set has a clear owner.
- [ ] Prevent a service from directly reading or modifying another service's private database.
- [ ] Justify synchronous calls and event-based communication.
- [ ] Identify circular dependencies and duplicated responsibilities.
- [ ] Record exceptions as explicit decisions.

### Step 4 — Align events and dependencies
- [ ] For each event, identify producer, consumers, purpose, and schema/version when known.
- [ ] Distinguish existing events from proposed events.
- [ ] Keep `dependency-map.md` and `event-catalog.md` aligned with service records.
- [ ] Do not claim a broker or messaging mechanism exists unless verified.

### Step 5 — Review operational readiness
- [ ] Apply `service-readiness-checklist.md` to each relevant service.
- [ ] Record outstanding observability, error-handling, security, and operations work.
- [ ] Verify execution instructions against actual code and configuration.
- [ ] Update service records when a contract, model, or architecture decision changes.

## 5. Completion checklist
- [ ] Every catalog entry has a status and defined purpose.
- [ ] Service records follow a common structure.
- [ ] Data ownership, contracts, events, and dependencies are consistent.
- [ ] Proposed capabilities are distinguished from verified capabilities.
- [ ] Operational readiness checks identify concrete outstanding tasks.

## 6. Dependencies
Coordinate with `05-architecture/`, `06-data/`, `07-api/`, and `08-uml/`. Changes to service boundaries should be reviewed as architecture decisions, not just text edits.

## 7. Out of scope
This guide does not require splitting the backend automatically or deploying every service. First document and verify the actual state; architectural migration requires separate planning, implementation, and testing.
