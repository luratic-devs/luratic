# Revisión de mantenimiento de los recursos de Luratic

Fecha de observación: **27 de octubre de 2026 (UTC)**.

## Alcance y resultado

Revisión de solo lectura de cuatro recursos del catálogo: Google Analytics UTILS, GA4 Enhanced DebugView, Firebase Analytics Protobuf Decoder y gtag con protocolos personalizados. Se añadió una revisión del ciclo de vida de tres plantillas cuyo servicio de destino ha sido retirado. Se consultaron fichas y documentación públicas, paquetes oficiales de Chrome y archivos públicos de GitHub. No se han cambiado los recursos, sus destacados, las políticas de privacidad ni el código de las extensiones. La protección de las políticas en el proceso de compilación se documenta por separado al final.

La evidencia no justifica borrar ninguno de los cuatro proyectos de GitHub por su antigüedad. Sí identifica trabajo concreto antes de recomendarlos como herramientas verificadas: alinear la privacidad de las versiones públicas de las extensiones, comprobar la integración de DebugView con la interfaz actual y presentar la adaptación de gtag como experimento hasta aclarar sus limitaciones.

| Recurso | Recomendación editorial y técnica | Decisión sobre GitHub |
| --- | --- | --- |
| Google Analytics UTILS | Conservar como proyecto principal. Priorizar la revisión de la versión pública 0.5 y su transición, si procede, a 0.7.1. Verificar que código, ficha y política describen la misma versión antes de reforzar su promoción. | No se identificó un repositorio público de esta extensión durante esta revisión. No hay motivo demostrado para borrarlo o archivarlo. |
| GA4 Enhanced DebugView | Conservar su ficha e historia; suspender la recomendación destacada hasta probar la interfaz actual de GA4/Firebase y revisar telemetría y secreto de Measurement Protocol. | No se identificó un repositorio público de esta extensión. Si existe y se decide abandonar el mantenimiento, archivar conserva más valor que borrar. |
| Firebase Analytics Protobuf Decoder | Conservar como recurso avanzado. Añadir instrucciones, ejemplos desidentificados y versiones de SDK/capturas verificadas. No hay evidencia suficiente de obsolescencia. | Conservar activo si se mantiene el descriptor. Aclarar licencia y, si se puede publicar, incluir la fuente `.proto`. |
| gtag con protocolos personalizados | Presentar como laboratorio o experimental, con compatibilidad pendiente de validación. No recomendar la copia como solución general de producción con la documentación actual. | Candidato a archivar si no se va a mantener el parche y su actualización. Mantener archivos e historial; borrar no resuelve las carencias técnicas. |

Estas son recomendaciones; **no se ha aplicado ninguna retirada o cambio de promoción**. Quitar un destacado, conservar una ficha histórica, archivar un repositorio y eliminarlo son acciones distintas.

## Método y paquetes examinados

Los CRX se descargaron directamente del servicio oficial de actualización de Chrome y se leyeron como archivos ZIP en memoria. No se instalaron ni ejecutaron. El parámetro `prodversion` de la descarga no representa una prueba en esa versión de Chrome. Se calculó SHA-256 del archivo recibido; no se realizó una verificación independiente de su firma CRX.

