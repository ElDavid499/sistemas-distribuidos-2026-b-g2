# Distributed Systems — Week 8 · Session 1
## Agile & DevOps for Distributed Teams

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 2 · Weekly · Corte 2**

---

## Introduction

A distributed system is built by a team that must itself work like a well-run distributed system: with clear ownership, small batches, and fast feedback.

This session focuses on the Scrum practices used throughout the semester, DevOps culture, coordination in distributed teams, and flow metrics that help the team continuously improve its delivery process.

The main objective is to understand how Agile and DevOps practices support the development and integration of distributed systems.

### Learning Objectives

By the end of this session, students should be able to:

1. Run the Scrum cycle, including backlog management, sprints, and ceremonies.
2. Write good user stories with testable acceptance criteria.
3. Apply DevOps culture through shared responsibility for development and operations.
4. Use flow metrics such as WIP, lead time, cycle time, and throughput to improve delivery.

---

# 1. Scrum in One Picture

Scrum organizes work through a continuous cycle.

Work flows from a prioritized **Product Backlog** into a **Sprint Backlog**, where selected work is developed during a fixed sprint.

At the end of the sprint, the team reviews the working increment and performs a retrospective to identify improvements for the next sprint.

### Scrum Roles

- **Product Owner:** Defines what should be built and prioritizes the backlog.
- **Scrum Master:** Facilitates the Scrum process and helps remove impediments.
- **Development Team:** Determines how the work is implemented and delivers the increment.

### Scrum Cycle

```text
Product Backlog
      ↓
Sprint Planning
      ↓
Sprint Backlog
      ↓
Development Sprint
      ↓
Working Increment
      ↓
Sprint Review
      ↓
Retrospective
      ↓
Process Improvement
```

The retrospective is especially important because it focuses on improving the team's way of working in the next sprint.

---

# 2. A Good User Story

A user story describes a requirement from the perspective of the person or system that needs the functionality.

The standard format is:

> **As a [role], I want [action], so that [benefit].**

A good user story must also contain **testable acceptance criteria**.

Acceptance criteria should allow the team to determine objectively whether the story has been completed.

### Example

```text
HU-021
As a customer, I want to place an order for an in-stock item,
so that I can buy it.

AC1 (testable):
POST /orders with an in-stock item returns 201 + orderId.

AC2 (testable):
If the item is out of stock, the API returns 409 OUT_OF_STOCK.

AC3 (testable):
The order is persisted and can be retrieved using
GET /orders/{id}.
```

### Important Characteristics

A user story should:

- Have a clear user or system role.
- Describe a specific action.
- Explain the expected benefit.
- Include testable acceptance criteria.
- Be small enough to complete within the sprint.
- Be split if it is too large.
- Be prioritized using an agreed method such as MoSCoW.
- Be estimated using story points.

A story without testable acceptance criteria is not sufficiently defined to be considered ready for implementation.

---

# 3. DevOps: You Build It, You Run It

**DevOps** reduces the separation between development and operations.

The team responsible for building a service also participates in running and maintaining it.

This involves:

- Automated CI/CD.
- Monitoring.
- Operational responsibility.
- Frequent releases.
- Automation of repetitive tasks.
- Fast feedback.
- Learning from failures without assigning blame.

### DevOps Culture

The important part of DevOps is not simply the tools. It is the culture of shared responsibility.

```text
Plan
  ↓
Code
  ↓
Build
  ↓
Test
  ↓
Release
  ↓
Deploy
  ↓
Monitor
  ↓
Feedback
  ↺
```

The objective is to create a continuous delivery and feedback loop.

---

# 4. Coordinating a Distributed Team

A distributed development team should operate with practices similar to those used to coordinate distributed services.

### Clear Ownership

Each service and repository should have clearly defined responsibilities.

A **RACI** model can help define who is:

- Responsible.
- Accountable.
- Consulted.
- Informed.

### Small Batches

Work should be delivered in small increments through:

- Short-lived branches.
- Frequent commits.
- Frequent pull requests.
- Small user stories.

### Fast Feedback

CI should run for every relevant pull request so that problems are detected as early as possible.

### Asynchronous Communication

Important decisions should be documented instead of remaining only in conversations.

