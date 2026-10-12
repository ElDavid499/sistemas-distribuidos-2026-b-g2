# Distributed Systems
## Week 10 · Session 01 · Persistence in Distributed Systems — Saga, Outbox and CQRS

**CORHUILA**  
**Systems Engineering · 2026-B**

**Unit 3 · Weekly · Corte 2**

---

# Persistence in Distributed Systems — Saga, Outbox and CQRS

Once each service owns its data, the traditional single-database transaction is no longer enough to guarantee consistency across the entire system.

This session explores database-per-service architecture, sagas for coordinating distributed transactions, the outbox pattern for reliably publishing events, and CQRS for separating write operations from read operations.

The objective is to understand how distributed services maintain consistency without depending on a single global database transaction.

## Learning Objectives

1. Apply the database-per-service pattern and understand polyglot persistence.
2. Coordinate cross-service consistency using sagas and compensating transactions.
3. Publish events reliably using the outbox pattern.
4. Separate read and write models using CQRS and understand eventual consistency.

---

# 1. Database per Service

In a distributed architecture, each service owns its database. Other services must not access that database directly. They should communicate through APIs or documented event contracts.

This separation allows each service to evolve, deploy, scale, and modify its data model independently.

## Key Principles

- Each service owns its data.
- Other services access data through defined contracts.
- Database schemas remain private to their owning services.
- Services can select storage technologies according to their needs.
- Data consistency between services must be handled explicitly.

## Example

For a distributed application, different services may use different storage technologies.

| Service | Possible storage | Purpose |
|---|---|---|
| Identity Service | PostgreSQL | Users, roles and authentication data |
| Appointments Service | PostgreSQL | Appointments and scheduling |
| Notifications Service | Database or message queue | Notification status and delivery |
| Session Management | Redis | Temporary session data |

Choosing different storage technologies according to each service's requirements is known as **polyglot persistence**.

These are architectural examples, not a requirement to introduce every technology into MVP 2.

## Communication Between Services

```text
Appointments Service
        |
        | API / Event Contract
        v
Notifications Service
        |
        v
Notifications Database
```

The Appointments Service must not query the Notifications database directly. It communicates through an agreed contract.

## Benefits

- Independent deployment.
- Independent schema evolution.
- Clear ownership of data.
- Reduced coupling between services.
- Freedom to select appropriate storage technologies.

## Common Challenge

When data belongs to different services, a single ACID transaction cannot normally coordinate every operation across all their databases. The system needs distributed consistency patterns such as sagas and outbox.

---

# 2. No Global Transaction: The Saga

A **saga** coordinates a business process across multiple services through a sequence of local transactions.

Each service completes its own transaction. If a later step fails, the system executes compensating actions to address the effects of previously completed steps.

A saga does not make all operations one atomic database transaction. Instead, it manages the workflow and its failure paths.

## Example: Appointment Booking

Consider a workflow in Salud Activa / GestionTurnosApp:

1. The Appointments Service creates a pending appointment.
2. The Availability Service reserves the time slot.
3. The Payments Service processes payment, if required.
4. The Appointments Service confirms the appointment.
5. The Notifications Service sends a confirmation.

If payment fails after the time slot is reserved, the system must release the reservation and update the appointment state appropriately.

The exact steps depend on the business rules and whether the appointment requires payment.

## Saga with Compensation

```text
Create Pending Appointment
           |
           v
Reserve Time Slot
           |
           v
Process Payment (if required)
           |
       +---+---+
       |       |
    Success  Failure
       |       |
       v       v
 Confirm    Release Slot
 Appointment    |
       |        v
       v     Update Status
 Send Notification
```

A compensation does not necessarily erase history. It performs a business action that restores an acceptable state, such as releasing a reservation or issuing a refund.

## Two Saga Styles

### Orchestration

A coordinator directs the workflow and decides which step happens next.

```text
       Saga Coordinator
        /     |      \
       v      v       v
 Availability Payment Appointments
```

**Advantages:**

- Centralized workflow visibility.
- Explicit step ordering.
- Easier coordination of complex processes.

