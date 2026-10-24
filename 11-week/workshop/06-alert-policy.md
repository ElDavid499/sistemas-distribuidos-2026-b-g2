# CP7: Burn-Rate Alert Policy

The companion [06-alerts.yml](./06-alerts.yml) contains Prometheus rules for the implemented HTTP metrics and Auth reservation histogram. These rules are operationally proposed and require a live Prometheus scrape and receiver configuration to become active in production. Local validation has been completed with `promtool check rules`: the file is syntactically valid and contains six alert rules. The deployment path for alert delivery remains unconfigured in this repository.

## Alert windows, thresholds, and response

Burn rate = observed bad-event ratio / allowed bad-event ratio. The fast policy evaluates the short and long windows together and confirms the condition for 5 minutes. The sustained policy also evaluates two windows and confirms for 30 minutes.

| Alert | SLO / allowed error | Multi-window threshold | `for` and traffic floor | Severity / action |
|---|---|---|---|---|
| `AppointmentAvailabilityFastBurn` | 99.9% availability; 0.1% bad | 5m AND 1h error ratio > `14.4 * 0.1% = 1.44%` | 5m; >=10 requests in 5m and >=50 in 1h | Critical; page the on-call role; use the 5xx runbook |
| `AppointmentAvailabilitySustainedBurn` | Same | 30m AND 6h error ratio > `6 * 0.1% = 0.6%` | 30m; >=50 in 30m and >=200 in 6h | Warning; notify backend owner and prepare mitigation |
| `AppointmentLatencyFastBurn` | 95% under 300ms; 5% bad | 5m AND 1h ratio over 300ms > `14.4 * 5% = 72%` | 5m; >=10 in 5m and >=50 in 1h | Critical; use the slow-booking runbook |
| `AppointmentLatencySustainedBurn` | Same | 30m AND 6h ratio over 300ms > `6 * 5% = 30%` | 30m; >=50 in 30m and >=200 in 6h | Warning; investigate persistent booking latency |
| `AuthReservationFastBurn` | 99% successful reservations <=1s; 1% bad | 5m AND 1h bad ratio > `14.4 * 1% = 14.4%` | 5m; >=10 attempts in 5m and >=50 in 1h | Critical; use the slow-Auth runbook |
| `AuthReservationSustainedBurn` | Same | 30m AND 6h bad ratio > `6 * 1% = 6%` | 30m; >=50 attempts in 30m and >=200 in 6h | Warning; investigate the Auth dependency trend |

At burn rate 14.4, one hour at the threshold consumes `14.4 / 720 = 2%` of a 30-day error budget. At burn rate 6, six hours consumes `6 * 6 / 720 = 5%`. `for` is a confirmation period, not the budget-consumption window; at a continuously maintained threshold, the extra 5-minute or 30-minute hold consumes additional budget. The rules have minimum traffic guards to avoid paging on tiny samples, but those guards are not proven suitable for real demand. The illustrative 100 bookings/day averages only 4.17/hour; the 50/hour fast-window guard means such a low-volume deployment may never fire these alerts. Revisit the guards using observed traffic and add a separate scrape/target-health monitor.

Each rule includes `severity`, `service`, `team`, `summary`, and a runbook link. Critical is intended for on-call paging; warning is a team notification. The repository does not configure either delivery channel.

## Cause-based alerts deliberately omitted

1. **CPU above a fixed percentage:** CPU saturation alone does not establish patient-visible impact; the latency and availability SLOs are the symptom-based alerts. There is no tuned CPU exporter/baseline in Compose.
2. **Every container restart / readiness transition:** a restart may be self-healed and does not always violate the user journey. Alert on resulting SLO burn or sustained target unavailability instead. A target-down alert still needs an operational scrape target and notification path.

RabbitMQ can delay saga confirmation while `POST /api/turnos` continues returning 202. There is no outbox-age or terminal-saga metric yet, so asynchronous completion has no dedicated alert. Add that instrumentation before claiming queue-age protection.

## Validation

The file parsed as YAML and contained six alert rules. Local validation succeeded with a downloaded `promtool` binary in this environment:

```powershell
C:\Temp\prometheus\promtool.exe check rules C:\Users\david\Videos\workshop\ProyectoDistribuidos2026\11-week\workshop\06-alerts.yml
```

Result: `SUCCESS: 6 rules found`.
