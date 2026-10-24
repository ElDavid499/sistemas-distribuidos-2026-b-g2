# CP9: Slow-Auth Incident Drill and Blameless Postmortem

## Evidence boundary and required scenario

This is a **documentary simulation** of the required CP9 scenario: the downstream dependency `auth-service` takes approximately 3 seconds to answer 25% of reservation requests during a 40-minute degradation. No delay was injected, no live alert fired, and no real incident or recovery is claimed. IDs, timestamps, trace spans, and logs below are synthetic and follow the CP1/CP2 formats.

## Trace of one slow request

Assume the patient-facing booking request is accepted quickly and its saga executes asynchronously. The outbound Auth call completes just before the configured 3,000-ms client deadline; the rounded incident duration is 3 seconds. If the actual call reaches or exceeds the deadline, it is recorded as an error and still counts as a bad SLO event. The measured dependency SLO boundary is 1 second.

```text
trace_id=4bf92f3577b34da6a3ce929d0e0e4736
api-gateway POST /api/turnos (SERVER)                         48 ms
└─ appointments-service POST /api/turnos (SERVER)             32 ms
   ├─ MongoDB save Turno + outbox (CLIENT)                    18 ms
   └─ RabbitMQ publish appointment.requested.v1 (PRODUCER)    4 ms
      └─ appointments.saga.process (CONSUMER)               3,040 ms
         └─ auth-service POST /internal/reservations (CLIENT)3,000 ms
            └─ auth-service reservation handler (SERVER)    2,995 ms
               └─ MongoDB reservation lookup/write (CLIENT)    5 ms
```

The consumer span starts after the HTTP response; it shares the trace ID via the outbox `traceparent` and is not nested in the elapsed time of the original 48-ms HTTP span. Span export/search requires a configured OTLP collector, which is absent from Compose.

## Four synthetic JSON logs for the trace

These are examples in the CP2 contract, not captured application output. Fields such as `appointment.saga.started` and the detailed dependency event are illustrative; the current code records HTTP completion and key accepted/processed domain events, but not every line below as structured JSON yet.

```json
{"timestamp":"2026-10-22T19:05:02.020Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"507f1f77bcf86cd799439011","event":"http.request.completed","message":"POST /api/turnos completed","duration_ms":48,"status_code":202}
{"timestamp":"2026-10-22T19:05:02.025Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"01a088bb1ca903c8","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.request.accepted","message":"Appointment and request event persisted","duration_ms":18,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"accepted"}
{"timestamp":"2026-10-22T19:05:02.100Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"05e122ff5ae307ac","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.saga.started","message":"Processing appointment.requested.v1","duration_ms":null,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"started"}
{"timestamp":"2026-10-22T19:05:05.105Z","level":"WARN","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"06a233aa6bc408bd","correlation_id":"507f1f77bcf86cd799439011","event":"auth.reservation.slow","message":"Auth reservation completed above the 1-second SLO threshold","duration_ms":3000,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"success"}
```

No patient name, user identifier, token, date of appointment, or request body is included.

## SLI values and first alert

Assumptions for arithmetic: 10 Auth reservation attempts/minute, exactly 25% take 3 seconds, all slow responses still succeed before the client deadline, the rest finish in <=1 second, traffic is stationary during the hypothetical 40-minute degradation, Prometheus scrapes continuously, and no alert evaluation delay occurs.

- **Booking availability SLO 1:** HTTP bookings continue to return 202, so the booking endpoint 5xx ratio remains approximately 0%; this SLI does not detect slow asynchronous completion.
- **Booking latency SLO 2:** the original HTTP request finishes in 48 ms in this synthetic trace, below 300 ms. The 25% slow Auth calls do not change that synchronous HTTP duration.
- **Auth reservation SLO 3:** the good ratio is 75% (the 25% taking 3 seconds fail the <=1-second objective), versus the 99% target. Bad ratio is 25%; burn rate is `25% / 1% = 25x`.

The first firing rule is **`AuthReservationFastBurn`**:

1. At 10 attempts/minute, the 50-attempt one-hour minimum is reached at about T+5 minutes. The five-minute window already has at least 10 attempts.
2. Both the 5-minute and 1-hour bad ratios are about 25%, above the 14.4% threshold (`14.4 * 1%`).
3. The rule requires the condition to remain true for 5 minutes, so the expected page is around **T+10 minutes**.

