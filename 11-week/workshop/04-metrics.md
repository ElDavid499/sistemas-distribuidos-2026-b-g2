# CP4: Golden Signals and Metric Catalog

## Scope and implementation status

The critical journey crosses `backend` (API Gateway), `appointments-service`, `auth-service`, MongoDB, and RabbitMQ. The current Prometheus client is `@prometheus-io/client`. The three HTTP services expose their own `/metrics` endpoints. The Appointments Service also measures outbound Auth reservation-call duration. Metrics below are labeled **implemented** only when the code records them; the remaining saturation and broker metrics are proposals.

## API Gateway (`backend`)

| Golden signal | Metric | Type / unit | Labels and estimated cardinality | Example PromQL | Status |
|---|---|---|---|---|---|
| Traffic | `salud_activa_http_requests_total` | Counter / requests | service=1 per target; method <=7; normalized route <=7; status_code <=10. Upper-bound product: 490 series per target. | `sum(rate(salud_activa_http_requests_total{service="api-gateway"}[5m]))` | Implemented |
| Latency | `salud_activa_http_request_duration_seconds` | Histogram / seconds | Same labels; 8 finite buckets + `+Inf`, count, sum: at most 5,390 series per target. | `histogram_quantile(0.95, sum by (le) (rate(salud_activa_http_request_duration_seconds_bucket{service="api-gateway"}[5m])))` | Implemented |
| Errors | `salud_activa_http_requests_total` | Counter / requests | Same bounded labels; 5xx selected through `status_code`. | `sum(rate(salud_activa_http_requests_total{service="api-gateway",status_code=~"5.."}[5m])) / sum(rate(salud_activa_http_requests_total{service="api-gateway"}[5m]))` | Implemented |
| Saturation | `nodejs_process_resident_memory_bytes` | Gauge / bytes | No user-controlled labels; scrape target identifies this process. | `nodejs_process_resident_memory_bytes{job="api-gateway"}` | Implemented default process metric; no alert threshold yet |

## Appointments Service

| Golden signal | Metric | Type / unit | Labels and estimated cardinality | Example PromQL | Status |
|---|---|---|---|---|---|
| Traffic | `salud_activa_http_requests_total` | Counter / requests | Same bounded HTTP label set; at most 490 combinations per target. | `sum(rate(salud_activa_http_requests_total{service="appointments-service",route="/api/turnos",method="POST"}[5m]))` | Implemented |
| Latency | `salud_activa_http_request_duration_seconds` | Histogram / seconds | Same HTTP labels; at most 5,390 series per target. | `histogram_quantile(0.95, sum by (le) (rate(salud_activa_http_request_duration_seconds_bucket{service="appointments-service",route="/api/turnos",method="POST"}[5m])))` | Implemented |
| Errors | `salud_activa_http_requests_total` | Counter / requests | Same bounded labels; server errors are `status_code=~"5.."`. | `sum(rate(salud_activa_http_requests_total{service="appointments-service",route="/api/turnos",method="POST",status_code=~"5.."}[5m])) / sum(rate(salud_activa_http_requests_total{service="appointments-service",route="/api/turnos",method="POST"}[5m]))` | Implemented |
| Saturation | `nodejs_process_resident_memory_bytes` | Gauge / bytes | Scrape target identifies the service; no dynamic labels. | `nodejs_process_resident_memory_bytes{job="appointments-service"}` | Implemented default process metric; CPU/container limits are not measured |
| Auth dependency latency | `salud_activa_dependency_request_duration_seconds` | Histogram / seconds | `dependency`=1 (`auth-service`); `operation`<=2 (`reserve`, `release`); `outcome`<=2 (`success`, `error`): at most 4 combinations per target. | `sum(rate(salud_activa_dependency_request_duration_seconds_bucket{dependency="auth-service",operation="reserve",outcome="success",le="1"}[5m])) / sum(rate(salud_activa_dependency_request_duration_seconds_count{dependency="auth-service",operation="reserve",outcome="success"}[5m]))` | Implemented |

## Auth Service

| Golden signal | Metric | Type / unit | Labels and estimated cardinality | Example PromQL | Status |
|---|---|---|---|---|---|
| Traffic | `salud_activa_http_requests_total` | Counter / requests | Same bounded HTTP label set; at most 490 combinations per target. | `sum(rate(salud_activa_http_requests_total{service="auth-service"}[5m]))` | Implemented |
| Latency | `salud_activa_http_request_duration_seconds` | Histogram / seconds | Same bounded labels; at most 5,390 series per target. | `histogram_quantile(0.95, sum by (le) (rate(salud_activa_http_request_duration_seconds_bucket{service="auth-service"}[5m])))` | Implemented |
| Errors | `salud_activa_http_requests_total` | Counter / requests | Same bounded labels; server errors use status class 5xx. | `sum(rate(salud_activa_http_requests_total{service="auth-service",status_code=~"5.."}[5m])) / sum(rate(salud_activa_http_requests_total{service="auth-service"}[5m]))` | Implemented |
| Saturation | `nodejs_process_resident_memory_bytes` | Gauge / bytes | Scrape target identifies this process; no dynamic labels. | `nodejs_process_resident_memory_bytes{job="auth-service"}` | Implemented default process metric; no CPU/container exporter |

### Cardinality calculation and privacy

The HTTP middleware normalizes arbitrary paths to one of at most seven values: `/api/turnos`, `/api/turnos/check-availability`, `/api/turnos/:id`, `/api/demo/fail-next-saga`, `/health/live`, `/health/ready`, or `/other`. It limits method labels to seven known methods (other methods become `OTHER`). For a conservative upper bound, status codes are budgeted at ten values. Thus the HTTP counter upper bound is `1 service * 7 methods * 7 routes * 10 statuses = 490` series per service target. Each histogram has eight finite buckets plus `+Inf`, `_count`, and `_sum`, or 11 series per label combination: `490 * 11 = 5,390` series per service target. Actual series are lower because not every route/method/status combination occurs. Scraping all three services yields at most 1,470 counter and 16,170 histogram series by this estimate.

Never label with `trace_id`, `span_id`, `appointment_id`, `event_id`, `correlation_id`, patient/user ID, email, name, raw URL, timestamp, or payload text. Replace dynamic URLs with the finite route set and classify outcomes with the bounded labels above.

### Histogram bucket rationale

The HTTP histogram uses `[0.05, 0.1, 0.25, 0.3, 0.5, 1, 2.5, 5]` seconds. The written project NFR sets a critical-endpoint P95 target below 300 ms, so 250 ms and 300 ms buckets distinguish requests near that threshold; 50/100 ms capture fast responses, while 500 ms through 5 s expose progressively slower outliers. These are design thresholds from the NFR, not observed user-experience measurements.

The Auth dependency histogram uses `[0.1, 0.3, 0.5, 1, 2.5, 3, 5, 10]` seconds. The client has a 3-second timeout, so the 1-second SLO boundary, the timeout boundary, and slow/outlier ranges are separately visible. The dependency histogram has at most four bounded label combinations and eleven series per combination (44 total), excluding its target labels.

## Proposed, not currently implemented

The project does not yet expose RabbitMQ queue depth, oldest outbox age, saga retry/dead-letter counts, MongoDB pool utilization, or container CPU throttling. These require explicit instrumentation or exporters and scrape configuration. Do not query or alert on those series until implemented.
