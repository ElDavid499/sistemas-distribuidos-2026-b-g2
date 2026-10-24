# CP3: OpenTelemetry Instrumentation — How to Run

## What is instrumented

This is instrumentation of the real Node.js/Express services in the project, not a simulated appointment backend:

- [OpenTelemetry SDK setup](../../../backend/observability/otel.js) initializes before Express and registers HTTP-client, Express, Mongoose, and AMQP instrumentations.
- [HTTP middleware](../../../backend/observability/http.js) creates server spans with the OpenTelemetry SDK, extracts W3C context, records completion logs, and records Prometheus metrics.
- [Structured logger](../../../backend/observability/logger.js) takes `trace_id` and `span_id` from the active OpenTelemetry span; it does not create IDs.
- [Metrics](../../../backend/observability/metrics.js) exposes bounded HTTP counters/histograms, an Auth dependency latency histogram, and Node process metrics on `/metrics`.
- The booking route persists the active `traceparent` on the MongoDB outbox event. The [relay/consumer](../../../backend/services/appointments-service/messaging.js) propagates and extracts it in RabbitMQ headers. The [Auth client](../../../backend/services/appointments-service/authClient.js) injects it into its downstream HTTP call.
- The canonical implementation is kept with the backend runtime under `backend/observability/` and the real service code, rather than duplicated as a disconnected workshop-only sample.

The Appointments observability test uses the real Express app but deliberately sends no JWT, so it exercises the instrumented `POST /api/turnos` HTTP boundary and returns 401 before database or RabbitMQ work. A separate Gateway proxy test starts a local stub HTTP downstream to verify request forwarding and W3C trace-context continuity; that stub is a test double, not the real Auth or Appointments service. Together, the tests prove HTTP-boundary context continuity and metric/log behavior, not a successful appointment booking or complete end-to-end saga.

## Requirements

- Node.js 22 or newer (the backend Dockerfile uses Node 22).
- npm and network access for the first dependency installation.
- For exported traces, an OTLP/HTTP collector reachable from each service. The current Compose file does not include one.

## Install and test (PowerShell)

From the repository root:

```powershell
Push-Location .\backend
npm ci
npm test -- tests/gateway-proxy.test.js tests/observability.test.js tests/auth-client-observability.test.js
npm test
Pop-Location
```

The focused tests verify that the Gateway forwards a valid W3C `traceparent` with the same trace ID and a downstream span ID; that the Appointments server span returns its own W3C `traceparent`, retains the caller's trace ID in the structured log, and records the bounded request counter; and that a successful Auth reservation call records the bounded dependency-duration histogram. The Auth client test uses a local HTTP stub and does not call the real Auth service.

**Latest results:** the focused command passed (3 suites, 6 tests) and the full backend suite passed (8 suites, 25 tests). This is a real console summary from the local run:

```text
Test Suites: 8 passed, 8 total
Tests:       25 passed, 25 total
Snapshots:   0 total
```

These tests do not prove a successful MongoDB write or end-to-end saga. The Auth client test uses a local HTTP test double; it does not call the real Auth service.

## Run the real local stack

From the repository root, after configuring local-only secrets as described in the project README:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

The stack runs the existing Gateway, Auth, Appointments, MongoDB, and RabbitMQ services. `/metrics` is available on each service's internal port; only the gateway port is published by Compose. The Appointments test harness above does not require Docker or live dependencies.

To export traces, configure `OTEL_EXPORTER_OTLP_ENDPOINT` (or `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`) for each service to an actual OTLP/HTTP collector endpoint, then recreate the containers. For example, if a collector is added to the same Compose network, its URL could be `http://otel-collector:4318`; no collector with that name is currently defined. Without an exporter endpoint, spans are created and propagated but not sent to a trace store; startup emits a warning.

To inspect metric exposition from inside the Appointments container:

```powershell
docker compose exec -T appointments-service node -e "fetch('http://127.0.0.1:3002/metrics').then(async r => console.log(await r.text())).catch(e => { console.error(e.message); process.exitCode = 1; })"
```

## Evidence and limitations

- Test output must be taken from a fresh local run; no historic or fabricated console output is included here.
- This repository does not contain Prometheus, Grafana, Jaeger, an OTLP collector, or an alert receiver.
- The test does not submit patient data and does not assert database, RabbitMQ, Auth reservation, or final saga-state behavior.
- Spans from HTTP, Express, Mongoose, and AMQP require exporting to a configured collector to be searchable outside the service logs.
