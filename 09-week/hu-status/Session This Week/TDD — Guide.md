# TDD — Test-Driven Development

**Proyecto:** Salud Activa / GestionTurnosApp  
**Área:** Desarrollo de Software  
**Metodología:** Test-Driven Development (TDD)  
**Módulo de referencia:** Gestión de Citas  
**Backend:** Node.js / Express  
**Base de datos:** PostgreSQL  
**Cliente:** Android  

---

## 1. Introducción

**Test-Driven Development (TDD)**, o **Desarrollo Guiado por Pruebas**, es una práctica de desarrollo de software en la que las pruebas se escriben antes de implementar la funcionalidad que se desea desarrollar.

El objetivo principal de TDD es utilizar las pruebas como una guía para construir el software. En lugar de desarrollar primero todo el código y comprobarlo posteriormente, se define primero el comportamiento esperado, se crea una prueba que inicialmente falla y después se desarrolla la implementación necesaria para que dicha prueba pase.

TDD sigue un ciclo corto y repetitivo:

```text
RED → GREEN → REFACTOR
```

Cada etapa tiene un propósito específico:

- **RED:** crear una prueba que falle.
- **GREEN:** implementar la solución mínima para que la prueba pase.
- **REFACTOR:** mejorar el código manteniendo el comportamiento comprobado.

Este ciclo se repite cada vez que se desarrolla una nueva funcionalidad o regla de negocio.

---

# 2. TDD aplicado a Salud Activa

En **Salud Activa / GestionTurnosApp**, TDD puede utilizarse para verificar las funcionalidades relacionadas con la gestión de citas médicas.

El sistema permite que los pacientes interactúen con profesionales de salud para gestionar sus citas. Por esta razón, existen reglas de negocio que deben cumplirse para evitar información incorrecta o conflictos de horarios.

Una de las reglas principales es:

> Un profesional no debe tener dos citas asignadas para el mismo horario.

Esta regla puede convertirse en una prueba automatizada y utilizarse como guía durante el desarrollo.

El flujo general es:

```text
Paciente
   │
   ▼
Selecciona profesional
   │
   ▼
Selecciona fecha y hora
   │
   ▼
Solicita cita
   │
   ▼
API REST
   │
   ▼
Validaciones
   │
   ▼
Reglas de negocio
   │
   ▼
Verificar disponibilidad
   │
   ├───────────────┐
   │               │
Disponible      Ocupado
   │               │
   ▼               ▼
Crear cita      Rechazar
   │
   ▼
PostgreSQL
```

---

# 3. Objetivo

El objetivo de aplicar TDD en el módulo de Gestión de Citas es garantizar que el comportamiento esperado del sistema esté definido mediante pruebas automatizadas antes de considerar terminada una funcionalidad.

Con TDD se busca comprobar principalmente:

1. Que una cita válida pueda ser creada.
2. Que los datos obligatorios sean validados.
3. Que el paciente exista.
4. Que el profesional exista.
5. Que el horario esté disponible.
6. Que no se permitan reservas duplicadas.
7. Que los errores sean manejados correctamente.
8. Que los cambios posteriores no rompan funcionalidades existentes.

---

# 4. Historia de usuario

El desarrollo TDD parte de una historia de usuario del módulo de citas.

## HU — Agendar una cita

> **Como paciente, quiero agendar una cita con un profesional de salud en un horario disponible, para poder recibir atención médica.**

Esta historia representa el comportamiento que se desea implementar.

A partir de ella se pueden identificar los criterios de aceptación y convertirlos posteriormente en pruebas.

---

# 5. Criterios de aceptación

### CA-01 — Crear una cita

**Dado** un paciente existente, un profesional existente y un horario disponible,

**cuando** el paciente solicite la cita,

**entonces** el sistema debe crear la cita correctamente.

---

### CA-02 — Evitar doble reserva

**Dado** que existe una cita para un profesional en una fecha y hora determinadas,

**cuando** otro paciente intente reservar el mismo profesional en el mismo horario,

