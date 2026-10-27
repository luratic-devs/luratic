{
  "slug": "microsoft-clarity",
  "category": "template",
  "description": "Conecta Clarity con GTM y da contexto a tus sesiones: eventos, etiquetas, identificadores y consentimiento con Consent V2.",
  "repo": "https://github.com/luratic/Clarity",
  "installUrl": "https://raw.githubusercontent.com/luratic/Clarity/master/template.tpl",
  "docsUrl": "https://github.com/luratic/Clarity/blob/master/README.md",
  "sourceUrl": "https://github.com/luratic/Clarity/blob/master/template.tpl",
  "tags": [
    "GTM",
    "Clarity",
    "Consentimiento"
  ],
  "featured": true,
  "status": "published",
  "license": "Apache-2.0",
  "unofficial": true,
  "attribution": "Alfonso Rodríguez, Txema Sánchez y Brais Calvo.",
  "contributors": [
    "Alfonso Rodríguez",
    "Txema Sánchez",
    "Brais Calvo"
  ],
  "templateType": "tag",
  "title": "Microsoft Clarity",
  "weight": 4,
  "sources": [
    "https://github.com/luratic/Clarity/blob/master/template.tpl",
    "https://github.com/luratic/Clarity/blob/master/README.md",
    "https://github.com/luratic/Clarity/blob/master/metadata.yaml",
    "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api",
    "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2",
    "https://developers.google.com/tag-platform/tag-manager/templates/api#isConsentGranted"
  ],
  "icon": "code",
  "accent": "violet",
  "legacyDocs": "/posts/templates/tags/clarity/",
  "demo": "clarity"
}

## Clarity con el contexto que necesitas para analizar

Una grabación resulta más útil cuando sabes qué estaba haciendo la persona, en qué parte del recorrido se encontraba y qué acción quieres revisar. Esta plantilla de Luratic permite cargar Microsoft Clarity desde Google Tag Manager y acompañar las sesiones con eventos, etiquetas e identificadores propios.

Está pensada para contenedores web de GTM. Necesitas un proyecto de Clarity, su **Project ID** y los activadores y variables que describen tu implementación. Es una plantilla de la comunidad, no oficial de Microsoft, desarrollada por Alfonso Rodríguez, Txema Sánchez y Brais Calvo.

## Qué puedes configurar

| Opción | Para qué sirve |
| --- | --- |
| **Clarity Project ID** | Carga el script del proyecto al que quieres enviar la información. Es el dato obligatorio de la configuración básica. |
| **Custom Events** | Envía el nombre de una acción cuando se activa la etiqueta: por ejemplo, `checkout_started` o `form_error`. |
| **Custom Tags** | Añade pares clave–valor, como `checkout_step: payment` o `experiment: variant_b`, para localizar sesiones con ese contexto. |
| **Custom Identifiers** | Permite informar User ID y, opcionalmente, Session ID, Page ID y Friendly Name. |
| **Consentimiento** | Comunica a Clarity los estados de almacenamiento analítico y publicitario mediante `consentv2`. |
| **Priorizar sesiones** | Envía una solicitud de prioridad con un motivo para sesiones que quieras revisar con especial atención. |

Los eventos y las etiquetas personalizados son complementarios: el evento describe una acción; la etiqueta aporta un criterio para encontrar sesiones. La priorización ayuda a señalar sesiones relevantes cuando Clarity selecciona grabaciones; no convierte la configuración en una grabación exclusiva de esas sesiones.

## Un caso práctico: entender un error en el checkout

Imagina que tu web publica un evento de capa de datos cuando aparece un error en el pago. Puedes utilizarlo como activador, enviar a Clarity el evento `payment_error` y añadir etiquetas con el paso del checkout y una categoría de error sin datos personales.

Después podrás buscar ese contexto en Clarity y revisar las grabaciones disponibles: qué interacción precedió al error, si se repitió y cómo continuó la navegación. La plantilla comunica las señales que configures; el evento y sus valores tienen que existir en tu web o en las variables de GTM.

## Cómo empezar

1. Añade la plantilla de Luratic desde la [Galería de plantillas de GTM](https://tagmanager.google.com/gallery/#/owners/luratic/templates/Clarity), o importa el archivo del repositorio en una plantilla de etiqueta.
2. Crea una etiqueta e introduce el Project ID de tu proyecto de Clarity.
3. Define el activador adecuado para la carga inicial y las acciones que quieras instrumentar. Evita añadir otra instalación de Clarity al mismo sitio sin revisar la que ya existe.
4. Activa únicamente las opciones que necesites y conecta sus campos con variables de GTM. Para identificar usuarios de prueba, utiliza identificadores internos que no expongan correos, nombres u otros datos personales.
5. Configura el consentimiento y comprueba en Preview los valores, los disparos y las transiciones de consentimiento. Revisa también el resultado en el proyecto de Clarity antes de publicar.

## Consentimiento: una configuración explícita

Para utilizar estas opciones debes marcar **Specify if cookies should be set**. Con **Consent Mode**, la plantilla consulta `analytics_storage` y `ad_storage`, comunica su estado inicial a Clarity y escucha los cambios posteriores de ambos tipos.

Esto depende de que tu CMP o implementación de consentimiento establezca correctamente los valores en GTM. Inicialízalos antes de ejecutar la etiqueta: las APIs de GTM consideran concedido un tipo de consentimiento que todavía no tiene estado.

Con **Custom Consent Values**, proporcionas `granted` o `denied` mediante campos o variables. Se leen cuando se dispara la etiqueta; debes organizar su actualización cuando cambie la elección de la persona.

Revisa asimismo el Consent Mode del proyecto de Clarity. La plantilla carga el script cuando se ejecuta; comunicar una denegación no equivale por sí solo a impedir esa carga. Microsoft documenta un funcionamiento limitado sin cookies cuando el consentimiento se deniega. Si tu implementación necesita bloquear completamente la carga hasta obtener permiso, configura los controles y activadores correspondientes en GTM.

## Permisos y documentación

La plantilla declara permisos para cargar scripts de `www.clarity.ms`, acceder a `clarity`, `clarity.q`, `gtag` y `dataLayer`, consultar consentimiento y escribir logs en depuración. En consentimiento declara lectura de `analytics_storage` y lectura/escritura de `ad_storage`; el código revisado consulta los estados y los comunica a Clarity.

Consulta el [código y las opciones de la plantilla](https://github.com/luratic/Clarity/blob/master/template.tpl), su [historial de versiones](https://github.com/luratic/Clarity/blob/master/metadata.yaml), la [API de Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api) y la [documentación de Consent V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).
