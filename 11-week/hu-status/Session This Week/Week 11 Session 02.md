# Distributed Systems — Week 11 — Session 02
## Planning: SLIs, SLOs, Error Budgets and Alerting

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Planning · Corte 3

## Introduction

Observability data becomes useful when a team defines what a healthy system means and what actions to take when reliability decreases.

This session covers Service Level Indicators (SLIs), Service Level Objectives (SLOs), error budgets, symptom-based alerting, and runbooks for responding to incidents.

## Learning Objectives

1. Define SLIs and SLOs for a software product.
2. Use an error budget to balance reliability and delivery speed.
3. Design alerts based on user-facing symptoms.
4. Write a runbook for a likely production incident.

## 1. SLI, SLO and Error Budget

### Service Level Indicator (SLI)

An SLI is a measurable indicator of service performance or reliability.

Examples:
- Percentage of successful requests.
- Percentage of requests completed within 300 milliseconds.
- Percentage of appointment records available within an expected time.

### Service Level Objective (SLO)

An SLO defines the target for an SLI over a specified measurement window.

Example: 99.5% of requests must succeed over a rolling 30-day period.

### Error Budget

The error budget represents the unreliability allowed by the SLO.

If the availability SLO is 99.5%, the error budget is 0.5% of requests during the measurement window.

Teams can use this budget to make informed decisions about releasing features. If the budget is exhausted, the team should prioritize reliability improvements and stabilization.

## 2. Choose SLOs Users Actually Feel

SLOs should reflect the experience of real users instead of focusing on metrics that have little practical meaning.

For Salud Activa / GestionTurnosApp, potential SLOs include:

- **Availability:** A defined percentage of appointment requests complete successfully.
- **Latency:** A defined percentage of appointment queries complete within an agreed response time, measured using p95 or p99 latency.
- **Freshness:** Appointment or read-model data becomes available within an agreed time after an update.

These are proposed examples, not verified production targets. The team should choose realistic thresholds based on system requirements and measured performance.

Every SLO should specify its indicator, target, measurement window, and data source.

## 3. Alert on Symptoms, with a Policy

Alerts should focus on problems users experience, such as:

- An increasing request error rate.
- High p99 latency.
- A rapid consumption of the error budget.
- Delayed updates in asynchronous workflows.

Every alert should define:

1. **Trigger:** The condition that activates the alert.
2. **Severity:** The urgency and potential impact.
3. **Owner:** The person or team responsible for responding.
4. **Runbook:** The instructions for investigating and mitigating the incident.

Alerting on every CPU fluctuation or isolated error can create alert fatigue. Excessive low-value notifications make it more likely that the team will miss a serious incident.

## 4. Runbooks Turn Panic into a Checklist

A **runbook** is a short operational guide for handling a specific incident.

A useful runbook includes:

- Symptoms and potential impact.
- Steps to confirm the problem.
- Diagnostic commands, dashboards, or logs to inspect.
- Initial mitigation actions, such as disabling a feature flag or scaling a service when appropriate.
- Escalation instructions and responsible contacts.
- Recovery checks to confirm the service has returned to its expected state.

Runbooks make incident response more consistent and reduce dependence on one person's knowledge.

## 5. A Real-World Scenario

Imagine the team receives dozens of alerts every night because monitoring triggers whenever CPU usage exceeds 70% or any request returns an HTTP 500 response.

Eventually, a serious outage causes the appointment service's error rate to reach 40%, but the team overlooks it among the other notifications.

A better approach is to:

1. Remove unnecessary alerts that do not indicate meaningful user impact.
2. Alert on sustained error-rate increases, high latency, and rapid SLO error-budget consumption.
3. Assign each alert a severity and an owner.
4. Attach a relevant runbook.
5. Verify recovery using the same indicators that detected the incident.

Fewer, actionable alerts help the team respond to real problems.

## 6. Common Mistakes

- Defining SLOs that do not reflect user experience.
- Monitoring only infrastructure metrics.
- Creating alerts without owners or runbooks.
- Sending too many low-value notifications.
- Failing to define an error-budget policy.
- Choosing targets without measuring actual system behavior.

## Self-Check

1. What is an SLO?  
   **Answer:** A target for an SLI over a defined measurement window.

2. What is an error budget?  
   **Answer:** The allowed unreliability implied by the SLO.

3. What should alerts primarily detect?  
   **Answer:** User-facing symptoms such as high error rates, latency, and rapid error-budget consumption.

4. What should every alert include?  
   **Answer:** A trigger, severity, owner, and runbook.

5. What is a runbook?  
   **Answer:** A checklist for confirming, mitigating, escalating, and verifying recovery from an incident.

6. What is the risk of excessive low-value alerts?  
   **Answer:** Alert fatigue, which can cause real incidents to be missed.

## This Week

Define two or three proposed SLOs for Salud Activa / GestionTurnosApp, covering availability, latency, and—if applicable—data freshness. Specify each target and measurement window.

Document an error-budget policy, design at least one symptom-based alert with a clear owner and runbook, and prepare a runbook for a likely incident. Break the work into observable, testable user stories and record evidence of implementation or validation.

---

**Distributed Systems · Week 11 · Session 02 · Planning — SLIs, SLOs, Error Budgets and Alerting**  
Systems Engineering · CORHUILA · 2026-B