**entonces** el sistema debe rechazar la solicitud.

---

### CA-03 — Validar paciente

**Dado** un identificador de paciente que no existe,

**cuando** se intente crear una cita,

**entonces** el sistema debe rechazar la operación.

---

### CA-04 — Validar profesional

**Dado** un identificador de profesional que no existe,

**cuando** se intente crear una cita,

**entonces** el sistema debe rechazar la operación.

---

### CA-05 — Validar información obligatoria

**Dado** que la solicitud contiene información incompleta,

**cuando** se intente crear una cita,

**entonces** el sistema debe devolver un error de validación y no crear la cita.

---

# 6. Reglas de negocio

Los criterios de aceptación se pueden convertir en reglas de negocio.

| ID | Regla |
|---|---|
| RN-01 | El paciente debe existir. |
| RN-02 | El profesional debe existir. |
| RN-03 | La fecha de la cita es obligatoria. |
| RN-04 | La hora de la cita es obligatoria. |
| RN-05 | El horario solicitado debe estar disponible. |
| RN-06 | No se permite una doble reserva para el mismo profesional, fecha y hora. |
| RN-07 | Una cita válida debe quedar registrada. |
| RN-08 | Una solicitud inválida no debe crear registros. |

Estas reglas son importantes porque permiten transformar los requisitos del sistema en comportamientos verificables.

---

# 7. ¿Cómo funciona TDD?

TDD utiliza tres etapas:

```text
       ┌───────────┐
       │    RED    │
       │ Crear test│
       │  que falla│
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │   GREEN   │
       │ Implementar│
       │  solución  │
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │  REFACTOR │
       │ Mejorar el│
       │   código  │
       └─────┬─────┘
             │
             └──────────────► Repetir
```

El ciclo debe realizarse de manera continua y con cambios pequeños.

---

# 8. Etapa RED

## ¿Qué significa RED?

RED significa que la prueba debe fallar.

En esta etapa todavía no se implementa la funcionalidad completa.

Primero se define qué comportamiento se espera.

Por ejemplo:

> El sistema debe permitir crear una cita cuando el paciente, el profesional y el horario sean válidos.

Se escribe una prueba para representar ese comportamiento.

Inicialmente la prueba debe fallar:

```text
TDD-01
Crear cita válida

Resultado:
❌ FAIL
```

Esto es correcto porque la funcionalidad todavía no está implementada.

### ¿Por qué debe fallar?

Porque una de las características principales de TDD es demostrar que la prueba realmente está comprobando algo nuevo.

Si la prueba pasa antes de realizar la implementación, puede indicar que:

- la prueba no está validando correctamente;
- el comportamiento ya existía;
- la prueba no está conectada con la funcionalidad esperada.

---

# 9. Etapa GREEN

## ¿Qué significa GREEN?

Después de crear una prueba que falla, se implementa la cantidad mínima de código necesaria para hacer que la prueba pase.

Por ejemplo:

```text
Prueba
  │
  ▼
Validar información
  │
  ▼
Validar paciente
  │
  ▼
Validar profesional
  │
  ▼
Verificar disponibilidad
  │
  ▼
Crear cita
```

Una vez implementado el comportamiento esperado:

```text
TDD-01
Crear cita válida

Resultado:
✅ PASS
```

En esta etapa no se busca crear una implementación excesivamente compleja.

El objetivo es satisfacer el comportamiento definido por la prueba.

---

# 10. Etapa REFACTOR

## ¿Qué significa REFACTOR?

Cuando las pruebas pasan, se puede mejorar el código sin modificar el comportamiento que las pruebas están comprobando.

Algunas actividades de refactorización son:

- mejorar nombres de variables;
- separar responsabilidades;
- eliminar código duplicado;
- organizar funciones;
- mejorar la estructura de servicios;
- mejorar el manejo de errores;
- simplificar lógica innecesaria.

Después del refactor se ejecutan nuevamente las pruebas.

