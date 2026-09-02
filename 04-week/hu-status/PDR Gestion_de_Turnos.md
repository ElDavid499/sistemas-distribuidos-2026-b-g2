### Integrantes:
- DAVID FELIPE PERDOMO CASTILLO
- ANDY BRAHIAM YARA MEDINA


# Preliminary Design Review (PDR) - GestionTurnosApp

## 1. Descripción General

GestionTurnosApp es una solución móvil integral para la gestión de salud personal. Permite a los usuarios administrar turnos médicos, realizar seguimiento de medicación, registrar síntomas, visualizar estadísticas de salud y almacenar estudios médicos. La aplicación está diseñada con un enfoque en la resiliencia (modo offline) y una experiencia de usuario enriquecida (animaciones, estados de carga elegantes).

## 2. Objetivos del Proyecto

### Objetivo general

Diseñar y desarrollar una aplicación móvil orientada a la gestión de información y actividades relacionadas con la salud personal, facilitando el manejo de turnos médicos, medicación, síntomas y estudios médicos desde un único entorno.

### Objetivos específicos

- Permitir la autenticación y gestión segura de los usuarios.
- Facilitar la consulta y solicitud de turnos médicos.
- Permitir el seguimiento de medicamentos y el registro de síntomas.
- Permitir almacenar y visualizar estudios médicos.
- Proporcionar estadísticas de salud mediante recursos gráficos.
- Mantener funcionalidades disponibles cuando el dispositivo no tenga conexión.
- Ofrecer una experiencia de usuario clara mediante estados de carga, animaciones y estados vacíos.

> **Nota:** Estos objetivos se incorporan como propuesta de estructuración del PDR; el documento original no los presentaba como una sección independiente.

## 3. Alcance

### Incluido

- Autenticación y registro de usuarios.
- Gestión y solicitud de turnos médicos.
- Seguimiento de medicamentos.
- Registro de síntomas.
- Visualización de estadísticas de salud.
- Almacenamiento y visualización de estudios médicos.
- Comunicación mediante chat.
- Sistema de logros.
- Funcionamiento offline mediante almacenamiento local.
- Notificaciones y herramientas de diagnóstico.

### Fuera del alcance / por definir

El documento original no especifica funcionalidades que estén explícitamente fuera del alcance. Por tanto, esta parte debe confirmarse según los requisitos definitivos del proyecto.

## 4. Arquitectura del Sistema

La aplicación sigue los principios de Clean Architecture adaptados a Android con el patrón MVVM (Model-View-ViewModel).

- **View Layer:** Utiliza Fragments y ViewBinding. La navegación es gestionada por el Jetpack Navigation Component.
- **ViewModel Layer:** Gestiona el estado de la UI (UiState) y sobrevive a cambios de configuración.
- **Data Layer (Repository Pattern):**
  - **Local:** Room Database para persistencia local. OfflineCacheManager actúa como mediador para garantizar el funcionamiento sin conexión.
  - **Remote:** Retrofit para el consumo de APIs REST.
- **DI (Dependency Injection):** Hilt para la provisión de dependencias en toda la app.

### Flujo arquitectónico propuesto

```text
Usuario
   ↓
View / Fragments
   ↓
ViewModel
   ↓
Repository
   ↓
┌───────────────────────┐
│                       │
Room Database       Retrofit / API
│                       │
└──────────┬────────────┘
           ↓
   OfflineCacheManager
```

## 5. Stack Tecnológico

- **Lenguaje:** Kotlin + Corrutinas.
- **UI/UX:** Material Components, Lottie (animaciones), Facebook Shimmer (skeleton screens), MPAndroidChart (gráficos).
- **Persistencia:** Room Database, Security Crypto (para datos sensibles en SharedPrefs).
- **Networking:** Retrofit, OkHttp, GSON.
- **Firebase:** Cloud Messaging (notificaciones), Crashlytics, Analytics.
- **Otros:** ML Kit (Reconocimiento de texto), WorkManager (tareas en segundo plano), Biometric API.

## 6. Requerimientos Funcionales

A partir de los módulos y funcionalidades descritos en el documento original, se pueden estructurar los siguientes requerimientos:

- **RF01:** El sistema debe permitir el registro e inicio de sesión de usuarios.
- **RF02:** El sistema debe permitir la verificación de la cuenta.
- **RF03:** El sistema debe permitir utilizar autenticación biométrica.
- **RF04:** El sistema debe permitir consultar los turnos médicos.
- **RF05:** El sistema debe permitir visualizar el detalle de un turno.
- **RF06:** El sistema debe permitir solicitar nuevos turnos médicos.
- **RF07:** El sistema debe permitir realizar seguimiento de medicamentos.
- **RF08:** El sistema debe permitir registrar síntomas.
- **RF09:** El sistema debe permitir visualizar estadísticas de salud.
- **RF10:** El sistema debe permitir almacenar y visualizar estudios médicos.
- **RF11:** El sistema debe contemplar el posible escaneo de estudios mediante ML Kit.
- **RF12:** El sistema debe proporcionar un sistema de chat integrado.
- **RF13:** El sistema debe proporcionar un sistema de logros (Achievements).
- **RF14:** El sistema debe mantener información disponible localmente para permitir el funcionamiento offline.

