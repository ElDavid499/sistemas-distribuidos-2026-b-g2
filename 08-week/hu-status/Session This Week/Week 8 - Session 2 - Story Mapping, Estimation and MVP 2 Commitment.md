# Distributed Systems — Week 8 · Session 2
## Planning — Story Mapping, Estimation and MVP 2 Commitment

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 2 · Planning · Corte 2**

---

## Introduction

Halfway through Corte 2, planning becomes more precise.

The team must understand the complete product journey, estimate work using relative sizing, identify dependencies between services, and commit only to work that realistically fits within the sprint.

This session focuses on **story mapping, planning poker, cross-service dependencies, and realistic MVP 2 commitment**.

### Learning Objectives

By the end of this session, students should be able to:

1. Build a story map representing the product journey.
2. Estimate work using relative sizing and planning poker.
3. Identify and sequence cross-service dependencies.
4. Define a realistic MVP 2 scope according to team velocity and the sprint goal.

---

# 1. Story Mapping: See the Whole Journey

A **story map** organizes the product according to the user's journey.

The main activities form the horizontal backbone, while detailed stories and priorities are organized vertically.

This allows the team to see the complete product flow instead of developing disconnected features.

### Basic Structure

```text
User Journey
──────────────────────────────────────────────→

Activity 1      Activity 2      Activity 3
   │               │               │
   ├─ Story A      ├─ Story D      ├─ Story G
   ├─ Story B      ├─ Story E      ├─ Story H
   └─ Story C      └─ Story F      └─ Story I

──────────── Release Line / MVP ─────────────
```

The **release line** identifies the thinnest end-to-end slice that provides a usable product increment.

Stories below the release line can remain in the backlog for future iterations.

### Benefits of Story Mapping

Story mapping helps the team:

- Understand the complete user journey.
- Identify the MVP scope.
- Prioritize functionality.
- Detect missing steps.
- Avoid building isolated features.
- Maintain an end-to-end perspective.

---

# 2. Estimate Relatively, Not in Hours

Agile teams should estimate the relative size of work instead of treating estimates as exact clock hours.

Story points represent a combination of:

- Complexity.
- Effort.
- Uncertainty.
- Technical difficulty.

A common Fibonacci-like scale is:

```text
1 → 2 → 3 → 5 → 8 → 13
```

### Planning Poker

Planning poker is a collaborative estimation technique.

The general process is:

1. The team reviews the story.
2. Each member selects an estimate.
3. Everyone reveals their estimate at the same time.
4. Differences are discussed.
5. The team reaches a shared understanding.
6. The story receives a final estimate.

The most valuable part is not obtaining a mathematically exact number.

The real value is the **discussion about different assumptions and interpretations**.

### Large Stories

A story estimated at **8 or more points** should be examined carefully.

If it is too large or uncertain, the team should consider splitting it into smaller stories before committing it to the sprint.

### Velocity

Velocity represents the amount of story points the team typically completes per sprint.

Velocity can help forecast future work.

It should not be treated as a target that encourages the team to artificially increase estimates.

---

# 3. Untangle Cross-Service Dependencies

Distributed systems frequently contain dependencies between services and teams.

For example:

```text
Orders Service
      │
      │ GET /stock
      ↓
Inventory Service
```

The Orders service may depend on an endpoint provided by Inventory.

If the dependency is not planned, one team may become blocked while waiting for another team.

### Dependency Deadlock

A common problem occurs when two services wait for each other's implementation:

```text
Service A
   ↓
Waiting for Service B

Service B
   ↓
Waiting for Service A
```

This creates a development deadlock.

### Contract-First Solution

The dependency can be handled by defining the contract before the implementations are completed.

```text
Agree API Contract
       ↓
Create Mock / Stub
       ↓
Service A develops against mock
       +
Service B develops implementation
       ↓
Integration
```

This allows teams to continue working without requiring the dependent service to be completely finished.

---

# 4. Commit Realistically

The team should commit only to the amount of work that can realistically be completed during the sprint.

The commitment should be based on:

