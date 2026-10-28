# Mantener la web de Luratic

La web usa **Hugo 0.168.0**, plantillas propias y contenido en Markdown. GitHub guarda el código y el historial; Netlify compila y publica. Para actualizar una herramienta o una trayectoria no hace falta modificar el diseño, instalar npm ni mantener una base de datos.

## Dónde se cambia cada cosa

| Contenido | Ubicación |
| --- | --- |
| Herramientas, extensiones y plantillas del catálogo | `content/recursos/<slug>.md` |
| Selección, orden y resumen breve de las tarjetas de portada | `data/home.json` |
| Perfiles y trayectoria profesional | `content/equipo/<slug>.md` |
| Documentación histórica de etiquetas | `content/posts/templates/tags/` |
| Documentación histórica de variables | `content/posts/templates/variables/` |
| Política de GA4 Enhanced DebugView, en sus dos rutas históricas | `content/privacy-policy.md` y `content/posts/entradas/privacypolicy.md` |
| Política de Google Analytics UTILS | `content/google-analytics-utils/privacy-policy.md`; original íntegro en `assets/privacy/google-analytics-utils-original.html` |
| Logos originales de Luratic | `static/images/site/main-logo.png` e `inverted-logo.png` |
| Imágenes y otros archivos públicos | `static/` |
| Plantillas de presentación | `layouts/` |
| Configuración general y dominio canónico | `config.yaml` |
| Compilación por entorno de Netlify | `netlify.toml` |
| Comprobación local del resultado | `scripts/check_site.py` |

Una ruta dentro de `static/` se publica sin ese prefijo. Por ejemplo, `static/images/site/main-logo.png` se usa en la web como `/images/site/main-logo.png`.

## Mantener la portada

La portada presenta cinco herramientas en este orden: **GA4 Spy → GA4 Spy · Cheatsheet → Google Analytics UTILS → GA4 Enhanced DebugView → Microsoft Clarity**.

La navegación principal lleva las plantillas a la página autónoma `/plantillas/`; los filtros de la portada siguen siendo controles locales de los cinco destacados. El orden del array `tools` en `data/home.json` determina tanto el orden visual como el de lectura y teclado. No depende del campo `weight` del catálogo.

Cada entrada contiene `slug`, `summary`, `icon` y `screenshot` (`src` y `alt`). El nombre, categoría, URL de la ficha, enlace externo y aviso de actualización se leen de `content/recursos/<slug>.md`; no los dupliques en los datos de portada. El campo `summary` es una descripción corta adaptada a la tarjeta. Las fichas de las webs mantienen el crédito a Brais. La sección del equipo sigue inmediatamente al catálogo destacado. La portada no muestra una sección de conceptos introductorios.

Las capturas originales de portada se guardan en `assets/home/`. Hugo genera miniaturas WebP de 220 y 440 píxeles y el navegador elige el tamaño adecuado mediante `srcset`. Conserva capturas reales, indica su procedencia en `docs/MEDIA_SOURCES.json` y escribe un texto alternativo descriptivo. La captura se muestra en la franja superior de la tarjeta y enlaza a la ficha del recurso.

La portada sigue la referencia «Cercana · escritorio · 1440 px» aportada por el usuario. En escritorio amplio las cinco tarjetas aparecen en una fila; en anchos intermedios se redistribuyen sin cambiar el orden. Por debajo de 760 px forman una tira horizontal con desplazamiento y ajuste por tarjeta. Los vídeos, galerías y explicaciones completas permanecen en las fichas; la portada no carga sus scripts ni reproductores.

El layout de portada está en `layouts/index.html`, la tarjeta compartida en `layouts/partials/home-tool.html`, su cabecera y pie en `layouts/partials/home/` y los estilos específicos en `static/assets/redesign/home.css`. Las reglas de portada no se aplican a las fichas ni a las políticas. Las fuentes Archivo y JetBrains Mono se sirven desde `static/fonts/`, con sus licencias OFL. La referencia se ha adaptado a HTML de Hugo y JavaScript local; no se publica el runtime React/DC del archivo de diseño.

Los filtros y la búsqueda de `static/assets/redesign/home.js` actúan sobre los cinco destacados. «Todo» muestra ese recuento; el enlace al catálogo muestra el total real de recursos y conserva `tipo` y `q` al abrir `/recursos/`. Los recuentos globales y los datos de los perfiles se generan a partir del contenido. Las biografías completas permanecen en `/equipo/`.

