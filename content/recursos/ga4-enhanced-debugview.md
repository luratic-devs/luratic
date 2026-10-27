{
  "slug": "ga4-enhanced-debugview",
  "category": "extension",
  "description": "Parámetros, propiedades de usuario e ítems de tus eventos de DebugView, agrupados en la consola de Chrome.",
  "repo": "",
  "installUrl": "https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej",
  "docsUrl": "https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej",
  "sourceUrl": "https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej",
  "tags": [
    "Chrome",
    "GA4",
    "Firebase",
    "DebugView"
  ],
  "featured": true,
  "status": "published",
  "unofficial": false,
  "attribution": "Luratic; la ficha acredita el apoyo de la comunidad Datola.",
  "contributors": [
    "Luratic"
  ],
  "title": "GA4 Enhanced DebugView",
  "weight": 2,
  "sources": [
    "https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej",
    "https://support.google.com/analytics/answer/7201382?hl=en",
    "https://firebase.google.com/docs/analytics/debugview"
  ],
  "icon": "puzzle",
  "accent": "pink",
  "legacyDocs": "",
  "demo": "debugview"
}

## Los detalles del evento, juntos en la consola

GA4 Enhanced DebugView muestra en la **consola de Chrome** la información de los eventos que seleccionas en **GA4 o Firebase DebugView**. Trabajas en la pestaña **Console** de las herramientas de desarrollo: seleccionas un evento en DebugView y revisas allí sus datos agrupados.

La salida actual incluye el nombre del evento y la hora, grupos desplegables, tablas de valores y objetos que puedes expandir. La ficha de Chrome Web Store también contempla la vista Usersnapshot.

## Parameters, User Properties e Items

La consola organiza el resultado en tres grupos:

| Grupo | Qué puedes revisar |
| --- | --- |
| **Parameters** | Los parámetros y valores del evento, presentados en una tabla y como objeto desplegable. |
| **User Properties** | Las propiedades de usuario disponibles, con su tabla y su objeto. |
| **Items** | La información de productos, agrupada por ítem con sus campos y valores cuando el evento contiene esos datos. |

Puedes plegar y desplegar los grupos para centrarte en la parte que estás validando. Para localizar la salida de la extensión entre otros mensajes, escribe **`^>`** en el filtro de la consola: es el marcador de Luratic que se muestra en la captura.

## Cuándo resulta útil

Durante una implementación, además de confirmar que un evento ha llegado, necesitas contrastar sus datos con el plan de medición. La salida agrupada facilita recorrer eventos de prueba y comparar sus valores con las variables configuradas en GTM o en la aplicación.

La extensión ayuda a leer los datos; la validación de las reglas de negocio sigue siendo tuya.

## Un caso práctico: revisar una compra de prueba

Has preparado un recorrido de compra en un entorno de pruebas y quieres comprobar qué ha recibido Analytics. Cuando el evento aparezca en DebugView, lo seleccionas y revisas en consola los parámetros disponibles.

En **Parameters** puedes contrastar `transaction_id`, `currency` y `value` con la operación esperada. En **User Properties**, revisas el contexto de usuario disponible; en **Items**, abres cada producto para comprobar campos como `item_id`, `quantity` o `price`.

Esos nombres son ejemplos de revisión. Los datos concretos dependen del evento recibido: la extensión no añade parámetros ausentes ni corrige sus valores.

Después seleccionas otro evento del recorrido y comparas su contenido. Si detectas una diferencia, vuelves a la configuración de la etiqueta o al código que genera los datos para investigar el origen.

## Cómo utilizarla

1. Instala [GA4 Enhanced DebugView desde Chrome Web Store](https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej).
2. Accede a la propiedad de GA4 o al proyecto de Firebase que vas a revisar y prepara una sesión de prueba con el modo de depuración habilitado.
3. Abre DebugView y selecciona el dispositivo de prueba cuando haya varios disponibles.
4. Activa la extensión desde su icono en Chrome.
5. Abre las herramientas de desarrollo y la pestaña **Console** en la página de Analytics o Firebase donde estás consultando DebugView.
6. Escribe `^>` en el filtro de Console si quieres centrarte en los mensajes de la extensión.
7. Selecciona un evento de la línea temporal y despliega **Parameters**, **User Properties** e **Items** según los datos que necesites revisar. Abre los objetos cuando quieras inspeccionarlos con más detalle.

Para una web, Google documenta Tag Assistant y el modo Preview como formas de habilitar la depuración del dispositivo. Para aplicaciones, sigue las instrucciones específicas de [Firebase DebugView](https://firebase.google.com/docs/analytics/debugview).

## Qué significa el resultado

La extensión necesita que el evento ya esté disponible en la interfaz que estás inspeccionando. Activarla no habilita por sí sola el modo debug de tu web o aplicación, ni provoca que se envíen eventos nuevos.

Si no aparece el evento en DebugView, revisa la propiedad, el dispositivo y la depuración. Si aparece pero no ves la salida de la extensión, comprueba que está activa y que tienes abierta la consola correcta. Revisa también sus filtros y niveles de mensajes.

La integración depende de la estructura de las interfaces de Google, que puede cambiar. Comprueba el comportamiento en tu entorno antes de incorporarla a un procedimiento de validación. Para contrastar lo que ocurre en el envío, complementa la revisión con Preview de GTM o las solicitudes de red de tu sitio.

## Instalación y referencias

La [ficha de la tienda](https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej) reúne la versión publicada, los permisos y las declaraciones de privacidad. Consulta también la [guía de DebugView de Google Analytics](https://support.google.com/analytics/answer/7201382?hl=en) para interpretar la línea temporal, los dispositivos y los parámetros.

Desarrollada por Luratic, con el apoyo de la comunidad Datola reconocido en la ficha de la extensión.
