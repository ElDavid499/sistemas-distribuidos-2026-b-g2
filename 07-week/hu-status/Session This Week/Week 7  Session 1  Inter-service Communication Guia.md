# Distributed Systems — Week 7 · Session 1

## Inter-service Communication — REST, gRPC and Messaging

**CORHUILA**  
**Systems Engineering · 2026-B**  
**Unit 2 · Weekly · Corte 2**

---

## 1. Introduction

Distributed systems are composed of multiple services that need to communicate with each other to provide the required functionality.

Service-to-service communication can mainly follow two models:

- **Synchronous communication:** the service making the request waits for a response.
- **Asynchronous communication:** the service emits a message or event and continues without waiting for an immediate response.

This session compares **REST, gRPC, and Messaging**, including their advantages, disadvantages, use cases, delivery semantics, and the importance of idempotent consumers.

---

# 2. Objectives

By the end of this session, students should be able to:

1. Differentiate synchronous and asynchronous communication.
2. Compare REST, gRPC, and Messaging.
3. Understand different message delivery semantics.
4. Design idempotent consumers.
5. Select the appropriate communication mechanism for each interaction.
6. Identify resilience problems caused by long synchronous chains.

---

# 3. Synchronous vs. Asynchronous Communication

## 3.1 Synchronous Communication

In synchronous communication, the service making the request must wait for a response from the receiving service.

```text
Service A
    |
    | Request
    v
Service B
    |
    | Response
    v
Service A
```

### Characteristics

- The caller waits for a response.
- It is simple to understand and implement.
- There is temporal coupling between services.
- If the receiving service is slow or unavailable, the calling service can also be affected.
- REST and gRPC are commonly used for synchronous communication.

### Example

```text
Checkout → Payments → Response
```

The checkout process waits for the payment service to respond.

---

## 3.2 Asynchronous Communication

In asynchronous communication, the producer sends a message or event and continues its execution without waiting for an immediate response.

```text
Producer
    |
    v
  Broker
    |
    +--------> Consumer A
    |
    +--------> Consumer B
```

### Characteristics

- The producer does not wait for an immediate response.
- It reduces temporal coupling.
- It can absorb sudden increases in workload.
- Multiple consumers can react to the same event.
- It may result in eventual consistency.
- It normally uses a message broker.

---

# 4. REST

## 4.1 What is REST?

**REST (Representational State Transfer)** is one of the most widely used approaches for communication between services through HTTP.

It commonly uses:

- HTTP
- JSON
- Endpoints
- HTTP methods such as GET, POST, PUT, and DELETE.

```text
Client
   |
   | HTTP / JSON
   v
Service
```

## 4.2 Advantages

- Broad support and tooling.
- Easy to understand.
- JSON messages are human-readable.
- Well suited for public APIs.
- Compatible with browsers.
- Can use caching mechanisms.

## 4.3 Disadvantages

- Payloads can be relatively verbose.
- JSON can introduce additional overhead.
- There is no built-in strongly typed contract.
- It normally follows a request/response model.

OpenAPI can be used to formally define and document the contract.

---

# 5. gRPC

## 5.1 What is gRPC?

**gRPC** is a communication framework based on `.proto` contracts.

It can automatically generate typed clients and servers.

It uses:

- Protocol Buffers.
- HTTP/2.
- Binary communication.
- Streaming.
- `.proto` contracts.

### Example

```proto
service Inventory {
  rpc CheckStock (StockRequest) returns (StockReply);
}

message StockRequest {
  string sku = 1;
}

message StockReply {
  int32 available = 1;
}
```

## 5.2 Advantages

- High performance.
- Compact binary messages.
- HTTP/2 communication.
- Supports streaming.
- Strongly defined contracts.
- Automatic client and server generation.
- Well suited for internal service-to-service communication.

## 5.3 Disadvantages

- Messages are not as human-readable as JSON.
- Requires specific tooling.
- Less friendly for public APIs and browsers.
- Has a stronger dependency on `.proto` contracts.

---

# 6. Messaging

Messaging uses a **broker** that receives and distributes messages between producers and consumers.

Examples of message brokers include:

- Kafka.
- RabbitMQ.

```text
Producer
    |
    v
  Broker
   / \
  /   \
Consumer A   Consumer B
```

## 6.1 Queues

A queue distributes work among one or more consumers.

```text
Producer
    |
    v
  Queue
   / | \
  v  v  v
 W1 W2 W3
```

Queues are useful for:

- Task processing.
- Background processing.
- Work distribution.

## 6.2 Pub/Sub

In a **Publish/Subscribe** model, an event can be received by multiple independent consumers.

```text
Producer
    |
    v
  Topic
  / | \
 v  v  v
C1 C2 C3
```

Pub/Sub is useful when multiple services need to react to the same event.

---

# 7. Delivery Semantics

Networks can lose or duplicate messages. Therefore, consumers must be designed to handle retries and duplicate messages.

## 7.1 At-most-once