> Estos requerimientos son una formalización de las funcionalidades descritas en el documento fuente, no requisitos nuevos confirmados por el equipo.

## 7. Requerimientos No Funcionales

Con base en las características técnicas ya descritas, se proponen los siguientes:

- **RNF01 - Usabilidad:** La interfaz debe proporcionar estados de carga y estados vacíos consistentes.
- **RNF02 - Compatibilidad:** La aplicación debe soportar dispositivos desde SDK 24 y estar optimizada para Android 15 (SDK 35).
- **RNF03 - Seguridad:** Los datos sensibles deben utilizar mecanismos de protección como Security Crypto y autenticación biométrica.
- **RNF04 - Disponibilidad offline:** Las funcionalidades que dependan de información local deben poder operar sin conexión cuando los datos estén disponibles en Room.
- **RNF05 - Mantenibilidad:** La arquitectura debe conservar la separación de responsabilidades mediante Clean Architecture, MVVM y Repository Pattern.
- **RNF06 - Observabilidad:** La aplicación debe utilizar Crashlytics y Analytics para diagnóstico y análisis.
- **RNF07 - Rendimiento percibido:** Shimmer y Lottie deben contribuir a una experiencia de carga y navegación más fluida.

## 8. Módulos y Funcionalidades Clave

1. **Módulo de Autenticación:** Login, Registro, Verificación de cuenta y seguridad biométrica.
2. **Gestión de Turnos:** Listado, detalle y solicitud de nuevos turnos médicos.
3. **Salud y Medicación:** Seguimiento de medicamentos, registro de síntomas y estadísticas de salud.
4. **Estudios Médicos:** Almacenamiento y visualización de resultados (posible escaneo con ML Kit).
5. **Comunicación:** Sistema de chat integrado.
6. **Gamificación:** Sistema de logros (Achievements) para incentivar el uso.

## 9. Modelo de Datos

El documento original confirma el uso de Room Database y la implementación de DAOs para las entidades del dominio, pero no presenta un modelo de datos completo ni las relaciones entre entidades.

Como estructura conceptual inicial, se puede representar:

```text
Usuario
 ├── Turnos
 ├── Medicamentos
 ├── Síntomas
 └── Estudios Médicos
```

Para una versión definitiva del PDR se recomienda agregar el diagrama ER o UML real de las entidades implementadas en el proyecto.

## 10. Diseño de Interfaz (UI/UX)

- **Skeleton Screens:** Implementado mediante Shimmer para mejorar la percepción de velocidad de carga (`fragment_home_skeleton`, `item_turno_skeleton`).
- **Empty States:** Gestión consistente de estados vacíos (`layout_empty_state`).
- **Responsividad:** Diseñado para soportar dispositivos con SDK 24 en adelante, optimizado para Android 15 (SDK 35).

## 11. Flujos Principales de Usuario

### Solicitud de turno

```text
Inicio de sesión
      ↓
Pantalla principal
      ↓
Gestión de turnos
      ↓
Consultar turnos
      ↓
Seleccionar / solicitar turno
      ↓
Confirmación
```

### Consulta de información de salud

```text
Inicio
  ↓
Módulo de salud
  ↓
Medicamentos / Síntomas / Estadísticas
  ↓
Consulta de información
```

> Los flujos anteriores son una representación propuesta a partir de las funcionalidades descritas; el documento original no incluía diagramas de flujo.

## 12. Seguridad

La aplicación incorpora mecanismos orientados a la protección de información sensible:

- Security Crypto para datos sensibles.
- Biometric API para autenticación biométrica.
- Retrofit y OkHttp para comunicación con servicios remotos.
- Firebase Crashlytics para diagnóstico de errores.

Se recomienda documentar en la versión final qué datos se consideran sensibles, cómo se almacenan y qué mecanismos se utilizan para proteger la comunicación con la API.

## 13. Estrategia Offline / Online

La aplicación contempla funcionamiento sin conexión mediante Room Database y `OfflineCacheManager`.

```text
                    ┌───────────────┐
                    │ Usuario       │
                    └───────┬───────┘
                            ↓
                     Aplicación móvil
                            ↓
                    ¿Hay conexión?
                     ↙             ↘
                   NO               SÍ
                   ↓                ↓
             Room / Cache       Retrofit / API
                   ↓                ↓
              Uso local       Datos remotos
                   └───────┬────────┘
                           ↓
                  Sincronización
```

El documento original identifica como riesgo la complejidad de sincronizar `OfflineCacheManager` cuando cambia frecuentemente la lógica de negocio remota. Por ello, la estrategia concreta de sincronización debe documentarse antes de la versión final.

## 14. Estado Actual y Riesgos

- **Estado:** La app se encuentra en una versión "PREMIUM" (1.0.5), lo que sugiere una madurez funcional avanzada.
- **Observaciones:**
  - Uso de MPAndroidChart mediante AAR local (posible limitación de red durante la compilación).
  - Implementación robusta de DAOs para casi todas las entidades del dominio.

