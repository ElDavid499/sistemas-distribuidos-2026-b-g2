# Distributed Systems — Week 7 · Session 2

## Planning — Versioned Contracts and Contract Testing

**CORHUILA**  
**Systems Engineering · 2026-B**  
**Unit 2 · Planning · Corte 2**

---

# 1. Introduction

In a distributed system, different services evolve independently. Therefore, clear contracts are required to define how services communicate with each other.

A contract precisely defines:

- What information a service receives.
- What information a service returns.
- What errors it can produce.
- Which API version is available.
- Which changes can be made without breaking consumers.

This session focuses on **versioned contracts, backward compatibility, and Consumer-Driven Contract Testing using Pact**.

---

# 2. Objectives

By the end of this session, students should be able to:

1. Formalize contracts using OpenAPI, Proto, or schemas.
2. Define versioning rules.
3. Apply backward-compatibility rules.
4. Identify compatible and breaking changes.
5. Understand Consumer-Driven Contract Testing.
6. Use Pact to verify contracts between consumers and producers.
7. Plan safe integration between services.

---

# 3. The Contract as the API's Source of Truth

The contract should be the **source of truth for an API**.

It should not depend only on source code or informal documentation.

Machine-readable files should be used:

```text
REST
 ↓
openapi.yaml

gRPC
 ↓
service.proto

Events
 ↓
JSON Schema / Avro
```

These contracts should be maintained and versioned in the repository.

---

# 4. Contracts for Each Technology

## 4.1 REST

REST APIs can use:

```text
openapi.yaml
```

OpenAPI can describe:

- Endpoints.
- HTTP methods.
- Parameters.
- Requests.
- Responses.
- Errors.
- Schemas.

---

## 4.2 gRPC

gRPC uses:

```text
.proto
```

Example:

```proto
service Inventory {

  rpc CheckStock(StockRequest)
      returns (StockReply);
}

message StockRequest {
  string sku = 1;
}

message StockReply {
  int32 available = 1;
}
```

The `.proto` file defines the contract between the client and server.

---

## 4.3 Events

Events can use:

```text
JSON Schema
```

or:

```text
Avro
```

These technologies define the expected structure of messages.

---

# 5. Every Endpoint Declares Five Things

A complete contract should define at least five elements.

## 1. Method and path

Example:

```text
GET /api/v1/inventory/{sku}
```

## 2. Request

The contract must specify the structure of the request.

## 3. Response

The contract must specify the structure of the response.

## 4. Errors

Errors should follow a standard structure.

Example:

```json
{
  "error": {
    "code": "INVENTORY_NOT_FOUND",
    "message": "Inventory item not found",
    "details": {},
    "trace_id": "abc-123"
  }
}
```

## 5. Version

Example:

```text
/api/v1/
```

or:

```text
event.v1
```

---

# 6. Recommended Conventions

Contracts should follow consistent conventions.

## Dates

Use:

```text
ISO-8601 UTC
```

Example:

```text
2026-09-20T20:00:00Z
```

## Pagination

Use parameters such as:

```text
?page=1&limit=20
```

## Identifiers

Use UUIDs when appropriate.

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

## Errors

Use one standard error format:

```json
{
  "error": {
    "code": "...",
    "message": "...",
    "details": {},
    "trace_id": "..."
  }
}
```

---

# 7. Backward Compatibility

Distributed services are deployed independently.

Therefore:

```text
Service A
     |
     v
Service B
```

It is not always possible to update both services at the same time.

For this reason, services should prefer **backward-compatible changes**.

---

# 8. Backward-Compatible Changes

A compatible change can be:

```text
Adding an optional field
```

### Previous version

```json
{
  "sku": "ABC123",
  "available": 10
}
```

### New version

```json
{
  "sku": "ABC123",
  "available": 10,
  "warehouse": "WH-01"
}
```

If `warehouse` is optional, existing consumers can continue working.

---

# 9. Breaking Changes

The following changes can break existing consumers.

## Removing a field

```text
available
```

is removed.

## Renaming a field

```text
available
```

becomes:

```text
qty
```

## Changing a field type

```text
available: integer
```

becomes:

```text
available: string
```

These changes should be treated as **breaking changes**.

---

# 10. Versioning

When an incompatible change is required, a new version should be created.

Example:

```text
/api/v1/inventory
```

and:

```text
/api/v2/inventory
```

The service can temporarily maintain the previous version while consumers migrate.

Events can also be versioned:

```text
InventoryUpdated.v1
InventoryUpdated.v2
```

---

# 11. Deprecation

An old version should not normally be removed immediately.

The recommended process is:

```text
New Version
      ↓
Announce Deprecation
      ↓
Consumer Migration
      ↓
Transition Period
      ↓
Retire Old Version
```

A header such as:

```text
Sunset
```

can be used to communicate the planned retirement.

---

# 12. Consumer-Driven Contract Testing

**Consumer-Driven Contract Testing** verifies that a producer continues to satisfy the expectations of its consumers.

A tool commonly used for this purpose is **Pact**.

The workflow can be represented as:

```text
Consumer
    |
    | Defines expectations
    v
  Pact
    |
    | Verification
    v
 Producer
```

---

# 13. How Pact Works

## Step 1 — Consumer Defines Expectations

The consumer specifies what it needs.

Example:

```text
GET /inventory/ABC123
```

Expected response:

```json
{
  "sku": "ABC123",
  "available": 10
}
```

---

## Step 2 — The Contract Is Generated

The consumer publishes the pact.

```text
Consumer
    |
    v
  Pact
```

---

## Step 3 — Producer Verifies the Contract

The producer runs verification against the contract.

```text
Pact
    |
    v
Producer
```

---

## Step 4 — Integration with CI

Contract verification can be executed inside the CI pipeline.

```text
Commit
   ↓
Tests
   ↓
Contract Tests
   ↓
Build
   ↓
Deploy
```

If the producer breaks the contract:

```text
Contract Test
      ↓
    FAIL
      ↓
Build fails
```

This allows the problem to be detected before production.

---

# 14. Real-Life Scenario: Silent Rename

Suppose Inventory has the following contract:

```json
{
  "available": 10
}
```

Orders consumes this field:

```text
Orders → available
```

The Inventory team decides to rename it:

```text
available
     ↓
qty
```

The producer is updated and deployed.

However, Orders still expects:

```text
available
```

As a result:

```text
Orders
   ↓
available = null
   ↓
Product interpreted as out-of-stock
   ↓
Checkout affected
```

---

# 15. Contract-Based Solution

The contract establishes that the correct field is:

```text
available
```

Orders publishes a consumer pact specifying that it expects this field.

```text
Orders
   |
   v
Consumer Pact
   |
   v
Inventory
```

If Inventory attempts to change:

```text
available → qty
```

the contract test fails.

```text
Contract Test
      ↓
    FAIL
      ↓
Build blocked
```

The problem is therefore detected during CI rather than after deployment.

---

# 16. Contracts as Boundaries Between Services

A contract creates a clear boundary:

```text
┌──────────────┐
│   Consumer   │
└──────┬───────┘
       │
       │ Contract
       │
┌──────▼───────┐
│   Producer   │
└──────────────┘
```

Each team can develop and deploy independently as long as the agreed contract is respected.

---

# 17. Common Mistakes

### 1. No machine-readable contract

This can lead to:

```text
Integration
     ↓
Assumptions
     ↓
Errors
```

### 2. Breaking changes in the same version

Example:

```text
v1
 ↓
Rename fields
```

This can break existing consumers.

### 3. Using only unit tests

Unit tests can pass:

```text
Service A → PASS
Service B → PASS
```

while the actual integration fails:

```text
A ↔ B → FAIL
```

### 4. Deprecating without communication

An API should not be removed without:

- Versioning.
- Announcement.
- Migration period.
- Retirement date.

---

# 18. Self-check

### Question 1

**What should be the source of truth for an API?**

**Answer:** A versioned, machine-readable contract such as OpenAPI, Proto, or Schema.

### Question 2

**Which change is backward-compatible?**

**Answer:** Adding an optional field while keeping existing fields unchanged.

### Question 3

**What does a breaking change require?**

**Answer:** A new version and subsequent deprecation of the previous version.

### Question 4

**What does Consumer-Driven Contract Testing do?**

**Answer:** It verifies that the producer continues to satisfy the expectations defined by its consumers.

### Question 5

**What should a standard error envelope contain?**

**Answer:**

```text
code
message
details
trace_id
```

### Question 6

**How can a silent field rename be prevented?**

**Answer:** By using contracts and consumer pacts verified automatically in CI.

---

# 19. This week

During this week:

1. Publish the service contracts.
2. Use `openapi.yaml` for REST APIs.
3. Use `.proto` for gRPC APIs.
4. Use JSON Schema or Avro for events.
5. Define versioning rules.
6. Define compatibility rules.
7. Implement at least one Consumer-Driven Contract test.
8. Integrate the contract test into CI.
9. Define integration stories for MVP 2.
10. Establish testable acceptance criteria.

---

# 20. Suggested Deliverables

The documentation structure can be organized as follows:

```text
docs/
├── contracts/
│   ├── openapi.yaml
│   ├── services.proto
│   └── events/
│       └── event-schema.json
│
├── architecture/
│   └── contract-versioning.md
│
└── testing/
    └── consumer-contract-testing.md
```

---

# 21. Complete Workflow

The recommended process can be summarized as:

```text
Define Contract
      ↓
Version Contract
      ↓
Define Compatibility Rules
      ↓
Consumer Creates Pact
      ↓
Producer Verifies Pact
      ↓
Run Contract Tests in CI
      ↓
Build
      ↓
Deploy
```

---

# 22. Conclusion

Contracts are fundamental for maintaining stable communication between independent services.

A machine-readable contract clearly defines requests, responses, errors, and versions. Compatibility rules help prevent changes that could break existing consumers.

**Consumer-Driven Contract Testing**, using tools such as Pact, provides automated verification that producers continue to satisfy consumer expectations.

In this way, contracts and contract tests allow potential production problems to be detected during the CI process instead of after deployment.