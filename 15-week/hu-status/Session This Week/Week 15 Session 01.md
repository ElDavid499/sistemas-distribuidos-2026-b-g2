# CORHUILA — Systems Engineering
## Distributed Systems · 2026-B
### Week 15 · Session 01 — Testing at Scale: Contract, E2E, Load and Chaos

**Unit 3 · Weekly · Corte 3**

---

## 1. Introduction

Unit tests can verify individual functions, but they cannot prove that a distributed system will behave correctly under real-world conditions. Services communicate through networks, depend on databases and message brokers, and may experience latency, partial failures, or unexpected traffic spikes.

This session explores a testing strategy adapted to distributed systems. It combines integration testing with real dependencies, contract testing, end-to-end testing, load testing, and chaos engineering to validate both functionality and resilience.

## 2. Learning Objectives

By the end of this session, students should be able to:

1. Apply the testing pyramid to distributed architectures.
2. Use Testcontainers for integration tests with real dependencies.
3. Explain how contract and end-to-end tests protect service boundaries and critical user journeys.
4. Evaluate system performance against Service Level Objectives (SLOs).
5. Design controlled chaos experiments to verify graceful degradation.

## 3. The Testing Pyramid Adapted for Distributed Systems

A distributed system requires different testing levels because no single test type can validate every aspect of the architecture.

The recommended strategy includes:

- **Unit tests:** Verify individual functions, classes, and business rules. They should be fast and numerous.
- **Integration tests:** Verify that a service works correctly with real dependencies, such as PostgreSQL or Kafka.
- **Contract tests:** Verify that service producers and consumers agree on API structures, messages, and expected behavior.
- **End-to-end tests:** Validate complete critical user journeys across multiple services.
- **Load tests:** Evaluate latency, throughput, and error rates under different traffic levels.
- **Chaos tests:** Introduce controlled failures to verify recovery and graceful degradation.

The strategy should contain many unit tests, fewer integration and contract tests, and a limited number of end-to-end tests. Load and chaos tests complement the pyramid by validating performance and resilience.

## 4. Integration Testing with Testcontainers

Mocks are useful for isolated unit tests, but they may hide problems involving database drivers, SQL queries, migrations, or real infrastructure behavior.

**Testcontainers** allows developers to start real dependencies inside temporary containers during automated tests.

Examples include:

- PostgreSQL for database integration tests.
- Kafka for event-driven communication tests.
- Redis for cache integration tests.

A typical integration test follows this process:

1. Start the required container.
2. Configure the application to connect to the real dependency.
3. Execute the test cases.
4. Verify the results.
5. Stop and remove the container.

This approach provides greater confidence that the application works with the actual technology used in its environment.

## 5. Contract and End-to-End Testing

### 5.1 Contract Testing

Contract tests protect communication between services.

They verify that a provider continues to satisfy the expectations of its consumers. Tools such as Pact can help automate this validation.

For example, if the appointment service expects a specific response from the identity service, a contract test can detect incompatible changes before deployment.

Contract testing helps prevent:

- Unexpected API response changes.
- Missing or renamed fields.
- Incompatible request formats.
- Breaking changes between independently deployed services.

### 5.2 End-to-End Testing

End-to-end tests validate a complete user journey through the running system.

For a healthcare appointment platform, an example is:

1. A patient logs in.
2. The patient searches for an available appointment.
3. The patient selects a time slot.
4. The system confirms the appointment.
5. The patient can view the confirmed appointment.

These tests are valuable because they validate the interaction between services. However, they should remain limited to critical workflows because they are usually slower and more fragile than unit or integration tests.

## 6. Load and Performance Testing

Load testing evaluates how a system behaves when multiple users or requests access it simultaneously.

Common tools include:

- **k6:** Scriptable performance and load testing.
- **Gatling:** Load testing for distributed applications.
- **Apache JMeter:** Performance and stress testing.

Important measurements include:

- **Latency:** How long a request takes.
- **Throughput:** How many requests the system processes over time.
- **Error rate:** The percentage of requests that fail.
- **Resource utilization:** CPU, memory, and other infrastructure consumption.