### Riesgos Potenciales

| Riesgo | Probabilidad | Impacto | Mitigación propuesta |
|---|---|---|---|
| Complejidad en la sincronización de OfflineCacheManager | Alta | Alto | Definir una estrategia de sincronización y resolución de conflictos |
| Gestión de archivos pesados de estudios médicos | Media | Alto | Controlar tamaño, almacenamiento y procesamiento de archivos |
| Uso de MPAndroidChart mediante AAR local | Media | Medio | Evaluar dependencia remota o documentar el AAR requerido |

> La probabilidad, impacto y mitigaciones de esta tabla son una propuesta para estructurar los riesgos; el documento original solo identifica los riesgos, no les asigna estos niveles.

## 15. Plan de Pruebas

Para completar el PDR se recomienda contemplar:

- **Pruebas unitarias:** Validación de ViewModels, repositorios y lógica de negocio.
- **Pruebas de integración:** Comunicación entre Repository, Room y Retrofit.
- **Pruebas de UI:** Validación de navegación, formularios, estados de carga y estados vacíos.
- **Pruebas offline:** Comprobar el comportamiento sin conexión y la posterior sincronización.
- **Pruebas de seguridad:** Validar autenticación biométrica y protección de información sensible.
- **Pruebas de rendimiento:** Evaluar tiempos de respuesta, carga de información y manejo de archivos.

## 16. Criterios de Aceptación

Los criterios definitivos deben ser validados con los requisitos del proyecto. Como base:

- El usuario puede registrarse e iniciar sesión correctamente.
- El usuario puede consultar y solicitar turnos.
- El usuario puede gestionar medicamentos y síntomas.
- El usuario puede consultar estadísticas de salud.
- El usuario puede almacenar y visualizar estudios médicos.
- Las funciones que dependan de datos locales continúan disponibles sin conexión.
- La aplicación presenta correctamente los estados de carga y estados vacíos.
- La información sensible utiliza los mecanismos de seguridad definidos.

## 17. Diseño de Implementación y Roadmap

Una posible organización por fases es:

```text
Fase 1 → Autenticación y seguridad
Fase 2 → Gestión de turnos
Fase 3 → Medicación, síntomas y estadísticas
Fase 4 → Estudios médicos
Fase 5 → Chat y gamificación
Fase 6 → Offline / sincronización
Fase 7 → Pruebas y correcciones
Fase 8 → Preparación de versión final
```

> Este roadmap es una propuesta de organización y no aparece definido en el documento original.

## 18. Métricas y Seguimiento

Para una versión más completa del PDR se pueden considerar:

- Tasa de errores reportados mediante Crashlytics.
- Tiempo de respuesta de las operaciones principales.
- Porcentaje de operaciones realizadas correctamente sin conexión.
- Tasa de sincronizaciones exitosas.
- Uso de los módulos principales.
- Incidencias detectadas durante las pruebas.

Las métricas concretas y sus valores objetivo deben ser definidos por el equipo.

## 19. Trabajo Futuro

Como líneas de trabajo futuro se pueden considerar:

- Mejorar la estrategia de sincronización offline/online.
- Optimizar el manejo de archivos médicos pesados.
- Fortalecer las pruebas automatizadas.
- Ampliar las capacidades de análisis y estadísticas.
- Mejorar continuamente la experiencia de usuario.
- Revisar las dependencias y mecanismos de compilación, especialmente el uso del AAR local de MPAndroidChart.

## 20. Conclusión

El diseño preliminar muestra una aplicación robusta, bien estructurada y que sigue las mejores prácticas modernas de desarrollo Android. La separación de responsabilidades y la integración de herramientas de diagnóstico (Crashlytics) y UX (Shimmer/Lottie) la posicionan como un producto de alta calidad.

El diseño también presenta una arquitectura orientada a la mantenibilidad, con MVVM, Clean Architecture, Repository Pattern, Hilt y persistencia local mediante Room. La capacidad offline y los mecanismos de seguridad constituyen elementos importantes del diseño. Para avanzar hacia una versión final del PDR, es necesario validar los requerimientos, completar los diagramas técnicos y definir con mayor precisión las estrategias de sincronización, pruebas, aceptación y despliegue.

## 21. Resumen de los Puntos Clave

- **Arquitectura:** Sigue un patrón MVVM sólido con Hilt para inyección de dependencias y Repository Pattern para la gestión de datos.
- **Capacidad Offline:** Implementa un OfflineCacheManager y múltiples DAOs en Room, lo que garantiza que la app sea funcional sin conexión.
- **Experiencia de Usuario (UX):** Uso avanzado de Shimmer para skeletons de carga, Lottie para animaciones y MPAndroidChart para visualización de datos de salud.
- **Seguridad:** Integración de Biometric API y Security Crypto para la protección de datos sensibles.
- **Stack Moderno:** Preparada para Android 15 (SDK 35) utilizando Kotlin Coroutines, ViewBinding y Jetpack Navigation.
