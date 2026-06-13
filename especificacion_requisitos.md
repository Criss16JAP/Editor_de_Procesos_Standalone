# ESPECIFICACIÓN TÉCNICA DE REQUISITOS DEL SISTEMA
 
Este documento define formalmente los requisitos funcionales (qué debe hacer el sistema) y no funcionales (atributos de calidad y restricciones) necesarios para guiar las fases subsiguientes de diseño y desarrollo de software.
 
## 1. Requisitos Funcionales (RF)
 
### 1.1 Módulo de Modelado de Procesos (ISO/IEC/IEEE 24774)
* **RF-01 (Inicialización):** El sistema deberá permitir al usuario iniciar una nueva descripción de proceso, lo cual limpiará el lienzo de trabajo e inicializará una estructura de datos vacía en memoria.
* **RF-02 (Metadatos Generales):** El sistema deberá permitir el registro de las propiedades raíz del proceso: Nombre, Propósito y Resultados Esperados.
* **RF-03 (Gestión de Elementos del Proceso):** El sistema deberá permitir agregar, modificar y eliminar actividades, tareas, entradas, productos de trabajo, stakeholders, objetivos, controles y restricciones del proceso.
* **RF-04 (Mapeo Jerárquico):** El sistema deberá asociar lógicamente las tareas a una actividad contenedora específica, y vincular los productos de trabajo a la tarea que corresponda dentro de la estructura.
* **RF-05 (Reorganización de la Secuencia):** El sistema deberá permitir cambiar el orden posicional de las actividades dentro del proceso y de las tareas dentro de una actividad mediante controles visuales.
 
### 1.2 Módulo de Persistencia y Serialización
* **RF-06 (Exportación de Archivos .pro):** El sistema deberá codificar la descripción del proceso y su estructura jerárquica en un formato estructurado de texto plano y permitir su descarga local en un archivo con extensión `.pro`.
* **RF-07 (Importación de Archivos .pro):** El sistema deberá permitir la carga de un archivo `.pro`, interpretar sus datos estructurados, reconstruir la jerarquía del proceso y restaurar todos los elementos en la interfaz gráfica.
* **RF-08 (Continuidad de Edición):** Al finalizar la importación de un archivo `.pro`, el sistema deberá habilitar todas las funciones de edición (modificar, añadir o eliminar elementos) sobre el proceso restaurado.
 
### 1.3 Módulo de Validación y Reglas de Negocio
* **RF-09 (Validación Mandatoria):** El sistema deberá verificar de forma obligatoria que la descripción del proceso contenga como mínimo: Nombre, Propósito y un (1) Resultado Esperado.
* **RF-10 (Detección de Inconsistencias):** El sistema deberá comprobar reglas estructurales internas para identificar de forma automatizada elementos incompletos o relaciones jerárquicas rotas.
* **RF-11 (Bloqueo de Persistencia Defectuosa):** El sistema deberá mostrar mensajes de alerta descriptivos en la interfaz y bloquear la opción de guardado local (`.pro`) si el proceso no supera las validaciones obligatorias.
 
### 1.4 Módulo de Renderizado e Impresión PDF
* **RF-12 (Generación de Vista Previa):** El sistema deberá ofrecer una vista previa tipo hoja que formatee la información del proceso como un documento estructurado de trabajo o reporte.
* **RF-13 (Actualización Reactiva):** La vista previa del documento deberá reflejar de manera inmediata cualquier adición, modificación o reorganización de datos efectuada en los formularios de edición.
* **RF-14 (Configuración de Orientación):** El sistema deberá proveer selectores visuales para conmutar la orientación de la vista previa entre diseño vertical u horizontal.
* **RF-15 (Exportación Fiel a PDF):** El sistema deberá compilar la vista previa para su impresión nativa o exportación a un archivo PDF independiente, preservando de forma exacta el contenido, el orden de los elementos y la orientación seleccionada.
 
## 2. Requisitos No Funcionales (RNF)
 
### 2.1 Usabilidad y Diseño de Interfaz
* **RNF-01 (Abstracción de Datos):** El sistema deberá facilitar la creación, modificación y almacenamiento de procesos sin exigir al usuario conocimientos técnicos sobre lenguajes de marcado o mecanismos internos de estructuración de datos.
* **RNF-02 (Interfaz Directa):** Las operaciones nucleares (Crear, Guardar, Cargar, Exportar) deberán estar accesibles de manera directa desde la barra de herramientas principal de la aplicación.
* **RNF-03 (Lenguaje de Negocio):** Todos los mensajes de validación, confirmación o errores de lectura deberán redactarse en lenguaje comprensible orientado al modelado de procesos, prohibiendo el despliegue de códigos de programación o trazas de ejecución.
* **RNF-04 (Interacción de Ordenamiento):** La reorganización secuencial de las actividades y tareas en la interfaz gráfica deberá realizarse obligatoriamente mediante mecanismos visuales directos (botones de desplazamiento o arrastrar y soltar).
 
### 2.2 Eficiencia de Rendimiento y Medidas Críticas de Desempeño (TPM)
* **RNF-05 (Tiempo de Inicialización - TPM-01):** El tiempo de carga e inicialización de la interfaz principal no deberá superar los 2.0 segundos en condiciones operativas normales.
* **RNF-06 (Latencia de Validación - TPM-02):** El análisis de completitud estructural y su correspondiente actualización de alertas en la UI debe procesarse en un tiempo máximo de 500 milisegundos tras una modificación.
* **RNF-07 (Tiempo de Generación de Reporte - TPM-03):** El renderizado del archivo PDF final y el inicio de su descarga local debe completarse en menos de 3.0 segundos para procesos de tamaño normal (de hasta 50 nodos).
* **RNF-08 (Velocidad de Deserialización):** El proceso de carga, validación y dibujo en pantalla de un archivo `.pro` estándar debe ejecutarse en menos de 3.0 segundos.