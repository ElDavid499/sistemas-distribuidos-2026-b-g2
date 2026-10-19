# Distributed Systems — Week 11 — Session 01
## Observability: Logs, Metrics and Distributed Tracing

**CORHUILA**  
Systems Engineering · 2026-B  
Unit 3 · Weekly · Corte 3

## Introduction

When a request passes through several services, checking individual logs is not enough to understand what went wrong. Observability combines structured logs, metrics, and distributed traces to help teams understand system behavior, investigate failures, and identify performance bottlenecks.

## Learning Objectives

1. Distinguish the three pillars of observability: logs, metrics, and traces.
2. Correlate requests across services using trace or correlation IDs.
3. Monitor the golden signals and configure useful alerts.
4. Instrument a service to improve observability.

## 1. Monitoring vs. Observability

**Monitoring** tracks predefined conditions, such as CPU usage, uptime, or error rates.

**Observability** helps engineers investigate unexpected behavior and answer questions that were not anticipated when the system was designed.

In distributed systems, observability is essential because a single request may depend on multiple services.

## 2. The Three Pillars

### Logs

Logs record events that occur inside a service. Structured JSON logs include fields such as timestamp, severity, service name, message, and `trace_id`.

### Metrics

Metrics are numerical measurements collected over time. Examples include request rates, error rates, response latency, memory usage, and resource saturation.

### Distributed Traces

Traces follow a request as it travels through multiple services. Each individual operation is represented by a **span**, which records timing and contextual information.

Together, these three pillars help teams identify what happened, how frequently it happens, and where a request encountered a problem.

## 3. Follow One Request: Distributed Tracing

A trace ID should be generated at the system entry point and propagated through request headers or the appropriate tracing context.

For example:

`Client → API Gateway → Appointment Service → Identity Service → Database`

Each service contributes spans to the same trace. Engineers can inspect these spans to determine which operation caused a delay or failure.

Without trace propagation, connecting logs from different services becomes difficult and time-consuming.

## 4. Structured Logs and the Golden Signals

Structured logs make events searchable and easier to aggregate using tools such as ELK or Loki.

Example:

```go
log.Info("order created",
    "trace_id", ctx.Value("trace_id"),
    "service", "orders",
    "order_id", id,
    "amount_cents", 1990,
)
```

The **golden signals** are:

- **Latency:** How long requests take to complete.
- **Traffic:** How many requests the system receives.
- **Errors:** How many requests fail.
- **Saturation:** How close the system is to exhausting its resources.

Alerts should prioritize symptoms that affect users, such as rising error rates or high p99 latency, rather than triggering on every minor resource fluctuation.

## 5. A Real-World Scenario

Imagine users report that checkout is slow.

1. A dashboard shows that p99 latency has increased.
2. A distributed trace reveals that most of the delay occurs between the payment and fraud-detection services.
3. Structured logs associated with the same `trace_id` reveal repeated retries against a dependency that is timing out.
4. The team identifies the cause and applies an appropriate mitigation.

Observability reduces troubleshooting time by connecting metrics, traces, and logs.

## 6. Common Mistakes

- Using unstructured console output that is difficult to search.
- Failing to propagate trace or correlation IDs.
- Alerting on isolated causes instead of user-facing symptoms.
- Creating dashboards that nobody reviews.
- Generating excessive alerts that lead to alert fatigue.

## Self-Check

1. What are the three pillars of observability?  
   **Answer:** Logs, metrics, and traces.

2. What does a distributed trace follow?  
   **Answer:** A single request across services through timed spans.

3. How should a correlation or trace ID be used?  
   **Answer:** Generate it at the system entry point and propagate it across services.

4. What makes logs useful at scale?  
   **Answer:** Structured fields, preferably in JSON, including the trace ID.

5. What are the golden signals?  
   **Answer:** Latency, traffic, errors, and saturation.

6. How can engineers locate a slow cross-service request?  
   **Answer:** Inspect its distributed trace and identify the slow span.

## This Week

Instrument the services in Salud Activa / GestionTurnosApp with structured logs and a propagated `trace_id`. Collect basic request-rate, error-rate, and latency metrics, and demonstrate at least one trace across a multi-service request where the architecture supports it.

Document the instrumentation and identify the most important performance and reliability symptoms to monitor.

---

**Distributed Systems · Week 11 · Session 01 · Observability — Logs, Metrics and Distributed Tracing**  
Systems Engineering · CORHUILA · 2026-B