```text
Antes:

TDD-01 → ✅ PASS

Refactorización

Después:

TDD-01 → ✅ PASS
```

La regla principal es:

> **La refactorización no debe cambiar el comportamiento esperado.**

---

# 11. Primer caso de prueba — Crear una cita

## TDD-01

### Objetivo

Comprobar que un paciente pueda crear una cita cuando todos los datos son válidos y existe disponibilidad.

### Datos

```text
Paciente:      válido
Profesional:   válido
Fecha:         válida
Hora:           disponible
```

### Comportamiento

```text
Paciente solicita cita
        │
        ▼
Validar datos
        │
        ▼
Verificar disponibilidad
        │
        ▼
Crear cita
        │
        ▼
Operación exitosa
```

### Resultado esperado

```text
Cita creada correctamente
```

Este caso representa el camino exitoso de la funcionalidad.

---

# 12. Segundo caso de prueba — Evitar doble reserva

## TDD-02

### Objetivo

Comprobar que el sistema no permita dos citas para el mismo profesional en el mismo horario.

### Situación inicial

Existe:

```text
Profesional: professional-001
Fecha:       2026-10-05
Hora:        10:00
```

Un segundo paciente intenta solicitar:

```text
Profesional: professional-001
Fecha:       2026-10-05
Hora:        10:00
```

### Flujo esperado

```text
Nueva solicitud
      │
      ▼
Buscar cita existente
      │
      ▼
¿Existe una cita?
      │
      ├── Sí
      │
      ▼
Rechazar solicitud
```

El sistema debe evitar que la segunda cita sea registrada.

Este caso es importante porque protege una regla fundamental del módulo de gestión de citas.

---

# 13. Tercer caso de prueba — Paciente inexistente

## TDD-03

### Objetivo

Verificar que no se pueda crear una cita utilizando un paciente que no existe.

### Ejemplo

```text
patientId = patient-999
```

El sistema debe verificar la existencia del paciente antes de registrar la cita.

```text
Solicitud
   │
   ▼
Buscar paciente
   │
   ▼
¿Existe?
   │
   ├── NO
   │
   ▼
Rechazar
```

No debe crearse ningún registro de cita.

---

# 14. Cuarto caso de prueba — Profesional inexistente

## TDD-04

### Objetivo

Comprobar que no se pueda crear una cita con un profesional inexistente.

```text
professionalId = professional-999
```

El flujo esperado es:

```text
Solicitud
   │
   ▼
Buscar profesional
   │
   ▼
¿Existe?
   │
   ├── NO
   │
   ▼
Rechazar solicitud
```

La cita no debe almacenarse.

---

# 15. Quinto caso de prueba — Datos incompletos

## TDD-05

### Objetivo

Verificar que el sistema rechace solicitudes que no contengan la información necesaria.

Ejemplo:

```json
{
  "patientId": "patient-001",
  "professionalId": "professional-001",
  "date": "",
  "time": ""
}
```

El sistema debe detectar la información faltante antes de intentar guardar la cita.

```text
Datos incompletos
       │
       ▼
Validación
       │
       ▼
❌ Solicitud rechazada
       │
       ▼
No crear registro
```

---

# 16. Matriz de pruebas

| ID | Escenario | Resultado esperado |
|---|---|---|
| TDD-01 | Crear cita válida | Cita creada |
| TDD-02 | Intentar doble reserva | Solicitud rechazada |
| TDD-03 | Paciente inexistente | Solicitud rechazada |
| TDD-04 | Profesional inexistente | Solicitud rechazada |
| TDD-05 | Datos incompletos | Error de validación |

Esta matriz permite relacionar las pruebas con los comportamientos principales del módulo.

---

# 17. TDD y arquitectura del sistema

Salud Activa utiliza una arquitectura en la que diferentes componentes participan en el procesamiento de una cita.

Una representación simplificada es:

