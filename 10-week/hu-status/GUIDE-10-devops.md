# Work Guide — 10-devops: Local Setup, Environments, and CI/CD

## 1. Purpose of this guide
Organize the documentation needed to set up the project locally, understand its environments, and define a safe integration and deployment process. Clearly distinguish verified instructions from future proposals.

## 2. Expected outcome
Reproducible, safe instructions aligned with the repository and actual technology stack. Do not describe a pipeline, infrastructure, or deployment as existing if it is only planned.

## 3. Main files
- `README.md`: DevOps index and overview.
- `local-setup.md`: local environment setup.
- `environments.md`: environments, configuration, and differences.
- `ci-cd.md`: current or proposed integration and deployment flow.
- Root `.env.example`: variable reference; it must never contain real secrets.
- `.github/workflows/`: workflows to inspect before documenting automation.

## 4. Work plan

### Step 1 — Verify the actual state
- [ ] Inspect `package.json`, Dockerfiles, Compose files, scripts, and existing workflows.
- [ ] Record commands, versions, ports, and prerequisites only after checking them.
- [ ] Compare instructions with the code and fix outdated commands.
- [ ] Label each item as **verified**, **proposed**, or **pending confirmation**.

### Step 2 — Complete local setup instructions
- [ ] List prerequisites and supported versions.
- [ ] Document installation, environment variables, startup, tests, and common troubleshooting.
- [ ] Explain how to create local configuration from `.env.example` without sharing secrets.
- [ ] Clarify ports, external dependencies, and how to confirm the application is running.
- [ ] Test commands in a clean environment or record who verified them and when.

### Step 3 — Describe environments
- [ ] Define the purpose of development, testing/QA, and production if those environments apply.
- [ ] Document differences in configuration, access, data, and deployment.
- [ ] Do not include credentials, tokens, private addresses, or secrets.
- [ ] Explain variable management and which configuration must never be committed.
- [ ] Do not invent cloud resources or environments the team has not created.

### Step 4 — Define CI/CD
- [ ] First describe existing workflows and their triggers.
- [ ] Separately propose desired stages such as linting, tests, analysis, artifact builds, and deployment.
- [ ] Specify branch/event triggers, approval conditions, and failure handling according to team policy.
- [ ] Identify required secrets or permissions without including their values.
- [ ] Label steps that have not yet been implemented.

### Step 5 — Validate and maintain
- [ ] Run the documented commands and record the results.
- [ ] Check links, filenames, and paths.
- [ ] Ensure `README.md`, `local-setup.md`, `environments.md`, and `ci-cd.md` do not contradict one another.
- [ ] Update the guide when scripts, dependencies, ports, or workflows change.

## 5. Completion checklist
- [ ] A team member can follow the local setup without undocumented verbal instructions, within the stated prerequisites.
- [ ] Commands have been verified or are explicitly marked as pending.
- [ ] Environments and variables are explained without exposing secrets.
- [ ] CI/CD clearly distinguishes existing automation from proposals.
- [ ] Documented workflows match files in the repository.

## 6. Dependencies
Review `05-architecture/` and deployment documentation, branch and security policies in `00-governance/`, and the project's actual scripts and configuration.

## 7. Out of scope
This documentation does not create pipelines or infrastructure automatically. Proposed CI/CD changes must be implemented separately and tested before being described as operational.