A message is delivered at most once.

```text
At-most-once
     ↓
Messages may be lost
```

### Advantage

- Retries do not create duplicate deliveries.

### Disadvantage

- Data may be lost.

---

## 7.2 At-least-once

A message is delivered at least once.

```text
At-least-once
       ↓
Duplicate messages may occur
```

This is a common strategy in messaging systems.

Therefore, consumers should be **idempotent**.

---

## 7.3 Exactly-once

Exactly-once delivery cannot simply be guaranteed end-to-end over a network.

Instead, systems can engineer **exactly-once processing**.

A common strategy is:

```text
At-least-once
      +
Idempotency Key
      +
Deduplication
      =
Exactly-once processing
```

---

# 8. Idempotent Consumers

An idempotent consumer can receive the same event multiple times without producing an incorrect effect.

### Example

```text
function Handle(event):

    if seen(event.ID):
        return

    apply(event)

    mark(event.ID)
```

If the event has already been processed, the consumer ignores the duplicate.

This makes retries safe.

---

# 9. Choosing the Communication Mechanism

The appropriate mechanism depends on the type of interaction.

| Question | Synchronous | Asynchronous |
|---|---|---|
| Need an answer now? | Yes | No |
| Must the caller survive callee downtime? | No | Yes |
| Many consumers of one fact? | No | Yes |
| Public/browser-facing? | REST | — |
| Internal, high-throughput? | gRPC | Events |

---

# 10. REST vs. gRPC vs. Messaging

| Characteristic | REST | gRPC | Messaging |
|---|---|---|---|
| Communication | Synchronous | Synchronous | Asynchronous |
| Format | JSON | Protobuf | Messages/Events |
| Transport | HTTP | HTTP/2 | Broker |
| Contract | OpenAPI | `.proto` | Schema |
| Readability | High | Low | Depends on format |
| Streaming | Limited | Yes | Depends on broker |
| Public API | Very suitable | Less suitable | Not the primary purpose |
| Internal communication | Suitable | Very suitable | Very suitable |
| Temporal decoupling | Low | Low | High |
| Load spike absorption | Limited | Limited | High |

---

# 11. Real-Life Scenario: Synchronous Chain

A common problem occurs when too many services are connected synchronously.

```text
Checkout
    |
    v
Payments
    |
    v
Fraud
```

If the fraud service becomes slow:

```text
Slow Fraud Service
        ↓
Payments waits
        ↓
Checkout waits
        ↓
Threads accumulate
        ↓
Pools become exhausted
        ↓
The system may freeze
```

## Solution

Non-critical operations can be changed to asynchronous processing.

```text
Checkout
    |
    v
Payments
    |
    | PaymentRequested
    v
  Broker
    |
    v
Fraud
```

The system should also consider:

- Timeouts.
- Controlled retries.
- Circuit breakers.
- Asynchronous processing.
- States such as `payment pending`.

---

# 12. Common Mistakes

- Creating excessively long synchronous chains.
- Assuming exactly-once delivery.
- Not implementing idempotency.
- Using events when the caller actually needs an immediate response.
- Not implementing timeouts for synchronous calls.
- Not implementing circuit breakers.
- Performing uncontrolled retries.
- Not considering message duplication.

---

# 13. Self-check

### Question 1

**What is the main benefit of asynchronous messaging?**

**Answer:** Decoupling the caller from the callee, allowing the system to survive downtime and absorb load spikes.

### Question 2

**What is gRPC particularly suitable for?**

**Answer:** Internal, high-throughput service communication with strongly defined contracts.

### Question 3

**What does at-least-once delivery require?**

**Answer:** Idempotent consumers that can safely process duplicate messages.

### Question 4

**What does a Pub/Sub topic allow?**

**Answer:** One event can be distributed to multiple independent consumers.

### Question 5

**Does exactly-once delivery exist end-to-end over a network?**

**Answer:** No. Systems should engineer exactly-once processing through idempotency and deduplication.

### Question 6

**What happens to a synchronous A → B → C → D chain under high load?**

**Answer:** It can create cascading waits, exhaust connection/thread pools, and degrade or freeze the system.

---

# 14. This week

For each interaction in the system:

1. Decide whether it should be synchronous or asynchronous.
2. Justify the decision.
3. Choose REST or gRPC for synchronous interactions.
4. Choose topics or queues for asynchronous interactions.
5. Make at least one consumer idempotent.
6. Consider timeouts, retries, and circuit breakers for synchronous communication.

---

## Conclusion

Inter-service communication is a fundamental part of distributed systems. REST and gRPC support synchronous interactions when an immediate response is required, while messaging allows services to become temporally decoupled and process events asynchronously.

The choice should not be based only on technological preference. It should consider the interaction requirements, availability, performance, fault tolerance, number of consumers, and consistency requirements.

A robust distributed system must assume that messages can be lost or duplicated and should therefore use mechanisms such as **idempotency, deduplication, timeouts, retries, and circuit breakers**.