El panel «Tu visita, en directo» es una **demo local identificada en su propia interfaz**. Ilustra las interacciones reales con filtros, búsqueda y enlaces; no inventa selecciones iniciales. Conserva solo las últimas seis líneas en memoria y se reinicia al cargar. El código `gtag` y `dataLayer.push` se representa mediante nodos de texto: no se ejecuta, no escribe cookies ni almacenamiento y no hace peticiones. Los botones de consentimiento solo cambian el ejemplo y nunca las preferencias reales ni la integración de GTM. En móvil el panel se despliega desde «Ver tu visita».

## Añadir o editar una herramienta

Lo más sencillo es copiar una ficha de la misma categoría y cambiar sus datos. El nombre del archivo determina su dirección: `content/recursos/mi-herramienta.md` genera `/recursos/mi-herramienta/`. Usa nombres cortos, en minúsculas y con guiones.

La cabecera puede estar escrita en YAML entre `---` o en JSON, como en las fichas existentes. No mezcles los dos formatos ni repitas claves. Después de la cabecera va el texto en Markdown.

Ejemplo de ficha en preparación; completar los enlaces y retirar `draft: true` antes de publicarla:

```yaml
---
title: "Nombre de la herramienta"
description: "Qué problema resuelve y a quién le sirve, en una o dos frases."
category: "extension"
tags: ["GA4", "Chrome"]
repo: ""
installUrl: ""
docsUrl: ""
featured: false
weight: 50
status: "published"
attribution: "Luratic"
icon: "puzzle"
sources: []
draft: true
---

## Para qué sirve

Explica una tarea concreta que facilita la herramienta.

## Cómo empezar

Incluye los pasos necesarios o enlaza su documentación verificada.
```

| Campo | Cómo mantenerlo |
| --- | --- |
| `title` | Nombre real del proyecto. |
| `description` | Resumen específico; evita copiar una descripción genérica de otra herramienta. |
| `category` | `extension`, `template`, `web` o `utility`. |
| `tags` | Lista breve de tecnologías o usos, con la misma escritura que las fichas existentes. |
| `repo` | URL pública del repositorio correspondiente. |
| `installUrl` | Enlace real de instalación o al archivo: Chrome Web Store en extensiones, archivo `.tpl` en las plantillas importables y archivo de descarga en utilidades. |
| `docsUrl` | Documentación publicada, local o externa. |
| `featured` | `true` para destacar la ficha en los espacios que muestran recursos destacados. |
| `weight` | Orden editorial; usa los valores existentes como referencia. |
| `status` | `published` identifica una publicación; no certifica mantenimiento, compatibilidad ni soporte activo. |
| `attribution` | Autoría o atribución pública comprobada. |
| `license` | Opcional. Añadir solo si la licencia aparece en una fuente del proyecto. |
| `icon` | Reutilizar un identificador presente, como `puzzle`, `code` o `terminal`. |
| `accent` | Opcional. Reutilizar un valor de otra ficha para mantener la paleta existente. |
| `sources` | Lista de URLs públicas que respaldan la ficha. No incluir notas privadas ni credenciales. |
| `demo` | Opcional: `clarity`, `utils`, `debugview`, `spy` o `data`. Activa el vídeo oficial o el recorrido visual asociado. |
| `releaseNotice` | Aviso visible sobre una actualización pendiente o una limitación de versión. |
| `privacyUrl` | Ruta original de la política de esa herramienta; conservarla. |
| `draft` | `true` excluye la ficha de una compilación normal de Hugo. |

Comprueba que los enlaces pertenecen al proyecto correcto. Si falta una funcionalidad, una licencia o un dato, deja el campo opcional vacío hasta disponer de una fuente. Un repositorio accesible no implica que la herramienta siga siendo compatible con todas las versiones de la plataforma.

Para retirar una herramienta, conserva una página informativa o una redirección útil desde su URL anterior. Cambiar el título no requiere cambiar el nombre del archivo; evita renombrar direcciones ya enlazadas desde otras webs sin conservar su ruta.

## Actualizar un perfil

Los perfiles viven en `content/equipo/<slug>.md`. Copia el formato del perfil existente y edita sus datos, sin tocar los layouts.