```text
┌──────────────────────────┐
│     Android / Cliente    │
│       Jetpack Compose    │
└────────────┬─────────────┘
             │
             │ HTTP / REST
             ▼
┌──────────────────────────┐
│      Node.js / Express   │
│                          │
│      API REST            │
│          │               │
│    ┌─────┴─────┐         │
│    │           │         │
│Controller   Service      │
│    │           │         │
│    └─────┬─────┘         │
└──────────┼───────────────┘
           │
           ▼
┌──────────────────────────┐
│        PostgreSQL        │
└──────────────────────────┘
```

TDD permite comprobar el comportamiento de estos componentes en diferentes niveles.

---

# 18. Pruebas unitarias

Las pruebas unitarias verifican una unidad pequeña del sistema de forma aislada.

Por ejemplo, la lógica encargada de comprobar la disponibilidad:

```text
AppointmentService
        │
        ▼
checkAvailability()
```

Puede comprobar:

```text
Horario disponible → true
Horario ocupado    → false
```

La ventaja es que un error en esta lógica puede detectarse sin tener que ejecutar toda la aplicación.

---

# 19. Pruebas de integración

Las pruebas de integración comprueban la interacción entre varios componentes.

Para una cita se puede representar así:

```text
API
 │
 ▼
Controller
 │
 ▼
Service
 │
 ▼
Repository
 │
 ▼
PostgreSQL
```

Una prueba de integración puede verificar que una solicitud recibida por la API termine correctamente en la base de datos cuando todos los datos son válidos.

También puede verificar que una operación inválida no produzca un registro.

---

# 20. TDD y API REST

El TDD también debe estar relacionado con el contrato de la API.

Por ejemplo, para la creación de una cita:

```http
POST /appointments
```

Con una solicitud conceptual:

```json
{
  "patientId": "patient-001",
  "professionalId": "professional-001",
  "date": "2026-10-05",
  "time": "10:00"
}
```

El flujo esperado es:

```text
POST /appointments
        │
        ▼
Validar request
        │
        ▼
Aplicar reglas de negocio
        │
        ▼
Comprobar disponibilidad
        │
        ▼
Guardar información
        │
        ▼
Enviar respuesta
```

Las pruebas deben mantenerse alineadas con el contrato API definido para el proyecto.

---

# 21. TDD y base de datos

La base de datos también forma parte del comportamiento que debe protegerse.

Cuando una cita es válida:

```text
Solicitud válida
      │
      ▼
Reglas cumplidas
      │
      ▼
Guardar cita
      │
      ▼
PostgreSQL
```

Cuando la solicitud es inválida:

```text
Solicitud inválida
      │
      ▼
Validación
      │
      ▼
Rechazar
      │
      X
No guardar
```

Esto permite verificar que los errores de validación o de reglas de negocio no terminen generando información incorrecta.

---

# 22. Manejo de errores

TDD no debe comprobar solamente los casos exitosos.

También debe comprobar los escenarios en los que una operación no puede completarse.

Los principales casos son:

| Situación | Comportamiento |
|---|---|
| Datos incompletos | Rechazar solicitud |
| Paciente inexistente | Rechazar solicitud |
| Profesional inexistente | Rechazar solicitud |
| Horario ocupado | Rechazar solicitud |
| Datos válidos | Crear cita |

Los códigos HTTP concretos deben corresponder al contrato API definido para el proyecto.

Por ejemplo, un conflicto de horario puede representarse conceptualmente como:

```text
409 Conflict
```

si ese es el código establecido por el contrato.

---

# 23. TDD y regresiones

Una **regresión** ocurre cuando un cambio realizado en el sistema provoca que una funcionalidad que anteriormente funcionaba deje de hacerlo.

TDD ayuda a detectar estos problemas porque las pruebas permanecen en el proyecto.

Por ejemplo:

```text
TDD-01 → ✅ PASS
TDD-02 → ✅ PASS
TDD-03 → ✅ PASS
TDD-04 → ✅ PASS
TDD-05 → ✅ PASS
```

Después de modificar el sistema:

