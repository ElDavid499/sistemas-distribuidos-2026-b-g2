<!-- CONFIG-START -->
- FULL_NAME: David Felipe Perdomo Castillo
- GITHUB_USER: ElDavid499
- TEAM: Appt-Mgmt
- DOCS_REPO: https://github.com/code-corhuila/appt-mgmt-docs
- BOUNDARY: TB1 — Patient clients (Android app / web portal) -> Salud Activa backend `/api/turnos` (inbound)
- CLAIM_ISSUE: https://github.com/code-corhuila/appt-mgmt-docs/issues/26
- REFLECTION_DOC: REFLECTION_DOC_URL
- LIBRARY_BOOK: Nils J. Nilsson, Inteligencia artificial: una nueva síntesis, Primera edición en español, 2001, 006.3 N347
- LIBRARY_RECORD_TIME: 08:47
- STORIES:
https://github.com/code-corhuila/appt-mgmt-docs/issues/27

https://github.com/code-corhuila/appt-mgmt-docs/issues/28

https://github.com/code-corhuila/appt-mgmt-docs/issues/29
<!-- CONFIG-END -->



# Week 13 — Threat Modeling Workshop

Lightweight threat model of **Salud Activa** (`appt-mgmt`), focused on one trust boundary:
the patient clients (Android app and web portal) calling the appointment module
`/api/turnos` of the Salud Activa backend API (`backend/server.js`, Node.js/Express).

| Checkpoint | Where | File |
|------------|-------|------|
| CP0 | this fork | `README.md` |
| CP1 | this fork | `01-attack-surface.md` |
| CP2 | team -docs, branch `security/stride-ElDavid499` | `05-architecture/security/stride-ElDavid499.md` |
| CP3 | team -docs Issues + Project | three `[security]` issues |
| CP4 | this fork | `04-security-ci/` |
| CP5 | this fork | `../hu-status/README.md` |


