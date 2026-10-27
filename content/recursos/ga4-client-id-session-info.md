{
  "slug": "ga4-client-id-session-info",
  "category": "template",
  "description": "Obtén el Client ID, el Session ID o el número de sesión de GA4 desde una variable de GTM.",
  "repo": "https://github.com/luratic/ga4_get_client_id_and_session_info",
  "installUrl": "https://raw.githubusercontent.com/luratic/ga4_get_client_id_and_session_info/main/template.tpl",
  "docsUrl": "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/README.md",
  "sourceUrl": "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/template.tpl",
  "tags": [
    "GA4",
    "Variables",
    "Depuración"
  ],
  "featured": true,
  "status": "published",
  "license": "Apache-2.0",
  "unofficial": false,
  "attribution": "Alfonso Rodríguez, Txema Sánchez y Brais Calvo.",
  "contributors": [
    "Alfonso Rodríguez",
    "Txema Sánchez",
    "Brais Calvo"
  ],
  "templateType": "variable",
  "title": "GA4 Client ID & Session Info",
  "weight": 3,
  "sources": [
    "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/template.tpl",
    "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/README.md"
  ],
  "icon": "code",
  "accent": "violet",
  "legacyDocs": ""
}

## Qué puedes hacer

Variable para consultar los identificadores de GA4 mediante la API nativa `readAnalyticsStorage`. Puedes elegir Client ID, Session ID o Session Number; los datos de sesión requieren un Measurement ID. Resulta útil para depurar la atribución y preparar datos para otras etiquetas. La lectura depende de que `analytics_storage` esté disponible.

## Código y configuración

El repositorio incluye el archivo de la plantilla. Consulta su documentación y revisa la configuración y los permisos antes de incorporarla a tu contenedor de Google Tag Manager.
