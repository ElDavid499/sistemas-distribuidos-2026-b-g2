# CP2: Structured Log Contract

## JSON record

The backend writes one JSON object per line to standard output. `backend/observability/logger.js` supplies the shared fields; the HTTP middleware adds a completion record and the appointment/saga code adds domain events.

| Field | Type | Requirement | Example | Notes |
|---|---|---|---|---|
| `timestamp` | string | Required | `2026-10-22T19:05:02.125Z` | ISO-8601 UTC |
| `level` | string | Required | `INFO` | `ERROR`, `WARN`, `INFO`, or `DEBUG` |
| `service` | string | Required | `appointments-service` | Runtime service name |
| `version` | string | Required | `2.0.0` | Backend package version |
| `environment` | string | Required | `development` | `NODE_ENV`; use an explicit deployment value |
| `trace_id` | string or null | Required | `4bf92f3577b34da6a3ce929d0e0e4736` | W3C trace ID from the active OpenTelemetry span |
| `span_id` | string or null | Required | `00f067aa0ba902b7` | W3C span ID from the active OpenTelemetry span |
| `correlation_id` | string or null | Required | `507f1f77bcf86cd799439011` | Stable business correlation key; null before one exists |
| `event` | string | Required | `appointment.request.accepted` | Stable, machine-readable event name |
| `message` | string | Required | `Appointment request persisted to the outbox` | Short description; no payload data |
| `duration_ms` | number or null | Required | `42` | Measured elapsed time; null if that event has no duration measurement |
| `status_code` | integer | For HTTP completion | `202` | HTTP response status |
| `appointment_id` | string | When known | `507f1f77bcf86cd799439011` | Opaque domain key, not a user identifier |
| `event_id` | string | For an event | `507f...:appointment.requested.v1` | Outbox/event identity |
| `correlation_id` | string | For a booking operation | `507f1f77bcf86cd799439011` | The appointment ID for this journey |
| `outcome` | string | When applicable | `accepted` | Bounded outcome such as `accepted` or `processed` |

The shared logger emits the mandatory keys on every record. `trace_id` and `span_id` are `null` if no valid active span exists; identifiers are never fabricated by the logger. `duration_ms` is null when the event has no duration measurement.

## Severity

- **ERROR**: a server-side operation failed or returned 5xx; e.g. `auth.reservation.timeout`.
- **WARN**: noteworthy degradation or business outcome; e.g. `appointment.reservation.rejected` for an occupied slot.
- **INFO**: normal request completion or state transition; e.g. `appointment.request.accepted`.
- **DEBUG**: temporary, non-sensitive diagnostic detail; e.g. a retry attempt number without payload or patient data. Disabled by default in production.

## Excluded data

Never log authorization headers, JWTs, passwords, service tokens, request/response bodies, full names, email addresses, phone numbers, patient/user IDs, diagnoses, prescriptions, allergy data, appointment reason, or raw date/time selection. Do not include arbitrary exception messages from user-controlled input. Keep trace and domain IDs out of metrics labels. The logger allowlists the domain fields it accepts and does not serialize request objects.

## Seven example records for one booking trace

These are **synthetic examples**, not captured output or evidence of a live incident. They show one asynchronous booking whose Auth reservation first times out and, on retry, is rejected because the reservation conflicts with an existing slot. Every line has the same trace ID and a monotonically increasing timestamp.

```json
{"timestamp":"2026-10-22T19:05:02.020Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":null,"event":"http.request.completed","message":"POST /api/turnos completed","duration_ms":48,"status_code":202}
{"timestamp":"2026-10-22T19:05:02.025Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"01a088bb1ca903c8","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.request.accepted","message":"Appointment and request event persisted","duration_ms":18,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"accepted"}
{"timestamp":"2026-10-22T19:05:02.100Z","level":"INFO","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"05e122ff5ae307ac","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.saga.started","message":"Processing appointment.requested.v1","duration_ms":null,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"started"}
{"timestamp":"2026-10-22T19:05:05.105Z","level":"ERROR","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"06a233aa6bc408bd","correlation_id":"507f1f77bcf86cd799439011","event":"auth.reservation.timeout","message":"Auth reservation request exceeded its 3000 ms deadline","duration_ms":3000,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"retry"}
{"timestamp":"2026-10-22T19:05:06.110Z","level":"WARN","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"05e122ff5ae307ac","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.saga.retry","message":"Retrying the pending appointment event","duration_ms":1000,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"retry"}
{"timestamp":"2026-10-22T19:05:07.115Z","level":"WARN","service":"auth-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"07b344bb7cd509ce","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.reservation.rejected","message":"Reservation conflicts with an existing slot","duration_ms":4,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.requested.v1","outcome":"business_rejection"}
{"timestamp":"2026-10-22T19:05:07.130Z","level":"WARN","service":"appointments-service","version":"2.0.0","environment":"development","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"05e122ff5ae307ac","correlation_id":"507f1f77bcf86cd799439011","event":"appointment.saga.compensated","message":"Appointment was rejected and transitioned to Cancelado","duration_ms":8,"appointment_id":"507f1f77bcf86cd799439011","event_id":"507f1f77bcf86cd799439011:appointment.cancelled.v1","outcome":"compensated"}
```

Filtering by this `trace_id` shows the synchronous acceptance, asynchronous processing, a 3-second downstream timeout, retry, business rejection, and compensation. The records are examples of the contract; the current runtime does not emit every illustrated event yet. A missing real consumer record, trace continuity break, or unexpected delay directs investigation toward the outbox, RabbitMQ, or Auth call.
