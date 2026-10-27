{
  "slug": "google-analytics-utils",
  "category": "extension",
  "description": "Activa Debug Mode, controla los envíos de GA4 y prueba configuraciones de GTM y Google tag desde Chrome.",
  "repo": "",
  "installUrl": "https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm",
  "docsUrl": "https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm",
  "sourceUrl": "https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm",
  "tags": [
    "Chrome",
    "GA4",
    "GTM",
    "Depuración"
  ],
  "featured": true,
  "status": "published",
  "unofficial": false,
  "attribution": "Desarrollada por Luratic. Diseño de interfaz de Jesús Núñez.",
  "contributors": [
    "Luratic",
    "Jesús Núñez"
  ],
  "title": "Google Analytics UTILS",
  "weight": 1,
  "sources": [
    "https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm",
    "https://www.luratic.com/google-analytics-utils/privacy-policy/"
  ],
  "icon": "puzzle",
  "accent": "violet",
  "legacyDocs": "",
  "demo": "utils",
  "releaseNotice": "La actualización está pendiente de aprobación en Chrome Web Store. La versión disponible para instalar puede no incluir todavía todas las mejoras descritas.",
  "privacyUrl": "/google-analytics-utils/privacy-policy/"
}

## Controla tu entorno de pruebas desde Chrome

Google Analytics UTILS reúne controles para depurar GA4, gestionar la carga de Google Tag Manager y Google tag y probar configuraciones en la página que estás revisando. Permite elegir un destino de pruebas, detener solicitudes o activar el modo de depuración.

Esta ficha describe la actualización **0.7.1**, pendiente de aprobación. La ficha pública consultada aún ofrece **0.5**; comprueba la versión de la tienda al preparar tu entorno.

## Debug Mode: sigue una interacción hasta su evento

Activa **GA4 - Activate Debug Mode**, reproduce una acción en tu web y revisa sus eventos en DebugView. Las capturas muestran el panel con los controles desactivados y con Debug Mode activo, resaltado en turquesa.

Selecciona el evento concreto de una búsqueda, un formulario o un paso del checkout para revisar sus parámetros. El control no crea esos eventos: la web debe generarlos y enviarlos. Comprueba la propiedad y el dispositivo elegidos.

## Bloquear, cambiar el destino y detener scripts

Estos controles sirven para preguntas distintas durante la depuración:

| Control | Qué permite comprobar |
| --- | --- |
| **GA4 - Block Requests** | Detiene las solicitudes de GA4 que coinciden con las reglas de bloqueo. Utilízalo para impedir esos envíos. |
| **GA4 - Change Measurement ID** | Sustituye el identificador de medición de las solicitudes coincidentes, por ejemplo por el de una propiedad de pruebas. |
| **GTM - Block Request** | Evita la carga de los scripts de Google Tag Manager cubiertos por el control. |
| **GTAG - Block Requests** | Evita la carga de los scripts de Google tag cubiertos por el control. |
| **GTAG - Change ID** | Ofrece un control separado para indicar otro identificador de Google tag. |

Cambiar el Measurement ID **mantiene el envío de la solicitud**: puede continuar hacia Google o hacia el endpoint propio que ya utilizaba la web. Resulta útil para probar otro identificador, pero no equivale a bloquear la comunicación.

Bloquear un script actúa sobre su carga. Para comparar el comportamiento del sitio con y sin ese script, repite el recorrido desde una recarga; no des por hecho que cambiar el control elimina código que ya estaba ejecutándose.

## Prueba un contenedor o una Google tag por inyección

El panel incluye **GTM - Inject Container** y **GTAG - Inject Script**. Introduces el identificador que quieres probar, activas la función y permites **User Scripts** en Chrome. La extensión solicita el script correspondiente a Google dentro de la página de prueba.

Este flujo permite revisar una configuración elegida por ti en el contexto real del sitio. Utiliza identificadores de confianza: un contenedor puede cargar otras etiquetas y enviar información a los destinos definidos por su propietario. La extensión no sustituye la revisión del contenido de ese contenedor.

## Delimita las pruebas y diagnostica bloqueos

**Apply Utils only in these domains** delimita los sitios donde aplicas los controles. Define ese ámbito antes de activar cambios de destino, inyección o controles de cabeceras.

**CSP - Bypass** y **CORS - Bypass** permiten investigar restricciones del navegador durante una prueba. Están desactivados en una instalación nueva y se habilitan de forma explícita.

CSP controla qué recursos y scripts permite cargar una página. Los ajustes CORS pueden hacer accesibles respuestas entre orígenes a los scripts de la página. Estos controles modifican el comportamiento de tu navegador durante el diagnóstico; la corrección para el resto de visitantes debe hacerse en la configuración del sitio o del servidor. Desactívalos al terminar la comprobación.

## Un caso práctico: validar un formulario

Quieres comprobar los datos de un formulario sin alterar a cada paso la configuración publicada:

1. Delimita el dominio y decide el objetivo: observar un envío de prueba o impedir las solicitudes coincidentes.
2. Para observarlo, configura el Measurement ID de pruebas y activa Debug Mode. Para impedirlo, utiliza Block Requests y revisa el resultado en las solicitudes de red.
3. Si necesitas probar otro GTM o Google tag, introduce su identificador y prepara la inyección con el permiso User Scripts.
4. Tras modificar los controles, repite el recorrido desde una recarga de la página. Evita mezclar resultados obtenidos antes y después del cambio.
5. Envía el formulario con datos ficticios y contrasta los valores recibidos o el bloqueo esperado. Al terminar, desactiva los controles que ya no necesites.

## Completa la revisión en DebugView

UTILS prepara la prueba en la web. [GA4 Enhanced DebugView](/recursos/ga4-enhanced-debugview/) muestra el evento seleccionado en la consola de Chrome, agrupado en **Parameters**, **User Properties** e **Items**, con tablas y objetos desplegables.

Las reglas de la extensión tienen un alcance concreto; comprueba los endpoints de tu implementación y los resultados observados. Desactivar un control no retira solicitudes que ya se hayan enviado.

Consulta la [ficha de Chrome Web Store](https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm) y la [política de la actualización 0.7.1](/google-analytics-utils/privacy-policy/). Desarrollada por Luratic, con diseño de interfaz de Jesús Núñez.
