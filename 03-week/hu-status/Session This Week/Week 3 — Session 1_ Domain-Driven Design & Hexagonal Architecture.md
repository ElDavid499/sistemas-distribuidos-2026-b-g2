# Week 3 — Session 1: Domain-Driven Design & Hexagonal Architecture

## This Week: Bounded Context and Domain Model

### Selected Bounded Context: Appointment Management

For **GestionTurnosApp**, the selected bounded context is **Appointment Management (Gestión de Turnos)**. This context is responsible for managing medical appointments, including requesting, confirming, cancelling, and consulting appointments.

The PDR identifies **Appointment Management** as one of the main modules of the application and defines requirements related to consulting, viewing details, and requesting medical appointments.

---

## 1. Aggregate Root

### Aggregate Root: `Turno`

The main aggregate root is the **`Turno` (Appointment)** entity.

The `Turno` aggregate controls the consistency of the appointment and ensures that all business rules related to its state are respected.

```text
Turno
 ├── id
 ├── patient
 ├── doctor
 ├── date
 ├── time
 └── status
```

The aggregate should be modified through domain methods rather than directly changing its internal state.

Examples:

```text
turno.confirmar()
turno.cancelar()
turno.solicitar()
```

---

## 2. Entities

### `Turno`

Represents a medical appointment.

Its identity is determined by its unique appointment ID.

Main attributes:

- `id`
- `patient`
- `doctor`
- `date`
- `time`
- `status`

### `Paciente`

Represents the patient who requests or owns the appointment.

Main attribute:

- `id`

### `Medico`

Represents the doctor assigned to the appointment.

Main attribute:

- `id`

---

## 3. Value Objects

The following concepts can be represented as Value Objects because they describe appointment information rather than having an independent identity.

### `FechaTurno`

Represents the date of the appointment.

```text
FechaTurno
- date
```

It should only accept valid dates according to the application's business rules.

### `HoraTurno`

Represents the scheduled time.

```text
HoraTurno
- time
```

It should contain a valid time and follow the scheduling rules.

### `EstadoTurno`

Represents the current state of an appointment.

Possible values:

```text
SOLICITADA
CONFIRMADA
CANCELADA
```

The state should not be changed arbitrarily. It must follow the valid business transitions defined by the domain.

---

## 4. Business Invariants

The `Turno` aggregate must maintain the following business rules:

1. An appointment must have a patient.
2. An appointment must have a doctor.
3. The appointment must have a valid date and time.
4. An appointment cannot be created for an already occupied time slot.
5. A cancelled appointment cannot become confirmed again.
6. Appointment status changes must be performed through domain behavior such as `confirmar()` or `cancelar()`.
7. The aggregate must always remain in a valid state after any operation.

These invariants belong to the **domain layer**, not to the database, UI, or infrastructure.

---

## 5. Domain Events

The following domain events are proposed for the Appointment Management context.

### `TurnoSolicitado`

Generated when a patient successfully requests an appointment.

```text
TurnoSolicitado
- turnoId
- pacienteId
- medicoId
- fecha
- hora
```

### `TurnoConfirmado`

Generated when an appointment is confirmed.

```text
TurnoConfirmado
- turnoId
- pacienteId
- medicoId
- fecha
- hora
```

### `TurnoCancelado`

Generated when an appointment is cancelled.

```text
TurnoCancelado
- turnoId
- motivo
```

These events can later be used to communicate with other parts of the system without tightly coupling the domain to infrastructure.

---

## 6. Proposed Domain Model

```text
                 ┌──────────────────────┐
                 │        Turno         │
                 │   Aggregate Root     │
                 ├──────────────────────┤
                 │ id                   │
                 │ patient              │
                 │ doctor               │
                 │ date                 │
                 │ time                 │
                 │ status               │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │  Paciente  │ │   Medico   │ │  Value     │
       │   Entity   │ │   Entity   │ │  Objects   │
       └────────────┘ └────────────┘ └────────────┘
                                      │
                              ┌───────┼────────┐
                              ▼       ▼        ▼
                            Fecha   Hora    Estado
```

---

## 7. Summary

| DDD Element | Proposed Design |
|---|---|
| Bounded Context | Appointment Management |
| Aggregate Root | `Turno` |
| Entities | `Turno`, `Paciente`, `Medico` |
| Value Objects | `FechaTurno`, `HoraTurno`, `EstadoTurno` |
| Main Invariants | Valid patient, doctor, date/time, availability, and state transitions |
| Domain Events | `TurnoSolicitado`, `TurnoConfirmado`, `TurnoCancelado` |

### Important Note

The PDR explicitly identifies **Appointment Management** as a module and defines several appointment-related functional requirements. However, it does not explicitly define the DDD aggregate, entities, value objects, invariants, or domain events.

Therefore, the DDD elements above are a **proposed domain model based on the requirements and architecture described in the PDR**, rather than existing implementation details.