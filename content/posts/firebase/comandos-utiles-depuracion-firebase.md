---
title: "Comandos útiles para la depuración y validación de la analítica en Android"
date: 2020-08-19T13:14:34+06:00
image: "/images/portfolio/firebase.jpg"
author:
    name: Luratic
    image: "/images/avatar.png"
project_url : "#"
categories: ["branding"]
description_en: ""
description:  Vamos indicar los comandos que nosotros utilizamos para la validación y depuración de la analítica en Android.. 
draft: true
hero: "/images/portfolio/firebase.jpg"
menu:
  sidebar:
    parent: Firebase
    name: Comandos útiles para Firebase en Android
    identifier: Comandos útiles para Firebase en Android
    weight: 1
---


## Depuración Android

Una de las formas para encontrar el nombre del paquete en Android es ejecutando en el ADB el siguiente comando: 

```adb shell ```
``` pm list packages | grep <nombre supuesto paquete> ```



### Activar DebugView Firebase:

``` adb shell setprop debug.firebase.analytics.app <package> ```

### Desactivar DebugView Firebase:
``` adb shell setprop debug.firebase.analytics.app <package> ```

o 

``` adb shell setprop debug.firebase.analytics.app .none. ```

### Activación de los logs

#### Google Analytics
```adb shell setprop log.tag.GAv4-SVC DEBUG ```
 
#### Firebase Analytics (App + web)
```adb shell setprop log.tag.FA VERBOSE ``` y 
```adb shell setprop log.tag.FA-SVC VERBOSE ```

#### Google Tag manager
```adb shell setprop log.tag.GoogleTagManager VERBOSE```

### Visualización de los logs

- Visualizar el log en tiempo real y filtrado solo por lo relacionado con GA(UA):

```adb logcat -v time -s GAv4 GAv4-SVC```
- Visualizar el log en tiempo real  filtrando solo por Firebase:

```adb logcat -v time -s FA FA-SVC```

- Visualizar el log en tiempo real filtrando por GA y Firebase:

```adb logcat -v time -s FA FA-SVC GAv4 GAv4-SVC```

- Visualizar el log en tiempo real filtrando por GTM (FALTA ACTUALIZAR)

```adb logcat -v time -s FA FA-SVC GoogleTagManager```
