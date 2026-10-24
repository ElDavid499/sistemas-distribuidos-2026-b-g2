# CP6: SLIs, SLOs, and Error Budget

These are proposed objectives for the real booking journey, not a production SLA. The repository documents an NFR of 99.9% monthly availability and P95 below 300 ms for critical endpoints under a 100-RPS load test. There is no production traffic history or executed benchmark distribution. The Appointments Service now also records the duration and bounded outcome of each outbound Auth reservation call.

## Scope, window, and traffic basis

Use rolling 30-day windows for all three request-based SLIs. Availability and HTTP latency measure `POST /api/turnos` at the Appointments Service boundary. The third SLO measures each `POST /internal/reservations` dependency attempt from Appointments to Auth; it complements the synchronous acceptance SLOs because saga confirmation is asynchronous relative to the patient.

No observed traffic baseline exists. For arithmetic only, assume 100 accepted appointment requests/day, or 3,000/month. For the Auth dependency calculation, assume one reservation attempt per accepted booking (no retries). This is a planning scenario, not measured traffic; actual retry volume can increase the dependency-attempt denominator.

## SLO 1 — Booking API availability

- **Target:** at least 99.9% successful HTTP responses in 30 days.
- **Valid event:** completed `POST /api/turnos` request.
- **Good event:** status below 500. Client/business rejections do not count as service failures.
- **Bad event:** status 500–599.
- **SLI formula:** good booking responses / all booking responses.

```promql
1 -
(
  sum(increase(salud_activa_http_requests_total{
    service="appointments-service", method="POST", route="/api/turnos", status_code=~"5.."
  }[30d]))
  /
  sum(increase(salud_activa_http_requests_total{
    service="appointments-service", method="POST", route="/api/turnos"
  }[30d]))
)
```

## SLO 2 — Booking API latency

- **Target:** at least 95% of Appointments booking responses finish under 300 ms over 30 days.
- **Valid event:** completed `POST /api/turnos` request with a recorded HTTP duration.
- **Good event:** request duration is at or below 300 ms.
- **SLI formula:** booking requests in the `le="0.3"` histogram bucket / all booking requests.

```promql
sum(increase(salud_activa_http_request_duration_seconds_bucket{
  service="appointments-service", method="POST", route="/api/turnos", le="0.3"
}[30d]))
/
sum(increase(salud_activa_http_request_duration_seconds_count{
  service="appointments-service", method="POST", route="/api/turnos"
}[30d]))
```

The 300-ms boundary comes from the written NFR; it has not been validated against measured patient experience.

## SLO 3 — Timely Auth reservation attempt

- **Target:** at least 99% of reservation attempts succeed and complete within 1 second over 30 days.
- **Valid event:** each outbound Auth `reserve` request measured by `appointments-service`. Retries count as separate attempts.
- **Good event:** `outcome="success"` and duration at or below 1 second.
- **Bad event:** Auth request fails, times out, or takes more than 1 second.
- **SLI formula:** successful Auth reservation durations at or below 1 second / all measured Auth reservation attempts.
- **Window:** rolling 30 days.

```promql
sum(increase(salud_activa_dependency_request_duration_seconds_bucket{
  dependency="auth-service", operation="reserve", outcome="success", le="1"
}[30d]))
/
sum(increase(salud_activa_dependency_request_duration_seconds_count{
  dependency="auth-service", operation="reserve"
}[30d]))
```

The numerator uses only successful calls within the 1-second bucket. The denominator includes both successful and failed attempts. This measures the saga's Auth dependency, not end-to-end saga completion; outbox age and terminal saga state still need dedicated metrics.

## Error-budget arithmetic

The budget is `eligible events * (1 - SLO target)`. For availability and HTTP latency, use the illustrative 3,000 booking requests/month. For SLO 3, assume 3,000 Auth reservation attempts/month (one per booking, no retries).

| SLO | Allowed bad fraction | Illustrative request budget |
|---|---:|---:|
| Booking availability 99.9% | 0.1% | `3,000 * 0.001 = 3` 5xx responses |
| Booking latency 95% | 5% | `3,000 * 0.05 = 150` responses over 300 ms |
| Auth reservation success <=1 s, 99% | 1% | `3,000 * 0.01 = 30` failed or slow attempts |

### Request-to-minute equivalence (assumption, not measured downtime)

A request-based budget is not downtime. To provide the workshop's requested minute equivalent, assume traffic is uniform across all 30 days, exactly 100 requests/day, and a complete outage in which every attempted request is bad. Average rate is `100 / 1,440 = 0.06944 requests/minute`.

- Availability's 3 bad requests correspond to `3 / 0.06944 = 43.2 minutes` of **full-outage-equivalent exposure** under those assumptions. It is not an observed downtime budget and is invalid if demand is uneven or any requests would occur during idle periods.
- The latency budget of 150 slow requests corresponds arithmetically to `150 / 0.06944 = 2,160 minutes` (36 hours) in which every request is slow. This is a count-equivalent, **not 36 hours of system downtime**.
- SLO 3's 30 failed/slow Auth attempts correspond to `432 minutes` at the same assumed one-attempt-per-booking rate. Retries change that rate and therefore invalidate the conversion.

Use the event budgets for actual operation; do not infer elapsed outage from them without validating the assumptions.

## Error-budget policy

Use each SLO's budget independently. At the assumed monthly volume:

| Consumed | Availability | HTTP latency | Auth reservation | Team response |
|---:|---:|---:|---:|---|
| 50% | 2 of 3 (integer requests exceed 50%) | 75 of 150 | 15 of 30 | Notify the team, inspect failing/slow traces and recent changes, assign a reliability owner |
| 75% | 3 of 3 (low-volume budget is already exhausted) | 113 of 150 | 23 of 30 | Pause non-essential releases; prepare mitigation and review the triggering dependency |
| 100% | 3 of 3 | 150 of 150 | 30 of 30 | Freeze feature releases, focus on recovery, and agree reliability work before resuming |

Request counts are indivisible. Recalculate from actual eligible event counts when operational telemetry exists. Prometheus retention and scraping for at least 30 days are required to evaluate these windows; they are not configured in the current Compose stack.
