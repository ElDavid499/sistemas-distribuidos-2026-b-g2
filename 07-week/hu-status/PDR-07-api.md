# PDR — 07-api: API Contracts and Interfaces

## 1. Purpose
Define the requirements for documenting HTTP interfaces and contracts that allow the mobile application, external clients, and microservices to communicate consistently and verifiably.

## 2. Problem and context
Uncoordinated changes to routes, formats, authentication, or errors can break consumers. The project needs clear contracts before an interface is considered ready for implementation or integration.

## 3. Objectives
- Define common REST standards.
- Document endpoints, parameters, schemas, responses, and errors.
- Specify authentication and authorization.
- Maintain OpenAPI contracts for each service and reusable components.
- Support contract testing and compatibility reviews.

## 4. Scope
Includes REST conventions, versioning, pagination, error formats, security, OpenAPI contracts, and testing guidelines. Endpoints and flows must be checked against the requirements and existing code.

## 5. Functional requirements
- **FR-API-01:** Each endpoint must document its method, path, purpose, and required permissions.
- **FR-API-02:** Operations must describe path, query, header, and body parameters where applicable.
- **FR-API-03:** Each response must define its HTTP status code and output schema.
- **FR-API-04:** Errors must use a consistent format, including an identifiable code and validation details where appropriate.
- **FR-API-05:** Contracts must document authentication and authorization mechanisms.
- **FR-API-06:** OpenAPI specifications must be maintained per service, using shared components where appropriate.
- **FR-API-07:** Breaking changes must be identified and have a versioning strategy.
- **FR-API-08:** Contracts must support the design of automated contract tests.

## 6. Non-functional requirements
- **NFR-API-01:** Paths must be consistent, use resource names, and avoid unnecessary verbs.
- **NFR-API-02:** Responses must not expose passwords, tokens, or unnecessary sensitive data.
- **NFR-API-03:** Contracts must be readable, version-controlled, and reviewable through change control.
- **NFR-API-04:** Specifications must be valid against the OpenAPI version declared in each file.
- **NFR-API-05:** Authorization must be enforced on the server and must not rely solely on the client.

## 7. Rules and constraints
- Use consistent path and HTTP status-code conventions.
- Document successful responses and expected errors.
- Do not claim an endpoint is implemented merely because it appears in a specification.
- Names and schemas must align with `06-data/` and functional requirements.
- Verify actual deployment, port, and authentication details in the repository before stating them as facts.

## 8. Deliverables
- `guidelines.md` and authentication documentation.
- Contracts in `contracts/openapi/`, including shared components.
- Endpoint documentation and versioning rules.

## 9. Acceptance criteria
- [ ] Every endpoint has a documented method, path, description, and response.
- [ ] Schemas identify required fields, types, and formats.
- [ ] Authentication, authorization, and errors are documented.
- [ ] OpenAPI contracts validate without errors.
- [ ] No known contradictions remain with requirements, data models, or implementation.
- [ ] Potentially breaking changes are clearly flagged.

## 10. Dependencies and traceability
Based on `04-requirements/`, `06-data/`, and `02-domain/domain-events.md`. It informs `09-microservices/` documentation and quality testing.

## 11. Out of scope
Automatically implementing endpoints, issuing real credentials, or claiming an API is deployed without evidence.
