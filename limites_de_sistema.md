### DOCUMENTO 3: INFORME DE LÍMITES DEL SISTEMA Y VIABILIDAD ARQUITECTÓNICA

Este informe cumple con la actividad de análisis de requisitos exigida por la ISO 12207. Su propósito es definir los límites formales del producto (alcance y exclusiones) y evaluar críticamente la viabilidad técnica y arquitectónica de las tres propuestas planteadas de cara a las restricciones del proyecto.

---

### 1. Límites del Sistema (Alcance y Exclusiones)

#### 1.1 Dentro del Alcance (Funcionalidades del Sistema)
* Interfaz gráfica de usuario basada en formularios web guiados para el registro estructurado de datos según la norma ISO/IEC/IEEE 24774.
* Motor de validación semántica local en el cliente y validación secundaria en el backend.
* Capacidad de serialización y ordenamiento de arrays jerárquicos de datos ("Actividad -> Tarea -> Producto").
* Persistencia local independiente mediante importación y exportación de archivos `.pro` en formato JSON.
* Módulo de comunicación asíncrona HTTP para interactuar con la API REST del backend del sistema.
* Generador de previsualizaciones tipo reporte con descarga a PDF parametrizable (vertical/horizontal).

#### 1.2 Fuera del Alcance (Exclusiones Estrictas del Sistema)
* **Coedición síncrona:** El sistema no proveerá un entorno de trabajo colaborativo en tiempo real multiusuario de forma simultánea sobre el mismo lienzo de edición (ej. estilo Google Docs).
* **Motor de Ejecución de Procesos (BPMN Workflow Engine):** El alcance del producto está restringido estrictamente a la **creación de descripciones conceptuales y documentales** de procesos bajo ISO 24774. El sistema no ejecutará flujos automatizados de trabajo corporativo, ni medirá tiempos reales de operación, ni asignará tareas de producción a empleados.

---

### 2. Análisis Crítico de Viabilidad de las Propuestas Técnicas

El análisis se realiza contrastando las propuestas de solución frente a la **actualización de requisitos de arquitectura** especificada en el Documento 1: *"El sistema deja de ser exclusivamente una aplicación web standalone de una sola página (SPA)... adopta una arquitectura basada en un frontend web que consume servicios desde un servidor backend a través de una API REST. Esta conexión permite el almacenamiento centralizado en la nube, superando la limitación anterior"*.

#### Evaluación de la Propuesta 1: Frontend Desacoplado (React.js) + Backend API REST (Python Django)
* **Viabilidad Técnica General:** **Alta.**
* **Análisis frente a Requisitos:** Esta opción cumple de manera directa con el nuevo enfoque arquitectónico del sistema (separación de responsabilidades mediante una API RESTful). La utilización de React.js en el cliente es ideal para cumplir con las metas de reactividad e interacción visual inmediata de la UI (validación y refresco del árbol de datos en < 500 ms, RNF-06), aislando la complejidad técnica del usuario. Django REST Framework provee capacidades nativas excelentes para procesar de forma segura el formato JSON enviado y controlar los tokens de acceso del requerimiento de seguridad.
* **Conflicto con Restricciones del Proyecto:** Presenta un problema de viabilidad respecto a las decisiones de infraestructura preestablecidas en el proyecto (Documento 3 y 4). El análisis del entorno del cliente estipula el despliegue del backend utilizando **PHP sobre servidores Windows Server (Hostinger)**. Elegir Django (Python) implicaría ignorar los sistemas habilitadores ya aprobados y modificar el stack de servidores.

#### Evaluación de la Propuesta 2: Monolito Tradicional (Python Django)
* **Viabilidad Técnica General:** **Nula (Inviable).**
* **Análisis frente a Requisitos:** Un monolito tradicional donde las vistas HTML se renderizan por completo en el servidor no es viable. Infringe directamente la directriz que obliga a estructurar un frontend web SPA desacoplado que consuma servicios de forma asíncrona por API REST.
* **Análisis de Rendimiento Crítico:** Bajo un enfoque monolítico clásico, cada cambio o reordenamiento del árbol jerárquico obligaría a realizar recargas de la página entera (*postbacks*) o transacciones síncronas que harían imposible alcanzar la meta **RNF-06** de respuesta en < 500 ms. Adicionalmente, mantiene la incompatibilidad con el entorno de infraestructura en PHP predefinido.

#### Evaluación de la Propuesta 3: Aplicación Standalone Pura (Sin persistencia en base de datos, almacenamiento local y gestión manual de archivos .pro)
* **Viabilidad Técnica General:** **Inviable bajo los nuevos términos.**
* **Análisis frente a Requisitos:** Esta alternativa encaja con el diseño inicial histórico de la aplicación, donde operaba de manera aislada en el cliente. Sin embargo, **viola de forma absoluta la nueva especificación técnica de la ISO 12207 para este proyecto**.
* **Análisis de Impacto:** Si se implementa la Propuesta 3, se estaría ignorando el mandato explícito que traslada la fuente oficial de la verdad del sistema a la base de datos remota del backend. Esta propuesta anula el módulo de comunicación HTTP, las métricas de latencia de red corporativa (**RNF-09**), el almacenamiento en la nube controlado por tokens de sesión y las validaciones secundarias del servidor. Bajo la documentación actual, el uso de almacenamiento local (`localStorage`) queda degradado estrictamente a un mecanismo de tolerancia a fallos en situaciones de caída de internet, por lo que no puede ser la solución principal.