```text
TDD-01 → ✅ PASS
TDD-02 → ❌ FAIL
TDD-03 → ✅ PASS
TDD-04 → ✅ PASS
TDD-05 → ✅ PASS
```

El fallo de TDD-02 indica que el cambio afectó la regla relacionada con la doble reserva.

Esto permite detectar el problema antes de integrar la modificación al sistema.

---

# 24. Evidencia del proceso TDD

Para demostrar la aplicación de TDD es importante conservar evidencia de las tres etapas.

## RED

Debe existir evidencia de que la prueba inicialmente falló.

```text
Crear prueba
     ↓
Ejecutar
     ↓
❌ FAIL
```

La evidencia puede incluir:

- resultado de la terminal;
- captura de ejecución;
- commit;
- Pull Request.

---

## GREEN

Después de implementar la funcionalidad:

```text
Implementar
     ↓
Ejecutar pruebas
     ↓
✅ PASS
```

Esta evidencia demuestra que la implementación satisface el comportamiento definido.

---

## REFACTOR

Después de mejorar la estructura del código:

```text
Refactorizar
     ↓
Ejecutar pruebas
     ↓
✅ PASS
```

Esto demuestra que el código pudo ser mejorado sin romper el comportamiento existente.

---

# 25. Relación con Git y Pull Requests

TDD también puede integrarse al flujo de trabajo del proyecto.

Un flujo posible es:

```text
Crear rama
    │
    ▼
Definir prueba
    │
    ▼
RED
    │
    ▼
Implementar
    │
    ▼
GREEN
    │
    ▼
REFACTOR
    │
    ▼
Ejecutar pruebas
    │
    ▼
Commit
    │
    ▼
Pull Request
    │
    ▼
Revisión
```

De esta manera, el Pull Request puede incluir tanto la implementación como las pruebas que demuestran el comportamiento esperado.

---

# 26. TDD y Definition of Done

La aplicación de TDD puede formar parte de la **Definition of Done (DoD)**.

Una historia relacionada con citas no debería considerarse terminada solamente porque el código fue escrito.

Como mínimo, debe verificarse que:

- [ ] La funcionalidad está implementada.
- [ ] Los criterios de aceptación están cubiertos.
- [ ] Las pruebas correspondientes existen.
- [ ] Las pruebas pasan.
- [ ] Los casos de error están cubiertos.
- [ ] Se verificó la regla de doble reserva.
- [ ] El refactor no rompió las pruebas.
- [ ] La implementación mantiene coherencia con el contrato API.
- [ ] Los cambios están listos para revisión.

---

# 27. TDD como documentación ejecutable

Una prueba automatizada puede funcionar también como una descripción concreta del comportamiento esperado.

Por ejemplo:

```text
TDD-01
Crear una cita con datos válidos
```

describe una regla del sistema.

Mientras que:

```text
TDD-02
Rechazar una cita cuando el horario ya está ocupado
```

documenta otra regla importante.

Por esta razón, las pruebas no solamente sirven para encontrar errores. También ayudan a mantener documentado el comportamiento esperado del sistema.

---

# 28. Buenas prácticas para aplicar TDD

Para aplicar TDD correctamente en Salud Activa se recomienda:

### 1. Trabajar con cambios pequeños

Cada prueba debe representar un comportamiento concreto.

### 2. Probar comportamientos

Las pruebas deben verificar lo que el sistema debe hacer, no solamente detalles internos de implementación.

### 3. Mantener pruebas independientes

Una prueba no debería depender innecesariamente de otra.

### 4. Probar casos positivos y negativos

No solamente se debe comprobar que una cita pueda crearse, sino también que las solicitudes inválidas sean rechazadas.

### 5. Ejecutar las pruebas frecuentemente

Después de realizar cambios importantes se deben volver a ejecutar.

### 6. No ignorar pruebas fallidas

Una prueba fallida debe investigarse antes de continuar.

### 7. Mantener alineación con los requisitos

