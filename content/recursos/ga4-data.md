{
  "slug": "ga4-data",
  "category": "web",
  "description": "Consulta dimensiones, métricas, eventos y límites de GA4, y prepara enlaces de informes, comparaciones y dashboards.",
  "repo": "",
  "installUrl": "https://data.ga4spy.com/",
  "docsUrl": "https://data.ga4spy.com/docs/shadow-api",
  "sourceUrl": "https://data.ga4spy.com/",
  "tags": [
    "GA4",
    "Dimensiones y métricas",
    "Documentación",
    "Informes"
  ],
  "featured": true,
  "status": "published",
  "unofficial": true,
  "attribution": "Creada por Brais Calvo.",
  "contributors": [
    "Brais Calvo"
  ],
  "title": "GA4 Spy / Data",
  "weight": 5,
  "sources": [
    "https://data.ga4spy.com/",
    "https://data.ga4spy.com/ga4-events-parameters",
    "https://data.ga4spy.com/ga4-vs-ga4-360",
    "https://data.ga4spy.com/report-builder",
    "https://data.ga4spy.com/report-builder/comparisons",
    "https://data.ga4spy.com/report-builder/dashboard",
    "https://data.ga4spy.com/docs/shadow-api",
    "https://data.ga4spy.com/changelog"
  ],
  "icon": "code",
  "accent": "pink",
  "legacyDocs": "",
  "demo": "data"
}

## Una referencia de GA4 para pasar de la duda al informe

**GA4 Spy / Data**, presentada en la web como **ga4spy/data**, reúne una referencia consultable de dimensiones, métricas, eventos y parámetros de Google Analytics 4. Creada por Brais Calvo, añade herramientas para preparar informes, comparaciones y dashboards mediante enlaces que se abren en GA4.

Te ayuda cuando reconoces el nombre de un campo en un informe, pero necesitas encontrar su equivalente técnico, entender su ámbito o comprobar dónde está disponible. También sirve para preparar una propuesta de análisis antes de configurarla en la propiedad.

## Encuentra el campo adecuado

El [catálogo de dimensiones y métricas](https://data.ga4spy.com/) permite buscar por nombre, identificador de la interfaz o nombre de API. Puedes separar dimensiones y métricas, filtrar por categoría y revisar las marcas de disponibilidad en Looker Studio, exploraciones y Data API.

El ámbito y el contexto del campo ayudan a formular mejor la pregunta. Por ejemplo, al preparar un análisis de adquisición conviene distinguir los campos relativos a la sesión de los asociados al primer contacto del usuario. La ficha de un campo permite investigar esas diferencias antes de elegirlo por una etiqueta parecida.

Esta referencia es útil al coordinar trabajo entre analistas y desarrollo: permite señalar el campo concreto que buscas y evita dar por hecho que su nombre visible en GA4 coincide con el utilizado en una petición de API.

## Eventos, parámetros y diferencias entre ediciones

La sección [Events & parameters](https://data.ga4spy.com/ga4-events-parameters) reúne eventos recomendados, automáticos y de medición mejorada, además de entradas marcadas como obsoletas. Las páginas de detalle relacionan los eventos con sus parámetros, valores esperados y disponibilidad por plataforma.

También hay una sección de límites y nombres reservados. Puede ayudarte a preparar un plan de medición: buscar una acción, comprobar si existe un evento recomendado y revisar sus parámetros antes de definir nombres nuevos.

La [comparativa de GA4 y GA4 360](https://data.ga4spy.com/ga4-vs-ga4-360) organiza diferencias de límites, cuotas, funciones y retención. Úsala como punto de consulta y verifica las condiciones aplicables a tu propiedad antes de tomar una decisión sobre capacidad o contratación.

## Tres constructores para preparar tu análisis

| Constructor | Qué preparas |
| --- | --- |
| [Report Builder](https://data.ga4spy.com/report-builder) | Dimensiones, métricas, filtros y título de un informe, junto con el identificador de la propiedad de destino. |
| [Comparison Builder](https://data.ga4spy.com/report-builder/comparisons) | Condiciones de comparación para observar grupos lado a lado en GA4. |
| [Dashboard Builder](https://data.ga4spy.com/report-builder/dashboard) | Un conjunto de tarjetas y visualizaciones: indicadores, tablas, líneas, barras, columnas, anillos o embudos. |

El constructor de dashboards también muestra una opción para importar una URL del builder y reconstruir sus tarjetas. Esto permite retomar una configuración expresada en un enlace compatible.

## Un caso práctico: preparar un informe de adquisición

Quieres revisar el comportamiento de varias fuentes de tráfico con un criterio común. Primero buscas los campos de adquisición y compruebas su ámbito y disponibilidad. Después preparas el informe con las dimensiones y métricas pertinentes y añades los filtros que delimitan tu análisis.

1. Abre el catálogo y localiza los campos que necesitas.
2. Revisa sus nombres técnicos y su contexto; evita elegir solo por similitud de nombre.
3. Entra en **Report Builder**, introduce el ID numérico de la propiedad y añade dimensiones, métricas y filtros.
4. Revisa la configuración y utiliza **Open in GA4** o copia el enlace generado.
5. En tu sesión de GA4, comprueba los resultados, ajusta la configuración y guarda el informe si tienes los permisos necesarios.

El enlace transporta la configuración del análisis. Los datos y permisos siguen perteneciendo a tu propiedad de Analytics.

## Qué debes tener en cuenta

Los builders abren GA4 en tu propia sesión; no consultan la propiedad en tu nombre. La interfaz indica que crear informes o dashboards requiere acceso de Editor o Administrador.

La [documentación del mecanismo de URLs](https://data.ga4spy.com/docs/shadow-api) explica que utiliza un formato no documentado oficialmente por Google. Sus nombres y parámetros pueden cambiar. Por eso conviene verificar el resultado al abrirlo, especialmente si reutilizas un enlace antiguo.

La disponibilidad de un campo en el catálogo no garantiza que cualquier combinación produzca el informe esperado: también cuentan el ámbito, la configuración y los datos de la propiedad. El [changelog](https://data.ga4spy.com/changelog) ayuda a seguir incorporaciones, cambios de nombre, capacidades y retiradas.

Para investigar la configuración publicada de una web o contenedor, continúa en [GA4 Spy](/recursos/ga4-spy/).