- Historical velocity.
- Sprint goal.
- Story priority.
- Available capacity.
- Known dependencies.
- Technical uncertainty.

The team should first commit to the **Must** stories required to achieve the sprint goal.

Additional **Should** and **Could** stories can remain in the backlog if capacity is not available.

```text
Sprint Capacity
      ↓
Must Stories
      ↓
Sprint Goal
      ↓
Buffer for uncertainty
      ↓
Should / Could remain in backlog
```

A smaller completed increment is preferable to a larger set of partially completed stories.

---

# 5. A Path You Will Face in Real Life

## Scenario — Optimism and a Hidden Dependency

Imagine that a team commits to **40 story points**, even though its historical velocity has never exceeded **25 points**.

The team also assumes that the Payments service will provide a webhook during the sprint.

On Day 4, the webhook is still unavailable.

As a result:

- Several stories become blocked.
- Integration cannot be completed.
- The sprint goal is put at risk.
- The team has overcommitted.

### Recommended Solution

The team should:

1. Commit closer to its real velocity.
2. Define the Payments contract before implementation is complete.
3. Create a mock or stub for the dependency.
4. Continue development against the agreed contract.
5. Assign an owner to the dependency.
6. Track the dependency as explicit work.
7. Define a due date.
8. Keep the sprint goal as the main planning reference.

Planning should be based on evidence and known capacity rather than assumptions.

---

# 6. Common Mistakes

The following mistakes can negatively affect sprint planning:

- Estimating work in hours and treating those estimates as commitments.
- Ignoring cross-service dependencies until they block development.
- Committing substantially more work than the team's historical velocity.
- Creating a feature list without representing the complete user journey.
- Failing to define contracts before dependent services are implemented.
- Not using mocks or stubs when a service dependency is unavailable.
- Treating story points as individual performance measurements.
- Adding too many stories without protecting the sprint goal.

---

# 7. Self-Check

### Question 1

**How should a story map organize the work?**

**Answer:** According to the user journey, with the main activities forming the backbone, priorities organized vertically, and a release line defining the usable increment.

### Question 2

**What do story points estimate?**

**Answer:** Relative size, complexity, effort, and uncertainty rather than exact clock hours.

### Question 3

**What should happen to a story estimated at 13 or more points?**

**Answer:** It should be reviewed and preferably split into smaller stories before committing it to the sprint.

### Question 4

**How can two services waiting for each other's endpoints avoid a development deadlock?**

**Answer:** Agree on the contract first and use a mock or stub while the actual implementation is being developed.

### Question 5

**How much work should a team commit to during a sprint?**

**Answer:** An amount around its real velocity that supports the sprint goal.

### Question 6

**What is the main value of planning poker?**

**Answer:** The discussion of different estimates and assumptions, which creates shared understanding among team members.

---

# 8. Conclusions

- Story mapping provides a complete view of the user's journey and helps define a coherent MVP.
- A release line identifies the smallest end-to-end slice that can provide a usable increment.
- Story points measure relative complexity, effort, and uncertainty rather than exact hours.
- Planning poker promotes discussion and shared understanding among team members.
- Large stories should be analyzed and split before being committed to a sprint.
- Cross-service dependencies must be identified and sequenced before they become blockers.
- Contract-first development and mocks allow teams to work in parallel.
- Sprint commitments should be based on realistic velocity and the sprint goal.
- Overcommitting can result in incomplete stories and a failed sprint objective.
- A smaller completed increment is generally more useful than a larger collection of unfinished work.

---

# 9. This Week

Build a **story map** of the product, estimate the **MVP 2 stories** using **planning poker**, identify and sequence the **cross-service dependencies**, define **contracts and mocks** where necessary, and commit to a realistic **MVP 2 scope** based on the team's historical velocity and the sprint goal.

The goal is to ensure that the team focuses on a small, achievable, and integrated increment that can be completed within the sprint.

---

**Distributed Systems · Week 8 · Session 2 · Planning — Story Mapping, Estimation and MVP 2 Commitment**  
**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**