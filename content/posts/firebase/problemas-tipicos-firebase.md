---
title: "Problemas habituales en apps con el nuevo paradigma Firebase y su integración con Google Analytics a través de Google Tag Manager for Firebase"
date: 2020-08-19T13:14:34+06:00
image: "/images/portfolio/firebase.jpg"
author:
    name: Luratic
    image: "/images/avatar.png"
project_url : "#"
categories: ["firebase", "incidencias firebase","ecommerce", "apps", "android", "ios"]
description_en: ""
description:  En este artículo se irán recogiendo todas las problemáticas habituales que nos vamos encontrando en la integración de la analítica en apps con el nuevo paradigma Firebase.  
draft: true
hero: "/images/portfolio/firebase.jpg"
menu:
  sidebar:
    parent: Firebase
    name: Problemas habituales en apps con el nuevo paradigma Firebase y su integración con Google Analytics a través de Google Tag Manager for Firebase
    identifier: Problemas habituales en apps con el nuevo paradigma Firebase y su integración con Google Analytics a través de Google Tag Manager for Firebase
    weight: 1
---
En este artículo se irán recogiendo todas las problemáticas habituales que nos vamos encontrando en la integración de la analítica en apps con el nuevo paradigma Firebase.  Google Tag Manager for Firebase y la integración de Google Analytics  y su resolución. 
Qué nuestro dolor no se propague  

## ¿No tengo atribución en Google Analitcs con la nueva implementación a través de Firebase?

Uno de los quebraderos de cabeza más comunes e importantes en la analítica de datos es asegurar una correcta atribución. 
A diferencia de Firebase Analytics y de lo que ocurre en el entorno web, la atribución en apps para Google Analytics no era automática si deshabilitas los eventos automáticos de Firebase.
Si eres de los que has deshabilitado los eventos automáticos de Firebase para evitar su propagación automática y considerable ruido en Google Analytics  tendrías que hacer obligatoriamente  en tus contenedores de GTM for Firebase lo siguiente: 


1.  Nueva Etiqueta de Google Analytics de tipo evento y tener marcado el check de *Use Firebase Event Parameters for Campaign Attribution*.

![Configuración etiqueta atribución GTM for Firebase](https://user-images.githubusercontent.com/54624019/94068661-cb6ab300-fdef-11ea-8d5a-fbd93e45ae39.png)

Configuración etiqueta: 

**ec**(category): firebase.

**ea**(action): {{Event Name}} --> Aparecerá en GA como firebase_campaign. 

**Non-Interaction Hit:**: true.




2.  Crear o habilitar el trigger **Campaign**

![Creación trigger campaign](https://user-images.githubusercontent.com/54624019/94069166-6d8a9b00-fdf0-11ea-9fdd-4098e7190e95.png)

3. Asociarlo a la etiqueta que hemos creado. 

![Asociación trigger Campaign a la etiqueta de atribución de Google Analytics](https://user-images.githubusercontent.com/54624019/94069416-d5d97c80-fdf0-11ea-8e9a-dbc78d567589.png)

En caso, de que necesites una atribución más avanzada de la que te proporciona este mecanismo "automático" como, por ejemplo, que necesites identificar a aquellos usuarios que abren la app a través de una búsqueda en Google. Todo esto  requeriría necesariamente implicar al equipo de desarrollo para el volcado de dicha información al "dataLayer" como parámetros de evento.

##
## Problema con los parámetros monetarios del ecommerce: price, revenue, shipping cost...
Si al validar los hits de tus implementaciones de Firebase para Google Analytics en Android o iOS y resulta que no ves rastro del precio(**pr<index>pr**), revenue(**tr**), shipping cost(**ts**) o directamente no ves datos en Google Analytics es posible que te asustes.

Aquí podrían pasar 2 cosas: 
1. Que el desarrollador directamente no implementase estos parámetros. Para asegurnos de su existencia, tendríamos que depurar la app, revisar los logs de analítica y los datos en Firebase Analytics. Si haciendo esto no detectamos el envío de estos parámetros en ningún lado lo más probable es que aún no estén implementados. En caso de que veas trazas de estos parámetros nos iríamos al siguiente punto. 

2. Que se esté mandando el valor monetario como string o literal en lugar de enviarlo como valor numérico. Sí, frustrante y quisquillo a partes iguaels pero  en caso de enviarlo como literal la librería de GTM for Firebase no lo "entiende" y directamente lo elimina. 
> El valor monetario en las implementaciones de analítica de Firebase **siempre** serán **numérico** y los valores decimales se separarán **siempre** por punto.
**Ejemplo**:
>
>  15.50 ✅
>
>  "15,50" ❌
>
>  "15.50" ❌
>


## ¿No se envía el ecommerce con los nuevos cambios o especificaciones de eventos de Google para Firebase en apps?

La solución actual es revertir todos los cambios a versiones anteriores o nomenclatura "legacy". 

Listado de eventos de ecommerce para Firebase y si son soportados en Google Tag Manager for Firebase para su envío a Google Analytics:

| Evento | Activador | Parámetros | Ecommerce GTM |
| -- | -- | -- | -- |
| add_payment_info | cuando un usuario agrega datos de facturación | ninguno | ? |
| add_to_cart | cuando un usuario agrega artículos al carrito | quantity, item_category, item_name, item_id, item_location_id, value, price, currency | ? |
| add_to_wishlist | cuando un usuario agrega un artículo a la lista de deseos | quantity, item_category, item_name, item_id, item_location_id, value*, price, currency | ? | 
| begin_checkout | cuando un usuario comienza el proceso de confirmación de la compra | coupon, currency, value | ? |
| ecommerce_purchase | cuando un usuario completa una compra | coupon, currency, value, tax, shipping, transaction_id | ? |
generate_lead | cuando un usuario envía un formulario o una solicitud de información | value, currency | ? |
| purchase | cuando un usuario completa una compra | affiliation, currency, items, shipping, tax, transaction_id, value | ? |
| purchase_refund | cuando se emite un reembolso | quantity, value, currency, transaction_id | ? |
| view_item | cuando un usuario visualiza una oferta o un artículo específico | item_id, item_location_id | ? |
| view_item_list | cuando un usuario visualiza una lista de ofertas o artículos | item_category | ? |
view_search_results | cuando un usuario visualiza los resultados de una búsqueda | search_term | ? |


[Documentación oficial de eventos sugeridos para un ecommerce](https://support.google.com/firebase/answer/6317499?hl=es-419)

[Documentación oficial para la implementación del ecommerce](https://firebase.google.com/docs/analytics/measure-ecommerce)