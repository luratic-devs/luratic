---
title: Los principios técnicos de Google Tag Manager
date: 2020-08-19T06:14:35+00:00
image: images/blog/post-5.jpg
description: ''
draft: true
author:
    name: Luratic
    image: "/images/avatar.png"
menu:
  sidebar:
    parent: Recomendaciones GTM
    name: Los principios técnicos de Google Tag Manager
    identifier: Los principios técnicos de Google Tag Manager
    weight: 1

---
Los principios técnicos de Google Tag Manager surgen de la necesidad de desarrollar e ir un poco más allá del sentido común tan diferente a veces. :D 

Al final, muchos de nosotros estamos hartos de encontrarnos contenedores de Google Tag Manager como si fuesen baúles de recuerdos, campos atómicos de pruebas o compost inorgánico. Nos duelen los ojos y los corozones cuándo los abrimos. Nos cansa la despreocupación con la que se maneja una herramienta tan potente como peligrosa. Solo habrá que leer y grabar a fuego los siguientes principios. Al final, no lo olvides #somosdatisfayers.

Por eso, si tocas o juegas con Google Tag Manager siempre debemos tener en cuenta los siguientes principios técnicos que, aunque no son propios de la plataforma y a muchos de vosotros quizás ya os suenan, sí que debemos tenerlos siempre presente ante cualquier implementación que debamos abordar en nuestro contenedor de GTM.

- **DRY** (Don't Repeat Yourself): Se debe de tratar, siempre que se pueda, reutilizar las etiquetas, los triggers y las variables. Para ello hay que hacerlas genéricas y escalables.
De este modo el contenedor será más ligero, más limpio y más legible. Esto mejorará el rendimiento, la depuración y el mantenimiento.

- **KISS** (Keep It Simple Stupid): Todo lo que se haga en GTM debe de tender a esta idea, cuanto más minimalista y sencillo sea, mejor.

- **YAGNI** (You Ain't Gonna Need It): No se debe implementar algo si aún no va a tener un uso específico. Se ahorrará tiempo y esfuerzo.
Siguiendo este principio, mantener etiquetas, triggers o variables que no se estén utilizando simplemente por el hecho de que en un futuro igual se usan no tiene sentido alguno puesto que en GTM se dispone de un sistema de control de versiones donde se pueden consultar elementos modificados o eliminados.
Otra opción sería mantener todo lo que consideremos interesante y útil en nuestro contenedor de recetas o utilidades.

- **Boy Scout Rule**: Consiste, simplemente, en hacer lo mismo que ellos hacen cada vez que salen al campo: dejar la zona cuando se marchan un poquito mejor que cuando se la encontraron. Si algo se puede mejorar, debe mejorarse.


Guardátelo en favoritos, quizás para la próxima que te pases por aquí te encuentres con algún principio nuevo que algún usuario dejó en los comentarios, que adaptamos de Simo Ahava o que pase los filtros de los editores como el _Principio de Austeridad_ o _Mariano Rajoy_, tú recorta siempre pero si lo haces que sea con principios. Acuérdate de recortar en lo que no aporte valor y no pensar en el Linkedn y la comisión.