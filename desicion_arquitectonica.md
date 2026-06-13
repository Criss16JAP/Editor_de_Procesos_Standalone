# Documento de Análisis y Decisión Arquitectónica: Editor de Procesos Standalone
 
## 1. Contexto y Objetivos del Producto
El objetivo principal es desarrollar un Editor de Procesos Standalone alineado con la estructura conceptual de ISO/IEC/IEEE 24774. La herramienta debe permitir a los usuarios (diseñadores, analistas, docentes) crear, editar, visualizar, guardar, imprimir y exportar descripciones de procesos.
 
**Restricciones clave del diseño:**
* Debe funcionar como una herramienta *standalone* (independiente).
* No debe utilizar almacenamiento de datos en persistencia tradicional (bases de datos).
* Toda la información debe almacenarse localmente mediante un archivo estructurado con extensión `.pro` (basado en formato jerárquico de texto).
* El sistema debe gestionar y validar la estructura internamente sin exponer la complejidad técnica al usuario.
 
---
 
## 2. Evaluación de Propuestas Arquitectónicas Iniciales
 
Para abordar este problema, se evaluaron tres enfoques arquitectónicos de alto nivel, abstrayendo el uso de tecnologías o *frameworks* específicos:
 
### Propuesta 1: Arquitectura Cliente-Servidor (Backend + BD Relacional + Frontend Separado)
* **Descripción:** Un sistema donde la interfaz de usuario se ejecuta separada de una capa de lógica centralizada en un servidor, apoyándose en una base de datos relacional para el almacenamiento.
* **Veredicto:** **Descartada.**
* **Justificación:** Rompe el requerimiento de ser *standalone* y la restricción de no usar persistencia tradicional. Obliga a mantener infraestructura (servidores y redes), lo que elimina la autonomía del usuario y la portabilidad inherente que busca el archivo `.pro`.
 
### Propuesta 2: Arquitectura Monolítica Centralizada (Renderizado en Servidor + BD Relacional)
* **Descripción:** Un sistema unificado donde un servidor central procesa tanto la lógica de negocio como la generación de la interfaz gráfica en cada interacción, apoyado en una base de datos.
* **Veredicto:** **Descartada.**
* **Justificación:** Comparte los mismos impedimentos de infraestructura que la Propuesta 1. Además, el modelo de recargas de página desde el servidor dificulta la creación de una interfaz fluida e interactiva, necesaria para la manipulación y reorganización jerárquica de elementos de un proceso.
 
### Propuesta 3: Arquitectura Basada en Cliente con Archivos Locales
* **Descripción:** Una solución donde toda la lógica de validación, estructura y presentación reside en la capa del cliente. No existe base de datos; el almacenamiento se realiza exclusivamente mediante la lectura, modificación y escritura de archivos locales `.pro`.
* **Veredicto:** **Seleccionada.**
* **Justificación:** Es la única propuesta que cumple estrictamente con las condiciones descritas en los requerimientos originales.
 
---
 
## 3. Cuadro Comparativo
 
| Criterio de Evaluación | Propuesta 1: Cliente-Servidor | Propuesta 2: Monolito | Propuesta 3: Cliente Local |
| :--- | :--- | :--- | :--- |
| **Cumple modelo "Standalone"** | ❌ No (requiere red/servidor) | ❌ No (requiere red/servidor) | ✅ Sí |
| **Persistencia Requerida** | Archivo local es secundario | Archivo local es secundario | ✅ Archivo `.pro` como núcleo |
| **Costos de Infraestructura** | Altos (Servidor, BD) | Medios/Altos | Nulos (Ejecución local) |
| **Capacidad Offline** | ❌ No | ❌ No | ✅ Sí |
| **Alineación con Requisitos** | Baja | Baja | Alta |
 
---
 
## 4. Alternativas de Implementación (Derivadas de la Propuesta 3)
 
Al seleccionar la Propuesta 3, existen dos alternativas principales para materializar el empaquetado y la entrega del producto sin depender de infraestructura centralizada:
 
### Alternativa A: Aplicación de Cliente Único (Ejecución en Navegador)
Toda la lógica y la interfaz gráfica se empaquetan para ser ejecutadas directamente por el motor de un navegador web estándar.
* **Manejo de archivos:** Utiliza las interfaces de programación nativas del navegador para interactuar de forma segura con el disco duro del usuario (lectura y escritura del archivo `.pro`).
* **Ventaja:** Máxima distribución. No requiere procesos de instalación complejos en el sistema operativo anfitrión.
 
### Alternativa B: Aplicación de Escritorio Empaquetada (Contenedor Nativo)
La interfaz y lógica (basadas en tecnologías modernas de interfaz) se encapsulan dentro de un ejecutable nativo para sistemas operativos de escritorio.
* **Manejo de archivos:** Al ser un programa nativo, interactúa directamente con el sistema de archivos del sistema operativo sin restricciones de entorno seguro (sandbox) del navegador web.
* **Ventaja:** Máximo aislamiento, integración profunda con las herramientas de impresión nativas y experiencia clásica de software de escritorio.
 
---
 
## 5. Decisión Arquitectónica Final
 
Se determina oficialmente **adoptar la Propuesta 3 (Arquitectura Basada en Cliente con Archivos Locales)** como el modelo de diseño para el Editor de Procesos Standalone.
 
**Razonamiento fundamental:**
Esta propuesta es la única vía que respeta la premisa de no almacenar datos en persistencia de red o bases de datos, garantizando que el archivo `.pro` funcione como la única fuente de verdad. Esto asegura el cumplimiento de la norma ISO/IEC/IEEE 24774, mantiene la privacidad y autonomía del usuario, permite el uso 100% *offline*, y facilita la portabilidad e intercambio de descripciones de procesos sin incurrir en costos operativos de infraestructura.