- [Paquete oficial de UTILS](https://clients2.google.com/service/update2/crx?response=redirect&prodversion=156.0.0.0&acceptformat=crx2%2Ccrx3&x=id%3Ddmhoedahbmlaipacpamhefgjoiebamjm%26uc).
- [Paquete oficial de Enhanced DebugView](https://clients2.google.com/service/update2/crx?response=redirect&prodversion=156.0.0.0&acceptformat=crx2%2Ccrx3&x=id%3Dhgkkhcgpdigijpbclngegpckcabpjjej%26uc).

Estos enlaces pueden servir versiones posteriores en el futuro. Los hashes siguientes identifican los paquetes observados en la fecha de esta revisión.

| Paquete | Versión del manifest | Manifest | Bytes CRX | SHA-256 del CRX |
| --- | --- | --- | ---: | --- |
| Google Analytics UTILS | `0.5` | V3 | 223169 | `1feda057b98bb867d20a7e11235bab1f3ebe376dca08eaf7080b82686d116030` |
| GA4 Enhanced DebugView by Luratic | `0.31` | V3 | 46887 | `96b04cfa118541d41cdb581db664e7de16ed7eb9ebc6a97a84471a1bbcfb3a2a` |

| Archivo observado | SHA-256 |
| --- | --- |
| UTILS 0.5 `popup.js` | `b30e69bac0ac7f5b9b56c33d8bbec19a33445de78246c35bdeb3409e3d6a95be` |
| UTILS 0.5 `background.js` | `6684ae8714823c026dde8a09a653aab7bd964df588912da52690a0ae1f992b8c` |
| DebugView 0.31 `background.js` | `c05b8215afa0685774390922c1c9962fb8800a47db7f559294b3ba2bb6a0a908` |
| DebugView 0.31 `script.js` | `3f0efd6c1c65928b1cd8cf892a7720a698d921bb0c5c4de0e353bedecf7343ab` |

Ambas extensiones usan **Manifest V3**. La retirada de Manifest V2 no es una razón válida para declararlas incompatibles. Las fechas de actualización de la tienda tampoco demuestran por sí solas funcionamiento o abandono.

Los extractos siguientes están recortados y, cuando procede, reformateados. Todos los valores de credenciales e identificadores de destino se omiten o se sustituyen por `[REDACTED]`. No deben copiarse como código ejecutable.

## 1. Google Analytics UTILS

### Publicación y permisos

La [ficha de Chrome Web Store](https://chromewebstore.google.com/detail/google-analytics-utils/dmhoedahbmlaipacpamhefgjoiebamjm) consultada muestra versión 0.5 y actualización del 3 de febrero de 2025. El paquete oficial recibido coincide con esa versión.

Su manifest incluye `declarativeNetRequest`, `tabs`, `scripting` y `cookies`, con acceso a `*://*/*`. Estos permisos ayudan a entender su alcance; su presencia por sí sola no demuestra un uso indebido.

### Hallazgo verificable en 0.5: telemetría y cookie de Analytics

En `popup.js`, la función `sendAnalytics` prepara un POST a la API HTTP de Amplitude. Añade el dominio de la pestaña y transmite un identificador, el nombre del evento y sus propiedades. `getGaCookie` intenta obtener la cookie `_ga` del dominio; si existe, toma sus dos últimos componentes. Si no existe, genera un identificador.

Fragmentos mínimos de `popup.js`:

```javascript
chrome.cookies.getAll({
  domain: window.currentTabUrl.replaceAll('www.', ''),
  name: '_ga'
}, function(cookies) {
  if (cookies.length > 0) {
    resolve(cookies[0].value.split('.').slice(-2).join('.'));
  } else {
    resolve(generateGaClientId());
  }
});
```

```javascript
const ampUrl = 'https://api2.amplitude.com/2/httpapi';
const apiKey = '[REDACTED]';
const clientId = getGaCookie();
// Dentro de clientId.then(value => { ... }):
eventProp['domain'] = window.currentTabUrl;
let data = {
  api_key: apiKey,
  events: [{
    user_id: value,
    event_type: eventName,
    event_properties: eventProp
  }]
};
// fetch(ampUrl, { method: 'POST', ..., body: JSON.stringify(data) })
```

Entre las llamadas aparecen apertura del popup (`page_view`), activación/desactivación de controles, expansión de información y clics en enlaces. Las propiedades de estado enumeradas en `setEventPropertiesStatus` son restricción de dominio, cambio de ID de GA4, modo debug, bloqueo de GA4, bloqueo de GTM, bloqueo de gtag y cambio de ID de gtag.

Esto demuestra que el paquete contiene código que **intenta** enviar esta telemetría. No se ha comprobado su entrega ni la existencia de datos almacenados en el destino. Tampoco se ha demostrado que envíe el contenido de los eventos de la web o valores de formularios.

### Distinción necesaria: política 0.7.1 y paquete público 0.5

La ficha pública de UTILS declara que no recopila ni utiliza datos, y su enlace de privacidad apunta a [la política general existente](https://www.luratic.com/privacy-policy/). Esa página identifica como aplicación GA4 Enhanced DebugView, con fecha de marzo de 2022. La declaración de la ficha de UTILS requiere revisión frente al comportamiento observado en el código de 0.5; esto es una discrepancia documental y técnica, no una conclusión jurídica.

Existe además en este repositorio `static/google-analytics-utils/privacy-policy/index.html`: política específica de **UTILS 0.7.1**, fechada el **27 de octubre de 2026**. Describe almacenamiento local, pruebas de GTM/gtag, controles CSP/CORS y ausencia de telemetría del editor y de inspección de cookies. Es evidencia documental de trabajo reciente. **No se ha inspeccionado el código de 0.7.1 ni verificado su publicación o su estado de revisión en la tienda.** No se deben trasladar los hallazgos de 0.5 a 0.7.1, ni usar la política de 0.7.1 para describir automáticamente el paquete público 0.5.

Recomendación: conservar UTILS, comprobar el estado de la nueva versión y alinear paquete publicado, URL de privacidad y declaraciones de la tienda. Si 0.7.1 elimina esta telemetría, verificar esa ausencia en el paquete exacto que se publique. Revisar además las funciones de cambio de ID, bloqueo, ámbito por dominio y CSP/CORS antes de anunciar compatibilidad comprobada.

## 2. GA4 Enhanced DebugView

### Publicación, funciones y fragilidad de interfaz

La [ficha de Chrome Web Store](https://chromewebstore.google.com/detail/ga4-enhanced-debugview-by/hgkkhcgpdigijpbclngegpckcabpjjej) consultada muestra versión 0.31 y actualización del 2 de septiembre de 2022. Declara tratamiento de actividad del usuario. El manifest incluye `storage`, `activeTab`, `scripting`, `tabs` y `webNavigation`, con acceso a `analytics.google.com` y `console.firebase.google.com`.

`script.js` obtiene datos de eventos desde elementos de la interfaz, depende de jQuery y de estructuras de datos de D3, y simula clics para mostrar parámetros en la consola. Ejemplos de dependencias observadas:

```javascript
window.jQuery
this.__data__
'g.stream-node-container > g.stream-node.clickable-node'
'ga-drill-in-panel'
'div.key-row.left-column'
```

Estas dependencias hacen necesaria una prueba con la interfaz actual; la lectura del código no demuestra que hoy fallen. La [documentación actual de GA4 DebugView](https://support.google.com/analytics/answer/7201382?hl=en) y la [de Firebase](https://firebase.google.com/docs/analytics/debugview) siguen describiendo la inspección de parámetros al seleccionar eventos. No se ha encontrado fundamento para afirmar que la vista nativa haya sustituido por completo la salida agrupada en consola que ofrece la extensión.

### Hallazgo verificable: telemetría y secreto incrustado

`background.js` conserva en `chrome.storage.local` un identificador aleatorio y el estado de activación. La función `sendAnalytics` intenta enviar solicitudes a los endpoints de Universal Analytics y de Measurement Protocol de GA4. En GA4 incluye `client_id`, nombre del evento, `is_it_on` y `full_url`.

Extracto reducido de la solicitud de GA4, con destino y secreto totalmente redactados:

```javascript
fetch('https://www.google-analytics.com/mp/collect?measurement_id=[REDACTED]&api_secret=[REDACTED]', {
  method: 'POST',
  body: JSON.stringify({
    client_id: cid,
    events: [{
      name: eventName,
      params: {
        is_it_on: isItOn,
        full_url: url
      }
    }]
  })
});
```

Las llamadas incluyen `page_view`, `click_on`, `click_off`, `first_installation` y `update`. Para los eventos de instalación/actualización se pasa URL nula. El código de navegación se orienta a las vistas de Analytics/Firebase; esta evidencia **no equivale a afirmar que envía todo el historial del navegador**. Tampoco demuestra el envío de los parámetros de eventos que la extensión imprime en consola.

El paquete contiene un secreto de Measurement Protocol incrustado. La [referencia oficial de Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference) indica que debe mantenerse privado. Si ese secreto continúa activo, conviene revocarlo o rotarlo. Su valor y los identificadores de destino no se reproducen aquí.

Recomendación: antes de volver a destacarla, hacer una prueba mínima con eventos reales de prueba en GA4 y Firebase, revisar el mecanismo de extracción de la interfaz y decidir si se elimina o se rediseña la telemetría. Ajustar la política y la ficha a lo que haga el paquete resultante. Si no se va a mantener y la prueba falla, conservarla como trabajo histórico y considerar archivar su fuente, si existe, en lugar de borrarla.

## 3. Firebase Analytics Protobuf Decoder

El [repositorio público](https://github.com/luratic/Firebase-Analytics-Protobuf-Decoder) contiene un README y `firebase_analytics_proto_by_luratic.desc`. Los commits observados corresponden al 16 de octubre de 2025; último commit consultado: `18cd53c47299f7f688f17fa1891f4e1830681ea3`.

Se leyó el descriptor binario, de 2878 bytes, sin ejecutar código. Sus cadenas identifican una definición `proto3` y mensajes para eventos, parámetros, propiedades de usuario e ítems, junto con campos del contexto de la app y de consentimiento y varios campos `unknown`. Es un **descriptor de esquema**, no un programa que capture o suba información por sí solo.

El README lo propone para interpretar capturas de Firebase Analytics en herramientas como Charles, Proxyman o mitmproxy. No se encontró en la raíz una fuente `.proto`, licencia explícita, captura de ejemplo ni matriz de versiones de SDK verificadas. Esta ausencia de documentación no demuestra incompatibilidad.

Recomendación: mantenerlo como utilidad especializada. Añadir un procedimiento reproducible con una captura desidentificada, herramienta y versión utilizadas, SDK Android/iOS probado, límites del descifrado y explicación de los campos desconocidos. Publicar la fuente `.proto` si se dispone de ella y puede distribuirse, y elegir una licencia con autorización del titular. La afirmación de compatibilidad debe apoyarse en capturas actuales, no en la fecha del repositorio.

## 4. gtag con protocolos personalizados

El [repositorio público](https://github.com/luratic/gtag-custom-protocol-support) contiene un README de un párrafo y dos copias amplias de Google tag: [`gtag.js`](https://github.com/luratic/gtag-custom-protocol-support/blob/main/gtag.js) y [`gtagqa.js`](https://github.com/luratic/gtag-custom-protocol-support/blob/main/gtagqa.js). El último commit observado es `28d1e02beeb78b1319604609d807624542083db6`, del 4 de noviembre de 2024. No se observaron releases publicadas ni licencia explícita en la raíz.

Los archivos son copias fijadas de la librería, de aproximadamente 578 KiB y 483 KiB, con configuración y un identificador concreto de medición GA4 incrustado. **No corresponde describirlos simplemente como una librería antigua de Universal Analytics.** Ambos incluyen el aviso de copyright de Google; no se ha realizado una evaluación de derechos de distribución.

Hay una diferencia funcional relevante entre los controles de protocolo. En `gtag.js`, líneas observadas 16025–16029:

```javascript
var QH = function(a) {
    var b = E.location.protocol;
    b !== "http:" && b !== "https:" && (S(29),
    a.isAborted = !0)
}
```

En `gtagqa.js`, líneas observadas 14292–14296:

```javascript
var TH = function(a) {
    var b = E.location.protocol;
    b !== "file:" && b !== "https:" && (S(29),
    a.isAborted = !0)
}
```

El primer guard sigue excluyendo `file:`; el segundo admite `file:` y `https:`, pero excluye `http:` en esa ruta. Se observó la llamada al guard de `gtag.js` dentro de su procesamiento de eventos. Es un hallazgo estático, no una prueba de todas las rutas de ejecución.

La promesa general del README sobre protocolos no estándar carece de instrucciones para elegir archivo, cambiar configuración, aplicar el parche o actualizar la librería base. Mantener copias completas implica revisar los cambios futuros de Google tag y comprobar que el parche sigue siendo correcto.

Recomendación: conservarlo como laboratorio o trabajo histórico con una advertencia concreta de compatibilidad no verificada. Para recomendarlo como herramienta actual harían falta un parche explicado, instrucciones de configuración y pruebas con `file:`, `http:` y `https:`. Si no existe intención de mantener ese trabajo, archivarlo es razonable. Su fecha por sí sola no basta para retirarlo.

## 5. Plantillas cuyo servicio ha sido retirado

Estas tres plantillas son candidatas a salir del catálogo de herramientas vigentes y conservarse como trabajos históricos, con su URL, autoría y enlace al código. Las tres plantillas se han marcado como discontinuadas en el catálogo y su documentación histórica. Sus repositorios conservan el código como referencia.

| Recurso | Evidencia primaria | Recomendación |
| --- | --- | --- |
| Oracle BlueKai DMP | Las [FAQ oficiales de Oracle](https://www.oracle.com/contracts/docs/oracle-advertising-end-of-life-faqs.pdf) fijan el fin de todos los productos y servicios de Oracle Advertising el 30 de septiembre de 2024, incluyendo expresamente Oracle Marketing Cloud Data Management Platform. | Conservar como histórico y retirar la invitación a instalar para nuevas implementaciones. |
| Salesforce Audience Studio | [Salesforce Help](https://help.salesforce.com/s/articleView?id=000879892&language=en_US&type=1) fija la retirada de Audience Studio el 1 de febrero de 2024, con pérdida de acceso a su aplicación y servicios. | Conservar como histórico y retirar la invitación a instalar. |
| Salesforce Event Tracker | El [código de Luratic](https://github.com/luratic/SalesForce/blob/master/template.tpl), blob `72f550756ff923035e6cca3932c2691bff0ce01e`, construye un píxel hacia `https://beacon.krxd.net/event.gif` con `event_id` y `event_type`; pertenece al antiguo entorno Krux/Audience Studio. | Aplicar el mismo tratamiento histórico. La conclusión se deriva de la integración técnica y del cierre de Audience Studio; no de un anuncio separado con el nombre de esta plantilla. |

La adquisición de Ligatus o la antigüedad de otras bibliotecas no bastan, por sí solas, para dar una integración por retirada. La compatibilidad concreta de las restantes plantillas no se ha validado de extremo a extremo en esta revisión.

Archivar un repositorio puede ser razonable cuando se ha decidido cesar su mantenimiento: GitHub lo conserva accesible y lo convierte en solo lectura, de forma reversible. Antes conviene actualizar su README con el estado y el motivo. Véase [la documentación de GitHub](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories). La retirada del catálogo activo es independiente del archivo del repositorio.

## 6. Políticas y URLs preservadas

Se comprobaron por HTTP las tres URLs públicas siguientes el 27 de octubre de 2026. Todas respondieron **200** en su dirección con barra final. La variante sin barra final condujo a esa misma política y terminó también en 200:

- https://www.luratic.com/privacy-policy/
- https://www.luratic.com/posts/entradas/privacypolicy/
- https://www.luratic.com/google-analytics-utils/privacy-policy/

Las tres fuentes del rediseño coinciden byte a byte con el commit original `90ef7ff5533fb69d2dc2c439037337749514aa38`. La política estática de UTILS también coincide byte a byte con la respuesta pública consultada. Las tres páginas se generan en sus rutas originales, sin aliases ni cambio de dirección.

Se añadió [check_privacy.py](../scripts/check_privacy.py) a los comandos de compilación de Netlify. Comprueba las fuentes originales, la presencia de HTML físico y la integridad del texto y los enlaces renderizados. Las pruebas negativas verificaron que rechaza una página borrada, una fuente o contenido renderizado modificados y una sustitución por meta-refresh. Esto protege la conservación durante la migración; no sustituye la revisión de correspondencia entre el comportamiento de cada extensión y sus declaraciones.

## Límites y siguiente comprobación útil

No se ha usado una sesión de GA4/Firebase, instalado extensiones, ejecutado su JavaScript, realizado envíos a sus recolectores, consultado datos del editor ni probado capturas móviles. No se conocen las intenciones de mantenimiento o el estado de aprobación de nuevas versiones. No se ha auditado el código de UTILS 0.7.1 ni la totalidad de dependencias o rutas posibles de ejecución. No se verificó la aceptación o almacenamiento de ninguna solicitud de telemetría; la presencia de `fetch` demuestra intención del código, no entrega.

El siguiente paso con mayor valor es revisar el paquete de UTILS destinado a publicación y hacer una prueba funcional breve de DebugView con un evento conocido. Eso permite decidir promoción y mantenimiento con evidencia. Para las utilidades, una captura móvil de prueba y un ejemplo reproducible por protocolo bastan para empezar a documentar límites reales. No hace falta borrar repositorios para realizar estas comprobaciones.
