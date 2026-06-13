# INFORME DE LÍMITES DEL SISTEMA (OUTCOME B)

Este documento define formalmente los límites del sistema (alcance y exclusiones) para el Editor de Procesos Standalone, dando cumplimiento a las actividades de análisis de requisitos especificadas en el proceso de desarrollo de software de la norma ISO 12207.

Su propósito es delimitar la frontera funcional de la herramienta con base en las necesidades identificadas, abstrayendo cualquier decisión de diseño arquitectónico o tecnológico, y manteniéndose estrictamente en el dominio del proceso de requisitos.

---

## 1. Límites del Sistema (Alcance y Exclusiones)

### 1.1 Dentro del Alcance (Requisitos Funcionales Incluidos)

El sistema comprende la provisión de las siguientes capacidades y características funcionales para el usuario final:

*   **Interfaz de Edición Estructurada:** Entorno visual e interactivo basado en formularios guiados para la entrada de datos estructurados de procesos conforme al estándar ISO/IEC/IEEE 24774.
*   **Gestión de Metadatos Raíz:** Registro y modificación de la información básica y obligatoria del proceso: Nombre, Propósito y Resultados Esperados.
*   **Gestión de Elementos de Proceso:** Capacidad de registrar, editar y remover elementos complementarios del proceso, tales como: actividades, tareas, entradas, productos de trabajo, stakeholders, objetivos, controles y restricciones.
*   **Estructuración Jerárquica:** Asociación e inclusión lógica de tareas dentro de actividades específicas, así como la vinculación de productos de trabajo a sus respectivas tareas.
*   **Reorganización Secuencial:** Mecanismos visuales directos en la interfaz que permitan ordenar y secuenciar libremente las actividades y las tareas dentro del proceso.
*   **Motor de Validación Semántica:** Análisis automático en tiempo real sobre la completitud del proceso para garantizar que cumple con los campos mínimos requeridos (Nombre, Propósito y al menos un Resultado Esperado).
*   **Control de Consistencia Estructural:** Detección automática de elementos incompletos o desvinculados de la jerarquía del proceso.
*   **Control de Guardado y Alertas:** Restricción y bloqueo de la exportación del archivo del proceso si no se superan las validaciones obligatorias, notificando al usuario mediante mensajes claros descritos en lenguaje de modelado de procesos.
*   **Persistencia Documental Local:** Funciones para exportar y cargar descripciones de procesos en un archivo específico de intercambio con extensión `.pro` de forma transparente para el usuario.
*   **Continuidad del Trabajo:** Habilitación de la edición completa y reactivación de todas las operaciones sobre un proceso reconstruido a partir de la importación exitosa de un archivo `.pro`.
*   **Vista Previa e Impresión:** Generación de un reporte visual dinámico ("vista tipo hoja") que represente el proceso estructurado y soporte la conmutación de orientación (vertical/horizontal).
*   **Exportación a PDF:** Conversión y generación de un documento PDF independiente que conserve el formato, orden y orientación configurados en la vista previa.

### 1.2 Fuera del Alcance (Exclusiones Estrictas del Sistema)

Quedan expresamente excluidas del sistema las siguientes capacidades, delimitando la frontera del producto:

*   **Coedición Síncrona:** El sistema no proveerá mecanismos de colaboración en tiempo real ni edición simultánea multiusuario sobre una misma descripción de proceso.
*   **Motor de Ejecución de Procesos (BPMN / Workflow Engine):** El alcance del producto es de carácter conceptual, descriptivo y documental bajo ISO 24774. No realizará la ejecución automatizada de flujos de trabajo, seguimiento de tareas de producción de personal, ni medición de métricas operativas de negocio en tiempo real.
*   **Modelado Gráfico o Notación Diagramática:** El sistema no ofrecerá un modelador gráfico interactivo con dibujo de cajas, flechas, conectores ni diagramas visuales (estilo BPMN o UML). El modelado se restringe a una estructura de datos textual y jerárquica.
*   **Almacenamiento Centralizado o en la Nube:** No se proveerá base de datos persistente en servidores externos, ni sincronización automática de archivos en red. La persistencia e intercambio de la información del proceso depende exclusivamente de la gestión manual del usuario sobre sus archivos locales `.pro`.
*   **Gestión de Cuentas y Control de Acceso:** El sistema es monousuario y standalone local. No incluirá registro de cuentas de usuario, inicio de sesión (autenticación) ni asignación de permisos/roles.
*   **Control de Versiones Automatizado:** El editor no mantendrá un histórico de cambios o registro de versiones integrado. La trazabilidad e historial de revisiones del proceso será responsabilidad del usuario final mediante la manipulación externa de los archivos `.pro`.
