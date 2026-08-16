# Preliminary Design Review (PDR) - GestionTurnosApp

## 1. Descripción General

GestionTurnosApp es una solución móvil integral para la gestión de salud personal. Permite a los usuarios administrar turnos médicos, realizar seguimiento de medicación, registrar síntomas, visualizar estadísticas de salud y almacenar estudios médicos. La aplicación está diseñada con un enfoque en la resiliencia (modo offline) y una experiencia de usuario enriquecida (animaciones, estados de carga elegantes).

## 2. Arquitectura del Sistema

La aplicación sigue los principios de Clean Architecture adaptados a Android con el patrón MVVM (Model-View-ViewModel).

- **View Layer:** Utiliza `Fragments` y `ViewBinding`. La navegación es gestionada por el `Jetpack Navigation Component`.
- **ViewModel Layer:** Gestiona el estado de la UI (`UiState`) y sobrevive a cambios de configuración.
- **Data Layer (Repository Pattern):**
  - **Local:** `Room Database` para persistencia local. `OfflineCacheManager` actúa como mediador para garantizar el funcionamiento sin conexión.
  - **Remote:** `Retrofit` para el consumo de APIs REST.
- **DI (Dependency Injection):** `Hilt` para la provisión de dependencias en toda la app.

## 3. Stack Tecnológico

- **Lenguaje:** `Kotlin` + Corrutinas.
- **UI/UX:** `Material Components`, `Lottie` (animaciones), `Facebook Shimmer` (skeleton screens), `MPAndroidChart` (gráficos).
- **Persistencia:** `Room Database`, `Security Crypto` (para datos sensibles en `SharedPrefs`).
- **Networking:** `Retrofit`, `OkHttp`, `GSON`.
- **Firebase:** Cloud Messaging (notificaciones), `Crashlytics`, `Analytics`.
- **Otros:** `ML Kit` (Reconocimiento de texto), `WorkManager` (tareas en segundo plano), `Biometric API`.

## 4. Módulos y Funcionalidades Clave

1. **Módulo de Autenticación:** Login, Registro, Verificación de cuenta y seguridad biométrica.
2. **Gestión de Turnos:** Listado, detalle y solicitud de nuevos turnos médicos.
3. **Salud y Medicación:** Seguimiento de medicamentos, registro de síntomas y estadísticas de salud.
4. **Estudios Médicos:** Almacenamiento y visualización de resultados (posible escaneo con `ML Kit`).
5. **Comunicación:** Sistema de chat integrado.
6. **Gamificación:** Sistema de logros (Achievements) para incentivar el uso.

## 5. Diseño de Interfaz (UI/UX)

- **Skeleton Screens:** Implementado mediante Shimmer para mejorar la percepción de velocidad de carga (`fragment_home_skeleton`, `item_turno_skeleton`).
- **Empty States:** Gestión consistente de estados vacíos (`layout_empty_state`).
- **Responsividad:** Diseñado para soportar dispositivos con SDK 24 en adelante, optimizado para Android 15 (SDK 35).

## 6. Estado Actual y Riesgos

- **Estado:** La app se encuentra en una versión "PREMIUM" (1.0.5), lo que sugiere una madurez funcional avanzada.

### Observaciones

- Uso de `MPAndroidChart` mediante AAR local (posible limitación de red durante la compilación).
- Implementación robusta de DAOs para casi todas las entidades del dominio.

### Riesgos Potenciales

- Complejidad en la sincronización del `OfflineCacheManager` si la lógica de negocio remota cambia frecuentemente.
- Gestión de archivos pesados (estudios médicos) en el almacenamiento local (`ImageStorageManager`).

## 7. Conclusión

El diseño preliminar muestra una aplicación robusta, bien estructurada y que sigue las mejores prácticas modernas de desarrollo Android. La separación de responsabilidades y la integración de herramientas de diagnóstico (`Crashlytics`) y UX (Shimmer/Lottie) la posicionan como un producto de alta calidad.

## Resumen de los puntos clave

- **Arquitectura:** Sigue un patrón MVVM sólido con `Hilt` para inyección de dependencias y Repository Pattern para la gestión de datos.
- **Capacidad Offline:** Implementa un `OfflineCacheManager` y múltiples DAOs en `Room`, lo que garantiza que la app sea funcional sin conexión.
- **Experiencia de Usuario (UX):** Uso avanzado de Shimmer para skeletons de carga, Lottie para animaciones y `MPAndroidChart` para visualización de datos de salud.
- **Seguridad:** Integración de `Biometric API` y Security Crypto para la protección de datos sensibles.
- **Stack Moderno:** Preparada para Android 15 (SDK 35) utilizando Kotlin Coroutines, ViewBinding y Jetpack Navigation.
