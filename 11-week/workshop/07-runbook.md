# CP8: Booking and Saga Runbook

## Scope and operator safety

These commands target the repository's local Docker Compose stack. They do not assume an AWS ECS/RDS deployment. Confirm the selected Compose project and environment before stopping containers. **Do not run `docker compose down -v`** when appointment data must be preserved. Contact names and paging destinations are not present in the repository; the team must supply them.

## Alert: HTTP 5xx or fast availability burn

### Symptoms

- The proposed `AppointmentAvailabilityFastBurn` rule fires, or users receive 5xx for `POST /api/turnos`.
- Booking requests fail before the appointment and request event are persisted.
- A 409 indicates a slot conflict and is not a server error for the availability SLI.

### Diagnose

1. Check container states:

   ```sh
   docker compose ps
   ```

2. Inspect the gateway, Appointments, Auth, and database logs:

   ```sh
   docker compose logs --since 15m --tail 200 backend appointments-service auth-service mongodb rabbitmq
   ```

3. Query 5xx ratio and traffic in Prometheus **if it has been configured**:

   ```promql
   sum(rate(salud_activa_http_requests_total{service="appointments-service",method="POST",route="/api/turnos",status_code=~"5.."}[5m]))
   /
   sum(rate(salud_activa_http_requests_total{service="appointments-service",method="POST",route="/api/turnos"}[5m]))
   ```

4. Check service readiness:

   ```sh
   docker compose exec -T appointments-service node -e "fetch('http://127.0.0.1:3002/health/ready').then(async r => { console.log(r.status, await r.text()); process.exitCode = r.ok ? 0 : 1; }).catch(e => { console.error(e.message); process.exitCode = 1; })"
   ```

5. Correlate JSON log records by `trace_id`; inspect the Appointments/MongoDB or Auth spans for the failing request. The repository does not ship a trace collector or centralized log UI. With no OTLP endpoint, spans are not externally searchable.
   To search recent local container logs after copying the actual trace ID from a JSON line:

   ```powershell
   docker compose logs --since 15m --no-color appointments-service auth-service | Select-String '"trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"'
   ```

   Replace the example ID. This searches Docker stdout only; it will not find spans or trace IDs that were not emitted by the current service version.

### Mitigate

Choose the lowest-risk action supported by evidence; do not restart every dependency at once.

1. **Low risk — start only a stopped dependency.** If MongoDB is stopped and logs show connection failures:

   ```sh
   docker compose start mongodb
   ```

2. **Medium risk — restart the isolated dependency.** If Auth readiness fails and the measured reservation calls fail or exceed their deadline:

   ```sh
   docker compose restart auth-service
   ```

3. **Higher risk — restart the affected application service only after dependencies are ready.** If Appointments remains unhealthy:

   ```sh
   docker compose restart appointments-service
   ```

These are local Compose recovery actions. Production rollback, scaling, and cloud-console commands are not documented as verified capabilities in this repository.

### Verify and escalate

- Repeat the readiness command and confirm it returns HTTP 200 with database and broker ready.
- Confirm the 5xx ratio falls and booking requests return the expected status. Do not use a single health probe as proof that the user journey works.
- If the problem persists, preserve logs and timestamps, record the active trace IDs, and escalate to the backend owner. The team must fill in its real on-call contacts and escalation channel before production use.

## Alert: slow Auth reservations

`AuthReservationFastBurn` is based on the Appointments Service's outbound `POST /internal/reservations` histogram. The bounded labels are `dependency="auth-service"`, `operation="reserve"`, and `outcome`; patient and appointment IDs are not labels.

1. Confirm the burn-rate expression in Prometheus:

   ```promql
   1 - (
     sum(rate(salud_activa_dependency_request_duration_seconds_bucket{dependency="auth-service",operation="reserve",outcome="success",le="1"}[5m]))
     /
     sum(rate(salud_activa_dependency_request_duration_seconds_count{dependency="auth-service",operation="reserve"}[5m]))
   )
   ```

2. Check Auth readiness:

   ```powershell
   docker compose exec -T auth-service node -e "fetch('http://127.0.0.1:3001/health/ready').then(async r => { console.log(r.status, await r.text()); process.exitCode = r.ok ? 0 : 1; }).catch(e => { console.error(e.message); process.exitCode = 1; })"
   ```

3. Search correlated service logs using the `trace_id` PowerShell command above. Compare the Appointments dependency histogram with Auth request logs. Trace UI inspection requires an OTLP exporter and collector, neither of which is included in Compose.
4. Mitigate in order: (a) if Auth is stopped, `docker compose start auth-service`; (b) if it is running but unhealthy and its dependency is ready, `docker compose restart auth-service`; (c) only if Auth is healthy but Appointments still has stuck saga consumers, preserve logs and escalate to the backend/service owner before restarting `appointments-service` (restart may interrupt in-flight consumers; RabbitMQ redelivery is expected from the manual-ack consumer).
5. Verify Auth `/health/ready` returns 200, successful reservation observations recover below the one-second threshold, and new booking sagas reach a terminal state. HTTP 202 alone is not proof that the saga completed.

Escalation roles: the backend/on-call responder owns immediate triage; the Auth service owner investigates reservation latency; the team lead decides whether to pause releases or escalate outside the team. Names and paging contacts are not present in the repository and must be supplied by the team.

## Alert: slow booking requests

1. Check the P95 query:

   ```promql
   histogram_quantile(0.95, sum by (le) (rate(salud_activa_http_request_duration_seconds_bucket{service="appointments-service",method="POST",route="/api/turnos"}[5m])))
   ```

2. Compare Appointments logs and spans for MongoDB write latency. For the asynchronous phase, follow the same trace to the saga consumer and Auth reservation request.
3. Check CPU/memory only as supporting signals; no tuned saturation threshold or load baseline exists yet.
4. Restore the unhealthy dependency using the actions above. Avoid changing MongoDB data or deleting its volume as a latency mitigation.
5. Verify P95 improves after there is enough representative traffic. The alert depends on a minimum sample count; at low volume it may not fire.

## RabbitMQ/outbox degradation (no alert implemented yet)

Symptoms include `appointments-service` readiness returning 503 with `broker: disconnected`, appointments remaining `Pendiente`, and broker reconnect/outbox warnings. A 202 response can continue while RabbitMQ is unavailable because the outbox record is persisted first.

1. Check broker state and logs:

   ```sh
   docker compose ps rabbitmq appointments-service
   docker compose logs --since 15m --tail 200 rabbitmq appointments-service
   ```

2. Restore the local broker if stopped:

   ```sh
   docker compose start rabbitmq
   ```

3. Follow Appointments logs; the relay reconnects and publishes persisted events. Verify `/health/ready` returns 200. If a valid test account/token is available, inspect that account's appointment state through the normal API.

No outbox-age or dead-letter metric/alert exists yet. Do not claim queue recovery from readiness alone; add and validate those metrics before relying on asynchronous paging.