```yaml
---
title: "Nombre Apellidos"
displayName: "Nombre"
role: "Especialidad profesional"
description: "Presentación breve y comprobada."
focus: ["Analítica digital", "Desarrollo de herramientas"]
timeline:
  - period: "Periodo verificado"
    role: "Responsabilidad o contribución"
    company: "Organización o proyecto"
    description: "Qué hizo y por qué resulta relevante."
links:
  - label: "GitHub"
    url: "https://github.com/usuario"
photo: ""
weight: 10
draft: true
---

Texto de presentación en Markdown.
```

Sustituye los valores ilustrativos por datos reales. `photo` puede referenciar una fotografía existente bajo `static/`. No rellenes una trayectoria con ejemplos del antiguo tema ni deduzcas fechas de empleo a partir de fechas de publicación. Una colaboración, la autoría de una herramienta y un puesto profesional son datos diferentes.

La interfaz, el catálogo y los perfiles se mantienen en español. Las rutas históricas con `/es/` se conservan mediante aliases de Hugo y redirecciones de Netlify hacia sus documentos canónicos. No crees copias que aparenten una traducción cuando el texto es el mismo.

## Mantener las demos y las intervenciones

Los medios y textos se mantienen en `data/demos.json`. Los recorridos de Clarity y las dos herramientas web usan `steps`; UTILS y Enhanced DebugView usan `video` y `gallery`. No sustituyas una grabación de producto por transiciones automáticas de capturas.

Las extensiones muestran los vídeos originales enlazados en sus fichas de Chrome Web Store. `video` contiene `id`, `url`, `title`, `poster`, `duration`, `published` y `note`. Los pósteres y las seis capturas de tienda están en `static/images/demos/store/`; su procedencia, fecha de consulta y hashes figuran en `docs/MEDIA_SOURCES.json`. Se conservan los archivos originales, sin retocar su contenido.

`gallery` agrupa las capturas actuales aportadas por Luratic (`group: current`) y las de la tienda (`group: store`). Las de tienda están bajo un desplegable: el material de UTILS incluye controles de Universal Analytics y corresponde a una versión anterior. Los PNG actuales están en `static/images/demos/`. Las imágenes se amplían a petición del visitante; no avanzan, se recortan ni hacen zoom automáticamente. Conserva fuentes y fechas, y verifica cualquier dato de ejemplo antes de añadir nuevas capturas.

El componente de las extensiones vive en `layouts/partials/extension-media.html`, con estilos en `static/assets/redesign/extension-media.css` y comportamiento en `static/assets/redesign/extension-media.js`. El reproductor de YouTube en modo de privacidad mejorada solo se crea al pulsar «Ver demostración». Hasta entonces, el póster es local y no hay peticiones de este componente a YouTube. Conserva `referrerpolicy="strict-origin-when-cross-origin"` para que YouTube reciba el origen necesario. El enlace externo al vídeo permanece disponible; sin JavaScript, funciona el enlace normal. Las capturas conservan también su enlace al original sin JavaScript.

La recreación de Clarity vive en `layouts/partials/demos/clarity.html` y se identifica como ilustrativa. Sus controles y los recorridos de las webs permanecen en `static/assets/redesign/demos.js`; se pausan fuera de pantalla y comienzan detenidos con la preferencia de movimiento reducido. No ejecutan las herramientas ni inyectan etiquetas.

La ficha de UTILS describe la actualización 0.7.1, publicada en Chrome Web Store. Las capturas actuales documentan su interfaz y el vídeo oficial de 2022 sigue etiquetado como una versión anterior. DebugView se presenta con su salida actual en la consola de Chrome.

En los perfiles, `bio` es la presentación breve junto a la foto; el cuerpo Markdown desarrolla capacidades, forma de trabajar y contexto. `talks` contiene `title`, `event`, `date`, `role`, `description` opcional y `url`. Mantén las fechas como texto cuando solo se conozca un intervalo. Distingue una ponencia, una conversación, una tarea de organización y la asistencia a un evento.

## Ver los cambios en local

Instala la misma versión de Hugo que fija `netlify.toml` y ejecuta los comandos desde la raíz del repositorio:

```bash
hugo version
hugo server --environment development --disableFastRender
```