Examples include:

- ADRs.
- Pull request descriptions.
- Backlog items.
- Project boards.
- Technical documentation.

This reduces the risk of one team member becoming a blocker because they are the only person who knows something.

---

# 5. Flow Metrics That Actually Help

The objective of flow metrics is to measure how efficiently work moves through the system rather than measuring how busy people appear to be.

### Work in Progress (WIP)

WIP represents the amount of work currently being started but not yet finished.

A WIP limit helps the team finish existing work before starting additional work.

### Lead Time

Lead time measures the time between the initial request or idea and its completion.

```text
Idea
 ↓
Backlog
 ↓
Development
 ↓
Review
 ↓
Done
```

### Cycle Time

Cycle time measures how long an item takes once active development begins until it is completed.

### Throughput

Throughput represents the amount of work completed during a specific period, such as stories completed per sprint.

### Important Signal

```text
High WIP
+
Low Throughput
=
Many things started but few things finished
```

This indicates that the team should focus on finishing work instead of starting more tasks.

---

# 6. A Path You Will Face in Real Life

## Scenario — The Hero and the Bottleneck

Imagine that one teammate takes eight stories because they believe they can complete the sprint faster.

At the end of the sprint:

- Several stories are only partially completed.
- Other team members cannot easily contribute to that code.
- Knowledge becomes concentrated in one person.
- The team has difficulty integrating the work.

### Recommended Practices

The situation can be improved by:

1. Establishing a WIP limit.
2. Pairing on risky or complex tasks.
3. Requiring pull requests.
4. Sharing knowledge across the team.
5. Splitting large stories into smaller increments.
6. Prioritizing finished work over excessive parallel work.

Sustainable flow is more important than relying on individual heroics.

---

# 7. Common Mistakes

The following mistakes can negatively affect a distributed team's delivery process:

- Writing stories without testable acceptance criteria.
- Starting too many tasks without a WIP limit.
- Leaving operations to a separate team.
- Failing to automate repetitive processes.
- Keeping technical decisions only in one person's knowledge.
- Not documenting decisions through ADRs or pull requests.
- Focusing on individual busyness instead of completed work.
- Creating stories that are too large to finish during the sprint.

---

# 8. Self-Check

### Question 1

**What is the main purpose of a retrospective?**

**Answer:** Improve the process for the next sprint.

### Question 2

**When is a user story ready to be worked on?**

**Answer:** When it has testable acceptance criteria and fits within the sprint.

### Question 3

**What does DevOps culture mean?**

**Answer:** The team that builds a service also participates in running it, using automation, monitoring, and continuous feedback.

### Question 4

**Why does a WIP limit exist?**

**Answer:** To encourage finishing existing work before starting more work and therefore improve flow.

### Question 5

**What indicates that everyone is busy but little is being delivered?**

**Answer:** High WIP combined with low throughput.

### Question 6

**How can a situation where one person takes eight stories and half-finishes them be improved?**

**Answer:** Use WIP limits, pairing, pull requests, knowledge sharing, and smaller stories.

---

# 9. Conclusions

- Scrum provides a structured cycle for planning, developing, reviewing, and improving work.
- Good user stories require clear objectives and testable acceptance criteria.
- Large stories should be divided into smaller increments that can realistically be completed during a sprint.
- DevOps promotes shared responsibility between development and operations.
- CI/CD, monitoring, and automation provide faster feedback and more reliable delivery.
- Distributed teams need clear ownership, small batches, frequent pull requests, and documented decisions.
- WIP, lead time, cycle time, and throughput help the team understand and improve its delivery flow.
- Finishing work is more valuable than starting many tasks simultaneously.
- Knowledge sharing through PRs, ADRs, and collaboration reduces dependency on individual team members.

---

# 10. This Week

Run the sprint using a prioritized backlog with **testable user stories**, establish a clear **WIP limit**, use **pull requests for every change**, maintain a **daily synchronization process**, and track **throughput** to monitor the team's delivery flow.

The goal is to improve collaboration, reduce unfinished work, promote shared ownership, and maintain a continuous feedback loop throughout the sprint.

---

**Distributed Systems · Week 8 · Session 1 · Agile & DevOps for Distributed Teams**  
**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**