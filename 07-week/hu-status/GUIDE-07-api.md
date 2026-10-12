# Work Guide — 07-api: API Contracts and Documentation

## 1. Purpose of this guide
Organize the work required to review and complete API contracts, especially OpenAPI specifications, authentication, responses, and compatibility. This is a documentation and validation plan, not a claim that every endpoint has been implemented.

## 2. Expected outcome
Developers and API consumers can determine which operations each interface offers, what data they send and receive, which authentication is required, and how errors are reported.

## 3. Main files
- `README.md`: API documentation index.
- `api-architecture-standards.md` and `guidelines.md`: shared conventions.
- `api-contract-appt-mgmt.md`: functional reference contract.
- `authentication.md` and `authentication-appt-mgmt.md`: authentication documentation.
- `contracts/openapi/`: service-level YAML specifications and shared schemas.

## 4. Work plan

### Step 1 — Inventory the contracts
- [ ] List OpenAPI files and identify their service or interface.
- [ ] Check whether each contract is current, incomplete, proposed, or awaiting verification.
- [ ] Compare documented routes with requirements and implementation evidence.

### Step 2 — Complete endpoint definitions
- [ ] Document method, path, purpose, parameters, request body, and permissions where applicable.
- [ ] Define success responses, HTTP status codes, and response schemas.
- [ ] Document expected errors and a consistent error format.
- [ ] Use reusable schemas and shared components where appropriate.

### Step 3 — Review security
- [ ] Document authentication and authorization requirements.
- [ ] Confirm which operations require particular roles or permissions, if defined.
- [ ] Ensure examples contain no real tokens, passwords, or personal data.
- [ ] Do not treat client-side checks as a substitute for server-side authorization.

### Step 4 — Validate OpenAPI and compatibility
- [ ] Validate specifications with a tool already approved or used by the project.
- [ ] Check required fields, types, formats, references, and response codes.
- [ ] Identify breaking changes and document the versioning or migration approach.
- [ ] Compare API schemas with `06-data/` and domain rules.

### Step 5 — Review and maintain
- [ ] Fix broken links and stale examples.
- [ ] Make sure the documentation distinguishes specified endpoints from verified implementations.
- [ ] Update related service documentation and tests when contracts change.

## 5. Completion checklist
- [ ] Each relevant endpoint has a method, path, description, request, and response.
- [ ] Authentication, authorization, and expected errors are documented.
- [ ] OpenAPI specifications pass validation or remaining issues are recorded.
- [ ] Schemas align with data models and domain requirements.
- [ ] Breaking changes are identified and explained.

## 6. Dependencies
Coordinate with `04-requirements/`, `02-domain/`, `06-data/`, `08-uml/`, and `09-microservices/`.

## 7. Out of scope
Implementing endpoints, issuing real credentials, or claiming an API is deployed solely because its contract is documented.
