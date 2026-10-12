# Work Guide — 08-uml: Diagrams and Visual Models

## 1. Purpose of this guide
Explain how to review, create, and maintain diagrams that describe the system architecture and workflows. Each diagram should represent a documented decision or behavior and have an editable source whenever possible.

## 2. Expected outcome
A diagram catalog that is consistent with the architecture, services, data models, and API contracts, without orphaned images or contradictory diagrams.

## 3. Files and structure
- `README.md`: instructions and navigation.
- `diagram-index.md`: diagram inventory and purpose.
- `diagrams/source/`: editable diagram sources, including existing C4 references.

## 4. Work plan

### Step 1 — Inventory the diagrams
- [ ] Review `README.md`, `diagram-index.md`, and all available source files.
- [ ] For each diagram, record its purpose, audience, status, source, and related document.
- [ ] Identify missing, duplicated, outdated, or unreadable diagrams.

### Step 2 — Prioritize what is needed
- [ ] Ensure the system context and container views exist when the architecture is known.
- [ ] Identify service interactions that would benefit from sequence or activity diagrams.
- [ ] Identify data models that need an entity-relationship diagram.
- [ ] Avoid creating diagrams that repeat information without adding value.

### Step 3 — Update or create diagrams
- [ ] Use the formats and tools already accepted by the repository, such as Mermaid or PlantUML.
- [ ] Keep editable source files in the documented source directory.
- [ ] Export images only when required by the project's conventions.
- [ ] Label proposed components and flows as proposed.

### Step 4 — Check consistency
- [ ] Compare service names and dependencies with `09-microservices/` and `05-architecture/`.
- [ ] Compare entities and relationships with `06-data/`.
- [ ] Compare API calls and payloads with `07-api/`.
- [ ] Verify that arrows, labels, legends, and boundaries are understandable.

### Step 5 — Update the index and validate
- [ ] Add or update the diagram entry, source path, purpose, and status.
- [ ] Check all links and confirm files exist at the listed paths.
- [ ] Review affected diagrams whenever architecture or contracts change.

## 5. Completion checklist
- [ ] Every published diagram appears in the index.
- [ ] Source files are available at documented paths.
- [ ] Diagrams match the current documented architecture and behavior.
- [ ] Proposed components are clearly distinguished from existing ones.
- [ ] Diagrams are readable and provide useful information.

## 6. Dependencies
Coordinate with `02-domain/`, `05-architecture/`, `06-data/`, `07-api/`, and `09-microservices/`.

## 7. Out of scope
Replacing written requirements with diagrams or maintaining visuals that provide no additional information.
