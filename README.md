Situación que origina el producto
Las organizaciones, equipos académicos, consultores y responsables de mejora de procesos suelen documentar procesos mediante archivos de texto, hojas de cálculo, presentaciones o plantillas manuales. Estos medios permiten redactar el contenido de un proceso, pero dificultan mantener una estructura uniforme, revisar la completitud de la descripción, reutilizar procesos previamente elaborados y conservar relaciones entre los elementos que componen el proceso.

Cuando una descripción de proceso se construye sin una estructura de datos definida, es común que algunos elementos queden incompletos, que las actividades y tareas no mantengan una relación clara, que los resultados esperados no se conecten adecuadamente con el propósito del proceso o que sea difícil reutilizar la descripción en otro contexto. También se presentan dificultades para generar salidas consistentes para revisión, impresión, archivo o distribución.

Necesidad que debe atenderse
Se requiere una herramienta que permita construir descripciones de procesos de forma estructurada, editable, reutilizable y revisable. La herramienta debe ayudar al usuario a registrar los elementos principales de un proceso y a conservar esos elementos en una estructura que pueda guardarse, cargarse y presentarse posteriormente.

El producto debe apoyar la elaboración de descripciones de procesos alineadas con la estructura conceptual de ISO/IEC/IEEE 24774. La herramienta no reemplaza el juicio del diseñador de procesos, pero debe ofrecer un entorno que facilite organizar los datos del proceso, validar elementos mínimos y generar una salida adecuada para revisión o distribución.

Producto propuesto
Se requiere desarrollar un Editor de Procesos Standalone según ISO/IEC/IEEE 24774.

El editor será una herramienta web standalone, ejecutable desde navegador, que funcionará como producto propio y no como módulo de otra plataforma. Su finalidad será permitir que un usuario cree, edite, visualice, guarde, cargue, imprima y exporte descripciones de procesos.

El producto estará orientado principalmente a diseñadores de procesos, analistas, docentes, evaluadores, consultores o integrantes de equipos que necesiten construir, revisar o reutilizar descripciones de procesos con una estructura común.

Descripción general del funcionamiento esperado
Al abrir el editor, el usuario deberá poder iniciar una nueva descripción de proceso o cargar una descripción previamente guardada en un archivo .pro.

Cuando el usuario cree una nueva descripción, el editor deberá ofrecer mecanismos para registrar los elementos del proceso mediante una interfaz de edición. Como base mínima, toda descripción de proceso deberá incluir nombre, propósito y resultados esperados. Además, el usuario podrá incorporar otros elementos cuando sean necesarios, como entradas, actividades, tareas, productos de trabajo, stakeholders, objetivos, controles, restricciones y demás elementos definidos dentro del alcance del producto.

Cuando el usuario cargue un archivo .pro, el editor deberá interpretar los datos almacenados, reconstruir la estructura del proceso y restablecer en la interfaz los elementos que hayan sido guardados. El usuario deberá poder continuar la edición de la descripción cargada, modificar sus elementos, agregar nuevos elementos, eliminar elementos existentes o reorganizar la estructura del proceso.

Estructura de datos del proceso
La descripción del proceso deberá representarse mediante una estructura jerárquica de datos compatible con los elementos definidos en ISO/IEC/IEEE 24774.

Esta estructura deberá permitir representar relaciones entre los elementos del proceso, como composición, secuencia o dependencia, según las decisiones de diseño adoptadas durante el desarrollo. Por ejemplo, una actividad podrá agrupar tareas, una tarea podrá estar asociada a determinados productos de trabajo y algunos elementos podrán depender de otros para conservar una descripción coherente.

El usuario no deberá manipular directamente la estructura JSON. La estructura de datos deberá ser gestionada por el editor a partir de las acciones realizadas en la interfaz.

Archivo .pro
El editor deberá permitir guardar la descripción del proceso en un archivo con extensión .pro, basado en JSON.

El archivo .pro deberá conservar los datos del proceso y su estructura jerárquica. Su propósito será permitir que una descripción pueda almacenarse, compartirse, cargarse nuevamente y continuar editándose en otro momento.

El uso de un archivo .pro busca separar la descripción del proceso de una sesión particular de edición. De esta manera, el producto debe permitir reutilizar procesos previamente elaborados y facilitar el intercambio de descripciones entre usuarios o equipos.

Edición de la descripción del proceso
La interfaz deberá facilitar la creación y modificación de los elementos del proceso. El usuario deberá poder agregar, modificar, eliminar y reorganizar elementos de la descripción.

La reorganización deberá conservar la estructura fundamental del proceso. Si el usuario cambia el orden de actividades o tareas, la interfaz deberá reflejar esos cambios y la estructura de datos deberá actualizarse de manera consistente.

El editor deberá facilitar la edición sin exigir conocimientos técnicos sobre JSON, estructuras jerárquicas internas o mecanismos de almacenamiento. Las acciones disponibles para el usuario deberán estar orientadas al trabajo propio de descripción de procesos.

Validación de la descripción
El editor deberá incluir mecanismos de validación para evitar el guardado de descripciones incompletas o estructuralmente inconsistentes.

Como mínimo, la validación deberá comprobar la presencia de los elementos obligatorios definidos para la descripción del proceso. También deberá permitir verificar reglas estructurales definidas por el equipo, como la relación entre actividades y tareas o la existencia de datos mínimos en los elementos incorporados.

Las validaciones deberán ayudar al usuario a identificar elementos faltantes, incompletos o ubicados de manera inconsistente dentro de la estructura del proceso.

Visualización, impresión y exportación
El editor deberá ofrecer una vista previa tipo hoja para revisar la descripción del proceso en un formato similar a un documento de trabajo o reporte.

La vista previa deberá permitir seleccionar orientación vertical u horizontal. Esta visualización deberá presentar de manera organizada los elementos del proceso y deberá servir como base para impresión o exportación a PDF.

El archivo PDF deberá preservar el contenido de la descripción, la estructura presentada en la vista y la orientación seleccionada por el usuario.

Valor esperado del producto
El producto busca facilitar la creación, revisión, reutilización e intercambio de descripciones de procesos mediante una herramienta especializada.

El editor debe reducir la dependencia de plantillas manuales, mejorar la consistencia de las descripciones, facilitar la revisión de elementos obligatorios y permitir que los procesos se conserven en un formato reutilizable. También debe permitir generar salidas imprimibles o distribuibles en PDF para revisión, archivo o socialización.

El valor principal del producto está en convertir la descripción de procesos en una estructura editable, validable, reutilizable y presentable, sin exigir al usuario conocimientos técnicos sobre el formato interno de almacenamiento.