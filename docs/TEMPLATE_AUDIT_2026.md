# Auditoría de plantillas GTM — 2026-10-28

Esta auditoría revisa las **42 fichas de plantillas GTM** del catálogo de Luratic.

## Criterio

- **Discontinuada**: la plataforma o producto al que apunta la plantilla ha sido retirado o la plataforma histórica ha cerrado. Se conserva el código como referencia y se oculta el CTA de instalación.
- **Sustituida**: el proveedor sigue activo, pero hoy ofrece o recomienda una integración oficial o un producto sucesor más actual. Se conserva el código como histórico y se enlaza la alternativa actual.
- **Mantener**: no se ha encontrado una señal suficiente para retirarla y la plantilla sigue teniendo utilidad técnica o apunta a un servicio activo. Esto **no equivale a haber ejecutado una prueba end-to-end** con una cuenta real.
- **Revisión manual**: el servicio sigue existiendo o el endpoint responde a una integración plausible, pero falta confirmar con una cuenta/documentación actual que el flujo concreto sigue siendo el recomendado.

La auditoría técnica usa los campos y endpoints declarados en cada `template.tpl`. Las fichas de Luratic leen esa información desde `data/template_details.json`.

## Discontinuadas

| Plantilla | Motivo |
| --- | --- |
| Oracle BlueKai DMP | Oracle Advertising / BlueKai DMP fue retirado. Ya estaba marcado como histórico. |
| Salesforce Audience Studio | Audience Studio fue retirado el 1 de febrero de 2024. Ya estaba marcado como histórico. |
| Salesforce Event Tracker | Usa el antiguo entorno Krux / Audience Studio. Ya estaba marcado como histórico. |
| Belboon Container Tags | La plataforma antigua de Belboon fue cerrada el 30 de septiembre de 2026 tras la migración a Daisycon. |
| Belboon Performance | Mismo cierre de la plataforma antigua de Belboon. |

Referencia Belboon: https://belboon.com/en/

## Sustituidas por una solución actual

| Plantilla | Situación actual | Alternativa |
| --- | --- | --- |
| TikTok | La plantilla de Luratic carga el SDK histórico por `analytics.tiktok.com`. TikTok ofrece actualmente un flujo/plantilla oficial para GTM. | https://ads.tiktok.com/resources/help/article/how-to-set-up-tiktok-pixel-in-google-tag-manager |
| Snapchat | La plantilla carga `sc-static.net/scevent.min.js`. Snapchat recomienda su integración oficial **Snap Pixel by Snapchat**. | https://businesshelp.snapchat.com/s/article/formatting-pixel?language=en_US |
| LinkedIn Conversion | Usa el píxel de conversión anterior `px.ads.linkedin.com/collect/`. LinkedIn recomienda **InsightTag 2.0** para GTM. | https://www.linkedin.com/help/linkedin/answer/a416960 |
| Ligatus | Usa `tracking.lqm.io`. Ligatus fue absorbida por Outbrain; la oferta actual se presenta como Outbrain Direct Response dentro de Teads. | https://www.outbrain.com/ligatus/ |
| ADYOULIKE | La plantilla carga una URL de script proporcionada por el proveedor. ADYOULIKE forma parte de OpenWeb y su oferta publicitaria actual está integrada en OpenWeb Exchange. | https://www.openweb.com/openweb-exchange/ |

## Mantener

Estas plantillas se mantienen porque son utilidades propias, integraciones con productos activos o no presentan una señal clara de retirada:

- Kakao
- E-goi
- HubSpot
- Monetate
- AffOcean
- EqualWeb
- jsDelivr
- Adgravity
- Timestamp
- MailerLite
- SealMetrics
- Lucky Orange
- Join Strings
- Trackingplan
- Apps Referrer
- Document Title
- Encode to Base64
- Microsoft Clarity
- Decode from Base64
- Landbot Main Library
- Document Character Set
- FitAnalytics Fit Finder
- GA4 Client ID & Session Info
- Pipedrive LeadBooster Chatbot
- GA4 Ecommerce sin persistencia

## Revisión manual pendiente

No las retiraría todavía, pero antes de presentarlas como recomendación actual conviene hacer una prueba con cuenta real o confirmar el flujo exacto con el proveedor:

| Plantilla | Qué revisar |
| --- | --- |
| Weborama | El código usa `cstatic.weborama.fr/js/advertiserv2/adperf_conversion.js`; confirmar que este flujo sigue siendo el recomendado. |
| Pushnews | Confirmar que el Site ID y `cdn.pn.vg/sites/` siguen siendo el método de instalación actual. |
| Studyportals | La plantilla envía a `clickmeter.com/conversion.aspx`; confirmar que Studyportals sigue utilizando este endpoint. |
| Outbrain Enhanced | Outbrain sigue activo y ofrece integración directa con GTM; comprobar si nuestra variante “Enhanced” sigue aportando algo diferencial. |
| Amazon Advertising | La plantilla usa `aax-eu.amazon-adsystem.com/s/iui3`; validar el método actual de Amazon Advertising. |
| Cookiebot Consent Mode | Cookiebot mantiene integración oficial con GTM; confirmar si la adaptación de Luratic sigue resolviendo un caso no cubierto por la plantilla oficial actual. |
| Adsmurai Visual Commerce | Confirmar con documentación actual que `assets-cdn.adsmurai.com/adsmurai-tracking.min.js` y el modelo de eventos siguen vigentes. |

## Campos, endpoints y documentación

Las fichas de plantillas muestran automáticamente, cuando están disponibles:

1. **Endpoint** usado por el código de la plantilla.
2. **Campos configurables** extraídos del bloque `___TEMPLATE_PARAMETERS___`.
3. **Documentación oficial** del proveedor cuando se ha podido localizar una referencia actual.
4. **Captura real de GTM** cuando existe un asset verificable.

No se generan capturas simuladas. En este momento Microsoft Clarity ya dispone de una captura real de configuración GTM procedente del repositorio de la plantilla; el resto necesita capturas reales antes de mostrarlas.

## Próxima revisión recomendada

- Completar las 7 verificaciones manuales.
- Capturar la interfaz de GTM de las plantillas que se decida mantener.
- Retirar de la Community Template Gallery las discontinuadas y sustituidas cuando corresponda, eliminando o renombrando `metadata.yaml` antes de archivar el repositorio.
- Repetir la auditoría al menos una vez al año o cuando un proveedor anuncie una migración/cierre.
