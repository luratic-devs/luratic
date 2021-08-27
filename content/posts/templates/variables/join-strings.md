---
title: "GA4 Ecommerce without persistence"
date: 2020-08-12T12:14:34+06:00
hero: "/images/site/portfolio/jstemplate.png"
author:
    name: Luratic
    hero: "/images/avatar.png"
project_url : "#"
categories: ["branding"]
description: "En este artículo explicamos como añadir y configurar nuestra plantilla de  variable para Google Tag Manager que te devuelve el objeto items evitando la persistencia del dataLayer en GA4, con esta solución nos evitamos tener que hacer un push previo para limpiar el objeto ecommerce."
draft: false
hero: "/images/site/portfolio/jstemplate.png"
author:
    name: Luratic
    hero: "/images/avatar.png"
menu:
  sidebar:
    parent: variables
    name: Ecommerce GA4  (no persistence)
    identifier: Ecommerce GA4  (no persistence)
    weight: 1
---
En este artículo explicamos como añadir y configurar nuestra plantilla de  variable para Google Tag Manager que te devuelve el objeto items evitando la persistencia del dataLayer en GA4, con esta solución nos evitamos tener que hacer un push previo para limpiar el objeto ecommerce. 

##   Configuración

Para usar esta variable en Google Tag Manager sería tan sencillo como añadir esta [plantilla de variable para GTM](https://tagmanager.google.com/gallery/#/owners/precariostecnicos/templates/Timestamp) a vuestro espacio de trabajo.

Una vez añadida la template o plantilla ir a *Variables > nueva* buscar la variable de *GA4 Ecommerce(no persistence)*  .

- Configuración variable Timestamp:

![Configuración plantilla de variable Timestamp](https://user-images.githubusercontent.com/54624019/131191988-85a98760-0cec-4845-87bb-58c6725464c8.png).



### Prueba, prueba y prueba!

>Lo complicado muchas veces no es implementar, es probar lo implementado. 
>
>Tanto esta plantilla como todo lo que publicas en GTM es código que directamente se propaga a tu web o app. 
Código que puede interferir de forma anómala, provocando múltiples catástrofes. No es habitual pero no te confies **nunca**. Por eso, haz al menos un *flujo completo* en tu web o app y minimiza riesgos. 
>
> Con GTM siempre mucho **sentidiño**.

### ```Atención!```
Somos precarios técnicos que buscan ser **Luratic**. Por eso, te estaremos eternamente agradecidos de que nos apadrines como técnicos: 

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?)