Load testing should compare these measurements against the system's SLOs.

A useful test should identify the point where performance begins to deteriorate, reveal bottlenecks, and verify whether autoscaling works as expected.

Distributed tracing can help identify which service or dependency is responsible for increased latency.

## 7. Chaos Engineering: Proving Resilience

Chaos engineering introduces controlled failures to determine whether a system can continue operating or recover safely.

Possible experiments include:

- Stopping one service.
- Introducing network latency.
- Dropping messages.
- Making a dependency temporarily unavailable.
- Simulating a database connection failure.

The objective is not to damage the system. It is to verify that resilience mechanisms work as expected.

Examples of mechanisms to validate include:

- Retries with appropriate limits.
- Circuit breakers.
- Timeouts.
- Fallback responses.
- Saga compensation.
- Message redelivery and idempotency.

Chaos experiments must be controlled, monitored, and performed in an environment where failures can be safely introduced.

## 8. Real-World Scenario: All Tests Pass, but the System Fails at Launch

Imagine that every unit test passes, but the checkout process fails when traffic reaches 200 requests per second. A temporary failure in the payment service also causes other services to become unavailable.

This situation demonstrates that passing unit tests is not enough.

A better validation strategy would be:

1. Run a load test to identify the system's capacity limits.
2. Compare latency and error rates against the SLOs.
3. Use distributed traces to identify bottlenecks.
4. Optimize the affected service or dependency.
5. Introduce a controlled payment-service failure.
6. Verify that the circuit breaker protects the rest of the system.
7. Confirm that the Saga performs the required compensation.

The objective is to discover performance and resilience problems before users experience them.

## 9. Common Mistakes

- Depending only on unit tests to validate a distributed system.
- Mocking databases in integration tests instead of testing real dependencies.
- Creating too many fragile end-to-end tests.
- Ignoring load and performance testing.
- Introducing chaos without a controlled experiment or recovery plan.
- Measuring performance without comparing results against SLOs.
- Assuming that retries alone guarantee resilience.

## 10. Self-Check

**Question 1. What does the distributed testing pyramid recommend?**

Correct answer: Many unit tests, fewer integration and contract tests, a few end-to-end tests, plus load and chaos testing.

**Question 2. What are Testcontainers used for?**

Correct answer: Running real dependencies, such as databases or brokers, in containers during integration tests.

**Question 3. What is the purpose of load testing?**

Correct answer: Finding capacity and latency limits and evaluating performance against SLOs before users experience problems.

**Question 4. What does chaos engineering mean?**

Correct answer: Introducing controlled failures to verify that the system degrades gracefully and recovers correctly.

**Question 5. What do contract tests protect?**

Correct answer: Compatibility between service producers and consumers.

**Question 6. How should a system that passes unit tests but fails at 200 requests per second be improved?**

Correct answer: By performing load and chaos tests before release, identifying bottlenecks, and validating resilience mechanisms.

## 11. This Week — Application to Salud Activa / GestionTurnosApp

The team should complete a testing strategy that validates both individual services and the complete platform.

Suggested activities:

1. **Integration testing:** Test service interactions with real dependencies, using Testcontainers where appropriate for PostgreSQL or other supported infrastructure.
2. **Contract testing:** Validate communication contracts between the API gateway, identity service, and appointment service.
3. **End-to-end testing:** Validate critical patient journeys, especially login, appointment search, and appointment booking.
4. **Load testing:** Simulate concurrent requests and measure latency, throughput, and error rates against defined SLOs.
5. **Chaos experiment:** Introduce a controlled service failure and verify that the system handles it without causing unnecessary failures across the platform.
6. **Evidence:** Record test commands, results, relevant screenshots, and any issues discovered.

These activities should be documented with real evidence. Do not mark a test as completed until it has actually been executed and its result has been verified.

---

**Distributed Systems · Week 15 · Session 01**  
**Testing at Scale — Contract, E2E, Load and Chaos**  
Systems Engineering · Faculty of Engineering · © 2026 CORHUILA