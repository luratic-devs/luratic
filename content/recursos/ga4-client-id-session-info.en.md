{
  "slug": "ga4-client-id-session-info",
  "category": "template",
  "description": "Get the GA4 Client ID, Session ID or session number from a GTM variable.",
  "repo": "https://github.com/luratic/ga4_get_client_id_and_session_info",
  "installUrl": "https://raw.githubusercontent.com/luratic/ga4_get_client_id_and_session_info/main/template.tpl",
  "docsUrl": "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/README.md",
  "sourceUrl": "https://github.com/luratic/ga4_get_client_id_and_session_info/blob/main/template.tpl",
  "tags": [
    "GA4",
    "Variables",
    "Debugging"
  ],
  "featured": true,
  "status": "published",
  "license": "Apache-2.0",
  "unofficial": false,
  "attribution": "Alfonso Rodríguez, Txema Sánchez and Brais Calvo.",
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

## What it does

Variable that reads GA4 identifiers through the native `readAnalyticsStorage` API. Choose Client ID, Session ID or Session Number; session data requires a Measurement ID. It is useful for attribution debugging and for preparing data for other tags. Reading depends on `analytics_storage` being available.

## Code and configuration

The repository includes the template file. Review its documentation, configuration and permissions before adding it to your Google Tag Manager container.