El servidor indica la URL local. Para revisar una ficha todavía marcada como borrador puedes añadir `--buildDrafts` a ese comando local. No añadas esa opción a los comandos de publicación de Netlify.

Para generar y comprobar una versión de revisión sin activar la medición de producción:

```bash
hugo --environment preview --gc --minify --cleanDestinationDir --destination public --baseURL http://localhost:1313/
python3 scripts/check_site.py --public public --check-legacy --site-url http://localhost:1313 --site-url https://luratic.com --site-url https://www.luratic.com
```

`public/` contiene únicamente el resultado generado. `--cleanDestinationDir` evita que archivos de una compilación anterior oculten rutas eliminadas; no guardes documentos manuales dentro de esa carpeta.

El script solo usa la biblioteca estándar de Python 3 y archivos locales; no hace peticiones de red. Devuelve código `0` si todo está correcto y `1` si encuentra incidencias. Comprueba:

- Enlaces, imágenes, scripts y otros recursos locales referenciados desde HTML, resolviendo rutas relativas, directorios con `index.html` y caracteres codificados en las URLs.
- Títulos vacíos o ausentes en páginas de contenido. Los redirects HTML de Hugo sin título están permitidos.
- Publicación accidental de los borradores históricos de Firebase.
- Las 82 rutas históricas de plantillas —41 fichas con sus rutas originales y `/es/`— y las 2 rutas de privacidad cuando se usa `--check-legacy`.

También interpreta redirecciones incondicionales de `public/_redirects`, incluyendo `/es/* /:splat 301`, y comprueba sus destinos locales. No considera una reescritura general de una aplicación una prueba de que todas las páginas antiguas existan.

Para ampliar el control de direcciones, prepara un archivo JSON con una lista de rutas, por ejemplo `["/recursos/mi-herramienta/", "/equipo/txema/"]`, y pásalo con `--legacy-manifest ruta/al/manifiesto.json`. Las URLs externas, los enlaces de correo y los fragmentos no se comprueban. `--site-url` permite tratar como locales las URLs absolutas de un dominio propio.

El script no sustituye la revisión visual: abre portada, catálogo, una ficha larga, ambos perfiles y una página histórica en escritorio y móvil. Comprueba que los filtros, el menú y la navegación con teclado funcionan.

## Revisar y publicar en Netlify

La entrega inicial se prepara en la rama local `redesign/2026`, a partir del commit `90ef7ff5533fb69d2dc2c439037337749514aa38`. El acceso de GitHub disponible durante la preparación es de lectura: no se ha publicado esa rama ni se ha cambiado la web en producción.

Una preview privada de Sites es independiente del sitio de Netlify y sirve para revisar el resultado. No cambia el dominio de Luratic ni sustituye la validación de un Deploy Preview de Netlify.

Cuando haya acceso de escritura y se vaya a integrar la renovación:

1. Subir la rama de trabajo al mismo repositorio y abrir un pull request contra la rama de producción configurada en Netlify.
2. Comprobar el Deploy Preview generado para ese pull request. Si no aparece, revisar que el repositorio está conectado, que los Deploy Previews están habilitados y que Netlify permite desplegar los cambios de ese colaborador.
3. Revisar que Netlify usa Hugo 0.168.0, publica `public/`, toma el dominio de la preview en ese entorno y no carga la medición de producción.
4. Ejecutar las comprobaciones anteriores y revisar las URLs históricas y las políticas de privacidad.
5. Tras aprobar la versión concreta, integrar el pull request. Con el despliegue continuo y la publicación automática activados, Netlify construirá y publicará la rama de producción.
6. Comprobar la portada, una ficha, un perfil, una URL antigua con `/es/` y la política de privacidad en el dominio real.

No hace falta crear otro repositorio, cambiar el DNS o mover el dominio para renovar la web existente. El diseño se integra en el proyecto actual. Un Deploy Preview de Netlify no es privado por defecto: si se necesita limitar el acceso, configurar la protección disponible en ese proyecto.

