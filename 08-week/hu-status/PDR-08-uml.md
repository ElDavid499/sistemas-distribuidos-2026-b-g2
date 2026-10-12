# PDR — 08-uml: Diagrams and Visual Models

## 1. Purpose
Define how the architecture, data, and workflows of Appointment Management App are represented visually so team members can understand and review the system consistently.

## 2. Problem and context
Outdated diagrams can lead to incorrect interpretations of dependencies and system behavior. A catalog of diagrams, editable source files, and maintenance criteria is required.

## 3. Objectives
- Represent the system context and main containers.
- Show relationships between services and their responsibilities.
- Describe relevant flows using sequence or activity diagrams.
- Represent data entities and relationships.
- Link every diagram to its source and related documentation.

## 4. Scope
Includes C4 diagrams, UML behavior diagrams, entity-relationship models, and a diagram index. Sources may use Mermaid, PlantUML, or editable formats compatible with repository conventions.

## 5. Functional requirements
- **FR-UML-01:** A diagram index must list each diagram's name, type, source path, purpose, and maintainer or maintenance status.
- **FR-UML-02:** Context and container diagrams must be provided when the relevant architecture information is defined.
- **FR-UML-03:** Services and their relationships must match the microservice catalog.
- **FR-UML-04:** Data diagrams must match the models documented in `06-data/`.
- **FR-UML-05:** Cross-service flows must show relevant actors, requests, responses, and events.
- **FR-UML-06:** Each diagram must state its scope and must not portray proposed components as implemented.

## 6. Non-functional requirements
- **NFR-UML-01:** Diagrams must be readable on GitHub and in exported versions.
- **NFR-UML-02:** Whenever possible, retain editable source files alongside exported images.
- **NFR-UML-03:** File names must follow a consistent convention, such as `c4-context`, `c4-containers`, or `seq-login`.
- **NFR-UML-04:** Significant architectural changes must trigger a review of affected diagrams.

## 7. Rules and constraints
1. A diagram must reflect the known state of the system.
2. Proposed elements must be labeled as proposed.
3. Avoid duplicate diagrams that communicate the same information unless their distinct purpose is explained.
4. Update the source and index in the same change when appropriate.

## 8. Deliverables
- `diagram-index.md`.
- Diagram source files in `diagrams/source/`.
- Exports in `diagrams/exports/` when needed.
- Architecture, data, and behavior diagrams prioritized according to project needs.

## 9. Acceptance criteria
- [ ] Every published diagram appears in the index.
- [ ] Source files exist at their documented paths.
- [ ] Services, actors, and flows match current documentation.
- [ ] Diagrams can be read without significant ambiguity.
- [ ] Proposed elements are distinguishable from implemented elements.

## 10. Dependencies and traceability
Uses `05-architecture/`, `02-domain/`, `06-data/`, `07-api/`, and `09-microservices/`. It supports design, development, and maintenance reviews.

## 11. Out of scope
Replacing textual requirements specifications or maintaining diagrams that add no useful information.