`AuthReservationSustainedBurn` needs at least 200 attempts in six hours (about T+20 minutes at this assumed rate), then 30 minutes continuously above its multi-window threshold. With the 40-minute fault and a rolling 30-minute window, it would be expected around **T+50 minutes**, after the modeled degradation ends, assuming the 30-minute window remains above threshold until then. The fast alert is therefore first.

## Mitigation and impact calculation

The runbook first checks Auth readiness and the bounded dependency histogram. For this scenario, add the explicit root-cause assumption that an unhealthy Auth worker is causing the slow responses. If confirmed, the local action is `docker compose restart auth-service`; it is a documented local Compose mitigation, not a proven fix for every latency cause. In this simulated response, the responder pages at T+10, verifies the unhealthy Auth service, and restarts it at T+12. The underlying no-action scenario lasts 40 minutes, but user-visible slow-call exposure stops at T+12 if the restart restores normal latency. That recovery outcome is hypothetical.

At 10 attempts/minute:

- **No mitigation for all 40 minutes:** `10 * 40 = 400` attempts; `25% * 400 = 100` attempts exceed 1 second. With the illustrative 3,000 monthly attempts, the SLO-3 budget is 30 bad attempts, so this consumes `100 / 30 = 333%` of that example budget.
- **Mitigation at T+12:** `10 * 12 = 120` attempts; approximately 30 are slow, consuming 100% of the illustrative monthly SLO-3 request budget.
- If expressing those counts as full-bad-event-equivalent minutes at the assumed uniform 100 requests/day: 30 bad attempts correspond to 432 equivalent minutes; 100 correspond to 1,440 equivalent minutes. These are request-count conversions only, **not downtime**; the partial 25% slow rate is not a 100% outage.

## Blameless postmortem (simulated)

| Time | Simulated event |
|---|---|
| T+0 | Auth worker becomes unhealthy; 25% of reservation calls begin taking 3 seconds |
| T+0–5m | Booking API continues returning 202; Auth dependency histogram records slow successful calls |
| About T+5m | Fast-rule traffic floor and both burn windows are satisfied |
| About T+10m | `AuthReservationFastBurn` fires after its 5-minute confirmation |
| About T+10–12m | Responder checks trace/log context and Auth readiness; service owner is engaged |
| About T+12m | Responder restarts only the unhealthy local `auth-service` container |
| After T+12m | If the worker recovers, new reservation latency falls below 1 second; otherwise escalate and preserve evidence |
| About T+50m | Sustained rule could fire under the no-mitigation/continued-window assumptions; it is later than the fast rule |

- **Impact:** no-action counterfactual: 100 slow reservation attempts in 40 minutes at the assumed volume. Simulated response at T+12 limits impact to about 30 slow attempts. No real patients or requests are asserted.
- **Root cause:** assumed unhealthy Auth worker; no real root cause was investigated.
- **Contributing factors:** HTTP acceptance SLO alone stays green; no production traffic baseline; no central trace viewer without OTLP; the alert notification path is not configured.
- **What helped:** the third SLO measures the asynchronous Auth dependency separately; minimum traffic guards prevent single-request pages.

### Follow-up actions (user stories with testable acceptance criteria)

1. **As a patient, I want reservation latency to be visible so slow confirmations are detected.** Acceptance: Given a test Auth responder takes approximately 3 seconds, when a reservation call runs, then the dependency histogram records `dependency="auth-service"`, `operation="reserve"`, `outcome="success"` and its duration falls above the 1-second bucket.
2. **As the on-call backend responder, I want the fast-burn rule tested before rollout.** Acceptance: Given at least 10 test attempts in 5 minutes and 50 in 1 hour, with more than 14.4% exceeding 1 second in both windows, when the condition persists for five minutes, then the rule test reports `AuthReservationFastBurn` firing and its annotation links to the Auth runbook.
3. **As a patient, I want accepted bookings to reach a visible terminal state.** Acceptance: Given an outbox event remains unpublished for more than 60 seconds, when the pending-age metric and alert are implemented, then a test asserts the alert fires and the runbook explains how to restore RabbitMQ and verify saga completion.

These are proposed follow-up stories, not changes already implemented or tests already executed.