Las pruebas deben corresponder a historias de usuario, criterios de aceptación y reglas de negocio reales.

---

# 29. Flujo completo de TDD para Gestión de Citas

El proceso completo puede representarse así:

```text
                Historia de usuario
                       │
                       ▼
               Criterios de aceptación
                       │
                       ▼
                Regla de negocio
                       │
                       ▼
                  Crear prueba
                       │
                       ▼
                     RED
                ❌ Prueba falla
                       │
                       ▼
             Implementar funcionalidad
                       │
                       ▼
                    GREEN
                ✅ Prueba pasa
                       │
                       ▼
                   REFACTOR
                       │
                       ▼
                Ejecutar pruebas
                       │
             ┌─────────┴─────────┐
             │                   │
        Todas pasan          Alguna falla
             │                   │
             ▼                   ▼
      Continuar desarrollo    Corregir
             │
             ▼
          Commit
             │
             ▼
       Pull Request
```

---

# 30. Matriz de trazabilidad

La relación entre los requisitos y las pruebas puede mantenerse mediante una matriz de trazabilidad.

| Requisito | Criterio | Prueba | Resultado esperado |
|---|---|---|---|
| RN-01 | CA-03 | TDD-03 | Paciente debe existir |
| RN-02 | CA-04 | TDD-04 | Profesional debe existir |
| RN-03 | CA-05 | TDD-05 | Validar datos |
| RN-04 | CA-02 | TDD-02 | Evitar doble reserva |
| RN-07 | CA-01 | TDD-01 | Crear cita válida |

Esta relación permite demostrar que las pruebas no fueron creadas de manera aleatoria, sino que corresponden directamente a requisitos del sistema.

---

# 31. Criterios para considerar terminado el TDD

La implementación de TDD para la funcionalidad se considera completa cuando:

- [ ] Cada comportamiento importante tiene una prueba.
- [ ] Las pruebas están relacionadas con los criterios de aceptación.
- [ ] Las reglas de negocio tienen cobertura.
- [ ] Se realizó el ciclo RED.
- [ ] Se realizó el ciclo GREEN.
- [ ] Se realizó el REFACTOR.
- [ ] Las pruebas continúan pasando después del refactor.
- [ ] Se cubren escenarios exitosos.
- [ ] Se cubren escenarios de error.
- [ ] Se verifica la prevención de doble reserva.
- [ ] Se verifica la validación de datos.
- [ ] Se verifica la interacción con los componentes correspondientes.
- [ ] Las pruebas pueden ejecutarse nuevamente después de cambios posteriores.

---

# 32. Resumen

TDD en **Salud Activa / GestionTurnosApp** consiste en utilizar pruebas automatizadas como guía para desarrollar y mantener las funcionalidades del sistema.

Para el módulo de Gestión de Citas, el proceso parte de una historia de usuario y sus criterios de aceptación. Estos se transforman en reglas de negocio y posteriormente en casos de prueba.

El ciclo utilizado es:

```text
RED
↓
Crear una prueba que falla

GREEN
↓
Implementar lo necesario para que pase

REFACTOR
↓
Mejorar el código sin cambiar su comportamiento
```

Este proceso se repite para cada comportamiento que se quiera incorporar.

Las pruebas propuestas para el módulo son:

```text
TDD-01 → Crear cita válida
TDD-02 → Evitar doble reserva
TDD-03 → Validar paciente
TDD-04 → Validar profesional
TDD-05 → Validar datos obligatorios
```

De esta manera, TDD permite relacionar directamente:

```text
Historia de Usuario
        ↓
Criterios de aceptación
        ↓
Reglas de negocio
        ↓
Casos de prueba
        ↓
Implementación
        ↓
RED → GREEN → REFACTOR
        ↓
Validación
        ↓
Definition of Done
```

La aplicación de este enfoque permite que el comportamiento esperado de **Salud Activa / GestionTurnosApp** esté respaldado por pruebas y que los cambios futuros puedan verificarse de forma repetible.