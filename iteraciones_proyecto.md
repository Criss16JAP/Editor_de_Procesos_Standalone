# Plan de Iteraciones: Editor de Procesos Standalone

Este documento define la planificación evolutiva del proyecto en **3 iteraciones**, delimitando el alcance funcional y técnico de cada una, y detallando su alineación y valoración respecto al **core del negocio** (los objetivos estratégicos de estandarización, validación, portabilidad y usabilidad bajo ISO/IEC/IEEE 24774).

---

## El Core del Negocio y su Valoración

El valor central del **Editor de Procesos Standalone** radica en resolver las ineficiencias de documentar procesos de software en formatos planos o plantillas manuales desestructuradas. Sus pilares fundamentales son:

1. **Estandarización Rigurosa (ISO/IEC/IEEE 24774):** Garantizar de forma nativa que los procesos adopten una jerarquía correcta sin obligar al usuario a dominar la norma.
2. **Garantía de Calidad y Completitud:** Minimizar la creación de descripciones incompletas o inconsistentes mediante un motor de validación semántica en tiempo real.
3. **Portabilidad Absoluta (Offline-First):** Facilitar el intercambio de procesos como archivos autocontenidos (`.pro`), eliminando la dependencia de servidores, bases de datos o conexión a internet.
4. **Distribución y Presentación Profesional:** Generar reportes y entregables en PDF de alta fidelidad, listos para auditorías, revisiones o docencia.

Cada iteración está priorizada para ir incrementando el cumplimiento de estos pilares, asegurando que desde la primera entrega se valide el concepto de persistencia local y estructura básica.

---

## Iteración 1: Mínimo Viable de Modelado y Persistencia Local (.pro)

### Objetivo
Establecer la base de datos en memoria y la persistencia física local. Se busca validar el flujo completo de "crear, guardar localmente en `.pro`, cargar y continuar editando" con los metadatos obligatorios y una estructura de actividades y tareas básica.

### Alcance Funcional
*   **Inicialización y Lienzo Limpio (RF-01):** Capacidad de limpiar la pantalla e iniciar un nuevo proceso en memoria.
*   **Registro de Metadatos Raíz (RF-02):** Formularios básicos para capturar el Nombre, Propósito y Resultados Esperados del proceso.
*   **Gestión de Elementos de Primer Nivel (RF-03):** Creación y eliminación de Actividades y Tareas en forma de lista secuencial.
*   **Importación y Exportación `.pro` Básica (RF-06, RF-07, RF-08):** Serialización a JSON de la estructura básica y descarga local del archivo con extensión `.pro`. Carga y reconstrucción del editor a partir del archivo.
*   **Interfaz de Usuario Básica:** Barra de herramientas superior (`MainToolbar`) y panel lateral de edición con estilos minimalistas (Slate/Blue).

### Alcance Técnico
*   Configuración inicial del proyecto con **Vite.js** y **TypeScript**.
*   Diseño e implementación del esquema de datos `IProcessFile` e `IProcessData`.
*   Creación del Store global con **Zustand** para la gestión del estado inmutable de los metadatos y listas.
*   Implementación de utilidades nativas de lectura/escritura (`FileReader`, `Blob`) para el archivo `.pro`.

### Valoración respecto al Core del Negocio
*   **Impacto:** **Alto (Fundacional)**. 
*   **Justificación:** Demuestra la viabilidad técnica de la arquitectura 100% offline y standalone sin base de datos. Resuelve el problema de la persistencia portátil (`.pro`), permitiendo que el usuario ya pueda guardar e intercambiar archivos de procesos estructurados.
*   **Métricas de Calidad (TPM):** 
    *   Tiempo de inicialización de la interfaz (TPM-01) < 1.0s.
    *   Velocidad de carga y deserialización de archivos `.pro` < 1.0s.

---

## Iteración 2: Jerarquía Estricta, Reordenamiento y Motor de Validación Semántica

### Objetivo
Elevar la calidad técnica y la usabilidad del modelador. En esta fase se implementa la jerarquía anidada completa de ISO 24774, el reordenamiento interactivo y el motor de validación que previene que el usuario cometa errores estructurales o guarde información incompleta.

### Alcance Funcional
*   **Mapeo Jerárquico Completo (RF-04):** Asociación estricta de Tareas dentro de Actividades, e incorporación de sub-elementos detallados de la norma (Entradas, Productos de Trabajo, Stakeholders, Objetivos, Controles, Restricciones).
*   **Reorganización de Secuencia (RF-05, RNF-04):** Capacidad de ordenar actividades y tareas de manera interactiva (botones de desplazamiento o arrastrar y soltar) con respuesta visual inmediata.
*   **Motor de Validación Semántica (RF-09, RF-10, RNF-03):** Ejecución asíncrona (debounced) que valida el cumplimiento de las reglas de negocio (campos obligatorios y relaciones coherentes).
*   **Bloqueo de Persistencia Inconsistente (RF-11):** Deshabilitación activa del botón de exportación `.pro` si existen errores de tipo `CRITICAL` (por ejemplo, falta de propósito o resultados esperados).
*   **Panel de Alertas y Diagnóstico:** Despliegue de mensajes en lenguaje de negocio (sin tecnicismos de código) para advertir al usuario sobre elementos incompletos (`WARNING`).