La documentación de Netlify explica [los Deploy Previews y sus requisitos](https://docs.netlify.com/deploy/deploy-types/deploy-previews/) y [las diferencias de acceso entre opciones de preview](https://docs.netlify.com/deploy/compare-preview-options/).

## Volver a la versión anterior

Si el despliegue publicado presenta un problema, en Netlify abre un despliegue anterior que figure como satisfactorio y usa **Publish Deploy** para volver a publicarlo. Después revierte la integración problemática en GitHub mediante un nuevo commit o el flujo de reversión del pull request, revisa su preview y conserva el historial.

La restauración en Netlify no revierte por sí sola el código de GitHub. Si la publicación automática sigue activa, el siguiente despliegue de producción puede reemplazar la versión restaurada. Netlify documenta este comportamiento en [Manage deploys: Rollbacks](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/#rollbacks).

## Privacidad, medición y compatibilidad

Estas tres direcciones deben seguir sirviendo sus políticas originales, cada una en su propio HTML:

| URL exacta | Archivo fuente que se conserva |
| --- | --- |
| `/privacy-policy/` | `content/privacy-policy.md` |
| `/posts/entradas/privacypolicy/` | `content/posts/entradas/privacypolicy.md` |
| `/google-analytics-utils/privacy-policy/` | `assets/privacy/google-analytics-utils-original.html`, publicado mediante `content/google-analytics-utils/privacy-policy.md` |

Las extensiones pueden enlazar directamente a estas rutas. Durante una renovación visual se mantienen las tres, cada una con HTML directo, sin sustituirlas por aliases, redirecciones a otra política o una página común. Las dos primeras contienen la política de GA4 Enhanced DebugView del 16 de marzo de 2022; su texto normalizado coincide, aunque conservan una diferencia en la barra final de un enlace. La tercera corresponde a Google Analytics UTILS 0.7.1, con fecha de vigencia del 27 de octubre de 2026. Compartir presentación no combina sus documentos ni actualiza sus fechas.

Las tres páginas usan `layouts/partials/privacy.html` y `static/assets/redesign/privacy.css`. Las dos fuentes Markdown permanecen intactas. El HTML original de UTILS se trasladó byte a byte desde `static/google-analytics-utils/privacy-policy/index.html` a `assets/privacy/google-analytics-utils-original.html`. Hugo extrae su `main` para integrarlo en la presentación común, conservando el encabezado con producto, título, fecha y versión, todo el texto legal y los destinos de sus enlaces.

La navegación común, fuera del artículo legal, enlaza las políticas de Enhanced DebugView y UTILS. La ruta histórica duplicada mantiene seleccionado Enhanced DebugView y sigue mostrando su propio documento directamente. El enlace «Privacidad» del pie permite llegar así a ambos productos. `content/google-analytics-utils/_index.md` evita publicar un índice automático adicional mediante `build.render: never` y `build.list: never`; esas opciones se aplican al índice, sin `cascade`, y la página hija conserva su publicación normal.

La única exclusión de ese fragmento es el `footer` de marca que decía «Made in Galicia with love and sentidiño 💙». Ese pie permanece en el archivo original archivado y protegido por su SHA-256; queda fuera del artículo legal publicado, que utiliza el pie común de la web con el mensaje de marca en gallego. El cambio no elimina ni reescribe ningún párrafo legal.

`scripts/check_privacy.py` protege este contrato. Se ejecuta después de Hugo en los tres comandos de Netlify: producción, Deploy Preview y despliegue de rama. Si falla, el comando termina con error y esa versión no supera la compilación. Para ejecutarlo en local después de generar la web:

```bash
python3 scripts/check_privacy.py --public public
```

El control compara el SHA-256 de las tres fuentes completas con sus referencias del commit `90ef7ff5533fb69d2dc2c439037337749514aa38`, exige un `index.html` físico en cada ruta y rechaza las páginas con `meta-refresh`. En las tres políticas compara también la huella del texto normalizado y de los destinos de sus enlaces dentro de `article.legacy-prose`, para detectar que las plantillas recorten o alteren el contenido aunque la fuente siga intacta. La normalización permite diferencias de espacios y de minificación; no incluye la cabecera, la navegación ni el pie comunes del sitio.

Los baselines de las dos políticas Markdown se conservan sin cambios. El de UTILS se calculó directamente desde el `main` del HTML original, excluyendo únicamente el `footer` de marca descrito arriba, antes de aplicar el nuevo diseño. En cada ejecución el script vuelve a comprobar que esa huella corresponde al fragmento del original archivado, además de compararla con la publicación. No se toma el HTML rediseñado como referencia para aprobarse a sí mismo.

No se necesitan paquetes de Python ni otra instalación: el script usa la biblioteca estándar y Netlify [incluye Python 3 en su entorno de compilación](https://docs.netlify.com/build/configure-builds/available-software-at-build-time/). Hugo permanece fijado en 0.168.0.

Un cambio deliberado de una política requiere revisar su contenido, su URL y su HTML generado, y actualizar expresamente las huellas correspondientes en `POLICIES`, dentro del script, en el mismo cambio revisado. No se regeneran las huellas automáticamente para hacer pasar una compilación. Este control verifica la conservación de documentos y direcciones; **no certifica la validez legal de las políticas**.

El contenedor existente es `GTM-5D7RV9H`, cargado desde `https://analytics.luratic.com/gtm.js`. La medición conserva el evento `custom_page_view` y los objetos `page` y `context`, dentro de `head` como en la web original. Su carga queda limitada al entorno `production` y al dominio canónico configurado: local, preview de Sites, Deploy Previews y despliegues de rama no deben enviar esas visitas a la medición real. La página de privacidad de UTILS lleva `noTracking: true` y permanece sin GTM incluso en producción, conservando el comportamiento del HTML original.

Para comprobar los HTML generados, ejecuta el modo correspondiente sobre cada directorio de salida:

```bash
node scripts/check_tracking.mjs --public public --preview
node scripts/check_tracking.mjs --public /tmp/luratic-production-check --production
```

Este control usa solo módulos incluidos en Node.js. En producción exige una única carga del contenedor por el proxy y un único evento `custom_page_view` con `event_name=page_view`, `page_type`, `page_category`, `page_section` y `language`, antes del cuerpo de cada página de Hugo con medición. En preview exige que no aparezcan el endpoint, el identificador del contenedor ni ese evento. La política de UTILS se comprueba expresamente en ambos modos: debe existir y no contener esos marcadores, incluso en producción. Los aliases quedan excluidos. Ejecuta los scripts inline en una VM con un DOM simulado, sin descargar scripts externos ni hacer peticiones de red; comprueba el HTML generado y no valida el funcionamiento remoto de las etiquetas de GTM o de GA.

Al cambiar de versión de Hugo, modifica el pin en `netlify.toml` y valida el resultado antes de integrar. Las antiguas fichas tenían claves YAML duplicadas y textos de ejemplo; no los recuperes al copiar contenido. El logo configurado es el de `static/images/site/`, no los gráficos genéricos que acompañaban al antiguo tema.

Las compilaciones de Netlify ejecutan tanto el control de privacidad como el de tracking antes de publicar. El comprobador de tracking requiere Node.js 18 o posterior y no utiliza dependencias npm.

Los mensajes de origen de marca se mantienen en gallego: «Feito en Galicia, aberto ao mundo» en portada y «Feito en Galicia. Compartido con todo o mundo» en el pie común, con `lang="gl"`. La interfaz general sigue en español y los documentos de privacidad conservan su idioma original.


## Consentimiento y analítica (octubre de 2026)

Luratic inicializa Google Consent Mode v2 antes de cargar GTM. Sin una elección guardada, `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` empiezan en `denied`. El banner permite aceptar o rechazar la categoría Analítica y guarda la elección en `localStorage` bajo `luratic_consent_v1`; publicidad permanece siempre denegada.

GA4 y Microsoft Clarity se gestionan con ese estado de consentimiento. Si se desea pasar de Consent Mode avanzado a básico —es decir, que las etiquetas no carguen en absoluto antes de aceptar— hay que revisar también los consent settings y triggers dentro del contenedor GTM.

El page view se envía con:

```js
{
  event: 'custom_page_view',
  event_name: 'page_view',
  page_type: '...',
  page_category: '...',
  page_section: '...',
  language: 'es' // o 'en'
}
```

Las interacciones utilizan `custom_event` y nombres estables como `click_menu`, `click_hamburger_menu`, `click_footer`, `click_button`, `click_link` y `click_card`. `link_text` se normaliza en cliente y `link_url` conserva la URL absoluta. El campo `option` se usa solo cuando aporta contexto.

Los eventos del banner usan el mismo evento genérico y los nombres `cookies_banner_impression`, `cookies_accept_all`, `cookies_reject_all`, `cookies_open_settings` y `cookies_save_preferences`.