### Choreography

Services react to events published by other services.

```text
AppointmentCreated
        |
        v
SlotReserved
        |
        v
PaymentCompleted
        |
        v
AppointmentConfirmed
```

**Advantages:**

- Less dependence on a central coordinator.
- Services react to events independently.

**Trade-off:** choreography can become difficult to understand when many services and event dependencies are involved.

## When to Use a Saga

Use a saga when a business operation crosses multiple services and requires a defined response to failures.

Every important step should define:

- Its local transaction.
- Its success event or result.
- Its failure conditions.
- Its compensating action, when applicable.
- Its retry and timeout policy.

---

# 3. Publish Events Reliably: The Outbox Pattern

The **dual-write problem** occurs when an application must update its database and publish an event but cannot guarantee that both operations succeed together.

For example, the Appointments Service saves an appointment, then crashes before publishing `AppointmentCreated`. Other services never receive the event, even though the appointment exists.

Publishing the event first creates the opposite risk: an event may be delivered even though the database transaction fails.

## The Outbox Solution

The outbox pattern stores the business change and its event record in the **same local database transaction**.

A separate relay publishes the stored event to the message broker.

```text
Appointment Request
        |
        v
Single DB Transaction
   |              |
   v              v
Save Appointment  Save Outbox Event
   |              |
   +-------+------+
           |
           v
      Outbox Relay
           |
           v
      Message Broker
           |
           v
   Event Consumers
```

If the transaction fails, neither the appointment change nor the outbox event is committed. If it succeeds, the event remains available for the relay to publish.

## Example Outbox Record

```json
{
  "event_id": "event-123",
  "event_type": "AppointmentCreated",
  "aggregate_id": "appointment-456",
  "status": "pending",
  "created_at": "2026-10-10T10:00:00Z"
}
```

This is an illustrative record. A real implementation should also define payload format, delivery attempts, timestamps, and processing status.

## Important Implementation Details

- Save the business change and outbox event atomically.
- Retry failed publications.
- Track successfully published events.
- Ensure consumers can safely process duplicate events.
- Monitor events that remain pending for too long.
- Define a retention and cleanup policy for published records.

The outbox commonly provides **at-least-once delivery**, meaning an event can be delivered more than once. It does not automatically guarantee exactly-once processing.

---

# 4. Fast Reads: CQRS and Eventual Consistency

**CQRS** stands for Command Query Responsibility Segregation.

It separates the model that handles changes from the model that serves read requests.

- **Command model:** handles operations that change state.
- **Query model:** serves requests to retrieve information.

The models may use different data structures and can be optimized for their respective workloads.

## Example

In Salud Activa, creating an appointment is a command. Viewing a patient's upcoming appointments is a query.

```text
Command: Create Appointment
           |
           v
   Write Model / Database
           |
           v
      Domain Event
           |
           v
    Read Model Update
           |
           v
Query: View Appointments
```

The read model may be updated shortly after the write, rather than at exactly the same moment.

This delay is called **eventual consistency**.

## Handling Eventual Consistency

The application should not promise that every read reflects a change immediately.

For example, after a patient books an appointment, the interface might show:

- Appointment request received.
- Processing confirmation.
- Appointment confirmed.

The actual status must come from the system's business state. The interface should not display a confirmed appointment before confirmation has occurred.

## Benefits of CQRS

- Read operations can be optimized independently.
- Query models can be tailored to application screens.
- Read and write workloads can scale separately.
- Complex read operations can use denormalized views.

## Trade-offs

- More components and operational complexity.
- Read models can temporarily be stale.
- Event processing and rebuilding views require monitoring.
- Data duplication must be managed carefully.

CQRS is useful when the application has a real need for separate read and write models. It should not be added solely because the architecture is distributed.

---

# 5. A Path You Will Face in Real Life

## Scenario — The Lost Event

The Appointments Service saves an appointment successfully, but the application crashes before publishing `AppointmentCreated`.

The Availability Service never receives the event and does not reserve the time slot. The appointment is left in an inconsistent state.

## Root Cause

The application performed two independent operations:

1. Saved data to the database.
2. Published an event to the message broker.

The process failed between these operations.

## Correct Solution

1. Save the appointment and its outbox event in the same database transaction.
2. Use a relay to publish pending outbox events.
3. Retry transient publication failures.
4. Give each event a stable identifier.
5. Make consumers idempotent so duplicate deliveries do not repeat business effects.
6. Use a saga to coordinate the workflow and handle compensations.
7. Monitor pending events and failed processing.

## Idempotent Consumers

An operation is **idempotent** when repeating it produces the same effective result as performing it once.

For example, if the same `AppointmentCreated` event arrives twice, the Availability Service should not reserve two slots for the same appointment.

A consumer can track processed event IDs or use an appropriate database constraint and transactional processing strategy.

## Main Lesson

Cross-service consistency depends on **sagas, the outbox pattern, idempotent consumers, retries, and clear failure handling**. It should not depend on pretending a global transaction exists.

---

# 6. Common Mistakes

- Allowing one service to query another service's database directly.
- Trying to use one global ACID transaction across all services.
- Saving to the database and publishing an event without an outbox.
- Assuming that an event will never be delivered twice.
- Implementing consumers that repeat business effects when events are redelivered.
- Ignoring failed saga steps and compensating actions.
- Assuming read models are instantly consistent.
- Introducing CQRS without a clear requirement.
- Failing to monitor pending outbox events and consumer errors.

---

# Self-Check

## Question 1. Database-per-service means...

- No database at all.
- **Each service owns its database; other services use its contracts, not its tables.**
- One shared database for all services.

## Question 2. A saga maintains cross-service consistency through...

- **Local transactions and compensations when a later step fails.**
- A single distributed ACID transaction.
- Ignoring failures.

## Question 3. The dual-write problem occurs when...

- **A database write and event publication cannot be made atomic through two independent operations, so one may be lost.**
- Two databases write the same row.
- Data is written twice for speed.

## Question 4. The outbox pattern works by...

- Skipping events.
- Publishing to the broker first and saving to the database later.
- **Writing the event to an outbox table in the same database transaction, then publishing it through a relay.**

## Question 5. CQRS separates...

- **The write model (commands) from the read model (queries).**
- The frontend from the backend.
- Development from production.

## Question 6. Cross-service consistency is achieved through...

- A shared database.
- A global distributed transaction.
- **Sagas, outbox, idempotent consumers, and eventual consistency.**

---

# This Week

For **Salud Activa / GestionTurnosApp**, apply the following persistence practices as part of the MVP 2 architecture.

## 1. Database per Service

- Identify the service responsible for each data entity.
- Document which service owns each database and schema.
- Ensure services communicate through APIs or event contracts.
- Avoid direct access to another service's tables.

## 2. Implement One Saga

Choose one important cross-service workflow, such as appointment booking.

- Document the steps in the workflow.
- Define success and failure conditions.
- Identify the local transaction for each participating service.
- Define compensating actions.
- Document retry and timeout behavior.

## 3. Implement the Outbox Pattern

For one critical event:

- Save the business change and outbox record in the same database transaction.
- Publish the event through a relay.
- Handle publication retries.
- Track delivery status and pending events.

## 4. Make Consumers Idempotent

- Assign a stable ID to each event.
- Prevent duplicate deliveries from repeating business effects.
- Test the same event being delivered more than once.
- Document how processed events are tracked.

## 5. Evaluate CQRS

- Identify read operations that may need a separate read model.
- Document how the read model is updated.
- Define acceptable consistency delays.
- Show appropriate processing states in the interface.
- Avoid unnecessary architectural complexity.

## Expected Result

The project should demonstrate how data ownership, cross-service workflows, reliable event publishing, and duplicate-safe processing work together.

The following session focuses on **shipping MVP 2 as an integrated distributed system**, validating both successful operations and failure paths.

---

**Distributed Systems · Week 10 · Session 01 · Persistence in Distributed Systems — Saga, Outbox and CQRS**

**Systems Engineering · Faculty of Engineering · © 2026 CORHUILA**