### Alcance Técnico
*   Integración de **`@dnd-kit/core`** y **`@dnd-kit/sortable`** para la manipulación inmutable de posiciones en el árbol del Store.
*   Desarrollo de la clase `ValidationEngine` con lógica determinista para analizar la estructura anidada.
*   Pruebas unitarias automatizadas con **Vitest** para garantizar la precisión de las reglas de validación ante múltiples permutaciones del árbol de datos.

### Valoración respecto al Core del Negocio
*   **Impacto:** **Muy Alto (Crítico para la Estandarización y Calidad)**.
*   **Justificación:** Esta iteración representa el verdadero valor de diferenciación frente a procesadores de texto comunes. Evita activamente la generación de procesos deficientes o desconectados mediante validación y facilita el trabajo del diseñador mediante un ordenamiento interactivo fluido.
*   **Métricas de Calidad (TPM):** 
    *   Latencia del análisis de completitud y actualización de la UI (TPM-02) < 200ms.
    *   Complejidad computacional de renderizado del árbol mantenida en $O(1)$ gracias a selectores atómicos de Zustand.

---

## Iteración 3: Previsualización Documental Reactiva y Motor PDF Vectorial

### Objetivo
Completar la experiencia del usuario proporcionando herramientas profesionales de visualización y distribución física/digital. Se crea la vista tipo hoja reactiva y se implementa la exportación vectorial a PDF con soporte de orientación dinámica.

### Alcance Funcional
*   **Vista Previa tipo Hoja (RF-12, RF-13):** Panel lateral que compila y muestra en tiempo real la descripción formateada del proceso como un documento estructurado.
*   **Configuración de Orientación de Página (RF-14):** Control visual para conmutar la hoja del reporte entre orientación horizontal y vertical.
*   **Exportación a PDF Nítido y Seleccionable (RF-15):** Compilación directa en el cliente del archivo PDF, preservando el orden, formato y orientación seleccionados, con texto real.
*   **Pulido de Experiencia de Usuario (Aesthetics):** Transiciones suaves, animaciones de hover, diseño consistente (Slate 50 / Slate 900) y soporte responsivo básico.

### Alcance Técnico
*   Integración de **`@react-pdf/renderer`** para la generación de planos PDF vectoriales en memoria (utilizando Web Workers o hilos del navegador).
*   Implementación de técnicas de división de código (*Code-Splitting* / `React.lazy`) para postergar la carga del motor PDF hasta que el usuario lo requiera, optimizando el tiempo de carga de la aplicación.

### Valoración respecto al Core del Negocio
*   **Impacto:** **Alto (Valor de Entrega y Distribución)**.
*   **Justificación:** Habilita el canal de salida oficial del producto. Un proceso modelado solo tiene valor si puede presentarse para aprobación, certificaciones o distribución académica. El PDF vectorial standalone asegura entregas profesionales sin depender de una impresora de red o software externo.
*   **Métricas de Calidad (TPM):**
    *   Tiempo total de generación y descarga del PDF (TPM-03) < 2.0s para procesos de tamaño estándar.
    *   Conservación de la fidelidad del texto al hacer zoom infinito (cero pixelación).

---

## Resumen del Plan y Cobertura de Requisitos

| Iteración | Foco Principal | Requisitos Cubiertos (RF/RNF) | Valor para el Core del Negocio | Medida de Éxito Técnica (TPM) |
| :--- | :--- | :--- | :--- | :--- |
| **Iteración 1** | Persistencia e Interfaz Base | RF-01, RF-02, RF-03, RF-06, RF-07, RF-08, RNF-01, RNF-02 | **Viabilidad e Intercambio:** Valida que el proceso pueda guardarse localmente en formato `.pro`. | TPM-01 < 1.0s / Carga .pro < 1.0s |
| **Iteración 2** | Calidad, Estructura y Validación | RF-04, RF-05, RF-09, RF-10, RF-11, RNF-03, RNF-04 | **Estandarización y Rigor:** Garantiza consistencia del proceso y previene datos vacíos. | TPM-02 < 200ms / Cero errores mutacionales |
| **Iteración 3** | Visualización, Reporte y Estética | RF-12, RF-13, RF-14, RF-15, RNF-05, RNF-06, RNF-07, RNF-08 | **Distribución y Adopción:** Facilita la generación de reportes profesionales listos para compartir. | TPM-03 < 2.0s / Carga inicial total < 2.0s |
