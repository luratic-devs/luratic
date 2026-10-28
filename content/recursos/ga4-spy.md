{
  "slug": "ga4-spy",
  "category": "web",
  "description": "Inspecciona IDs de GA4 y audita contenedores GTM publicados sin acceso: configuración, etiquetas, activadores, variables, plantillas, endpoints y cambios.",
  "repo": "",
  "installUrl": "https://ga4spy.com/",
  "docsUrl": "https://ga4spy.com/docs/api",
  "sourceUrl": "https://ga4spy.com/",
  "tags": [
    "GA4",
    "GTM",
    "Firebase",
    "Auditoría"
  ],
  "featured": true,
  "status": "published",
  "unofficial": true,
  "attribution": "Creada por Brais Calvo.",
  "contributors": [
    "Brais Calvo"
  ],
  "title": "GA4 Spy",
  "weight": 3,
  "sources": [
    "https://ga4spy.com/",
    "https://ga4spy.com/ga4",
    "https://ga4spy.com/gtm",
    "https://ga4spy.com/firebase",
    "https://ga4spy.com/plans",
    "https://ga4spy.com/docs/api",
    "https://ga4spy.com/docs/mcp"
  ],
  "icon": "terminal",
  "accent": "cyan",
  "legacyDocs": "",
  "demo": "spy"
}

## Inspecciona GA4 y audita contenedores GTM publicados

GA4 Spy reúne la inspección de **Google Analytics 4, Google Tag Manager y Firebase** en una aplicación web. Puedes partir de una URL, de un Measurement ID, de un contenedor GTM o de un App ID para revisar la configuración pública que sirve Google sin entrar en la cuenta del proyecto.

En GA4 permite consultar y monitorizar cambios en decenas de ajustes de la configuración: eventos creados y modificados, conversiones, Consent Mode, cross-domain, exclusiones de referencia, Enhanced Measurement o Google tag, entre otros.

En un **contenedor GTM publicado** va bastante más allá de localizar el ID: reconstruye etiquetas, activadores y variables, identifica Custom Templates de la galería, detecta providers y endpoints en Custom HTML, encuentra elementos sin uso y permite monitorizar cambios entre versiones.

La consulta trabaja con información pública y no requiere login ni acceso a Analytics o Tag Manager. Tampoco proporciona acceso a informes privados de tráfico, usuarios o conversiones.

## Tres formas de investigar

| Entrada | Qué puedes explorar |
| --- | --- |
| **Web / GA4** | Introduce una URL, un Measurement ID `G-…` o un Google Tag ID `GT-…`. La herramienta permite localizar identificadores y consultar la configuración que sirve Google para la etiqueta. |
| **GTM** | Introduce un Container ID `GTM-…` o una URL para reconstruir de forma legible etiquetas, activadores, variables y otros elementos del contenedor publicado. |
| **App / Firebase** | Introduce un Firebase App ID para consultar la configuración de Analytics que Google entrega a esa aplicación. |

Según la plataforma, la interfaz muestra información sobre eventos configurados, opciones de medición, destinos y señales de consentimiento o DMA. Es una lectura de la configuración disponible: no debe interpretarse como una lista de todos los eventos que han ocurrido en la propiedad.

## Un caso práctico: revisar una publicación de GTM

Antes de publicar un cambio, quieres conservar una referencia del contenedor que carga tu web. Abres el [inspector de GTM](https://ga4spy.com/gtm), introduces el dominio o el identificador y revisas la estructura publicada.

Si activas el seguimiento disponible en tu cuenta, puedes consultar el historial y comparar versiones posteriores: qué etiquetas, activadores o variables han cambiado. Esta comparación ayuda a investigar una incidencia después de una publicación o a verificar que el cambio observado coincide con el que esperaba el equipo.

La misma idea sirve para seguir ajustes públicos de una etiqueta de GA4 o de una app Firebase. La herramienta ofrece seguimiento y alertas; sus canales, frecuencia y capacidad dependen de las opciones del [plan elegido](https://ga4spy.com/plans).

## Cómo empezar

1. Abre [GA4 Spy](https://ga4spy.com/) y elige **Web**, **GTM** o **App** según lo que quieras revisar.
2. Pega una URL o el identificador correspondiente. En Firebase utiliza el App ID, no el nombre comercial de la aplicación.
3. Si una web devuelve varios identificadores, revisa cuál corresponde al entorno y a la implementación que estás investigando.
4. Explora el resultado por bloques y contrástalo con el cambio o la pregunta que motivó la revisión. La portada también ofrece datos de ejemplo para conocer la interfaz.
5. Si necesitas seguimiento, configura tu cuenta y las alertas disponibles. Revisa el historial y las diferencias cuando aparezca una nueva configuración.

## Cómo interpretar lo que encuentras

Un contenedor publicado describe reglas y etiquetas, pero no demuestra que todas se hayan disparado durante una visita concreta. Del mismo modo, una señal de consentimiento presente en la configuración no prueba por sí sola que el banner, los estados iniciales y sus actualizaciones funcionen correctamente en el navegador.

Combina esta lectura con Preview de GTM, las solicitudes de red o una prueba de DebugView cuando necesites comprobar ejecución y recepción. GA4 Spy resulta especialmente útil para localizar la configuración que debes revisar y explicar cómo ha evolucionado.

La detección desde una URL también tiene límites: un sitio puede bloquear la petición directa y producir una lista incompleta. En ese caso, la propia interfaz propone introducir el identificador conocido. El inspector de GTM necesita una versión publicada y accesible; no muestra borradores privados del espacio de trabajo.

## Integración con otros flujos

La [documentación de la API](https://ga4spy.com/docs/api) describe operaciones para inspección, capturas, diferencias y gestión de alertas. También existe [documentación de MCP](https://ga4spy.com/docs/mcp). Consulta sus requisitos de autenticación, plan y disponibilidad antes de diseñar una integración: que una función esté documentada no implica acceso abierto para cualquier cuenta.

GA4 Spy es un proyecto independiente. Para consultar definiciones de campos o preparar informes, puedes continuar en [GA4 Spy · Cheatsheet](/recursos/ga4-data/).
