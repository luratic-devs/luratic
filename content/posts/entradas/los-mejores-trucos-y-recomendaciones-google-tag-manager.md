---
title: Trucos y recomendaciones en  Google Tag Manager
date: 2020-08-19T13:14:34+04:00
image: "/images/portfolio/item-8.png"
description: ''
draft: true
author:
    name: Luratic
    image: "/images/avatar.png"
menu:
  sidebar:
    parent: Recomendaciones GTM
    name: Trucos y recomendaciones en  Google Tag Manager
    identifier: Trucos y recomendaciones en  Google Tag Manager
    weight: 1

---
Nos gustaría haberle puesto un título que apoyase el clickbait como podría ser:

1. Los siguientes trucos de Google Tag Manager te sorprenderán.
2. Los trucos que Simo Ahava no te quiere contar.

A continuación podrás leer de una forma resumida, escueta y minamalista una serie de trucos y recomendaciones que se tendrán que tener que tener siempre grabadas a fuego antes de cometer cualquier tarea en Google Tag Manager.

#### Consejos y trucos

* Se evitará siempre que sea posible el uso de Custom HTML.
* Siempre que exista la posibilidad de usar la plantilla predefinida de un tag se utilizará este método en detrimento de otros.
* En caso de que no exista tag predefinido, se creará siempre que se pueda una custom template.
* En caso de usar custom templates de la comunidad, revisar siempre su código y funcionamiento interno.
* En el caso de usar Custom HTML se debe encapsular el contenido javascript en una función anónima.
* Para evitar riesgos con el uso de los Custom HTML, es recomendable envolver el código javascript con un Try-Catch.
* Si se va a usar un script que haga uso del document.write, por seguridad, marcar la opción en el editor del Custom HTML.
* Cualquier configuración o valor que se use en más de una etiqueta, trigger o sitio se debe utilizar siempre haciendo uso de una variable de GTM.

  Esto permite actualizar su valor en único sitio y que se aplica a todos los demás.
* Añadir notas a las etiquetas, variables y disparadores para documentar su funcionamiento y utilidad.
* Las condiciones de los triggers deben de ser claras.
* Cualquier condición que no quede clara y visible a simple vista se debe abordar de otra forma como, por ejemplo, externalizando a un js|lt.
* Si tenemos que aplicar una misma condición o excepción a los disparadores de varias etiquetas de una misma herramienta, por claridad, lo haremos en forma de inhibidor. Hacerlo de esta forma nos permite ver de un vistazo qué es lo que lo activa y lo que lo inhibe, sin tener que ir comprobando uno por uno la lógica de la condición.
* Siempre que se necesiten datos del dataLayer en una etiqueta, debemos de lanzar ésta con el evento correspondiente del dataLayer.
* Antes de publicar comprobar siempre en el modo Preview
* Al publicar o al crear una nueva versión, se deben rellenar los campos nombre y descripción.
* Al menos que sea estrictamente necesario no se hará uso de los auto eventos como puede ser el click. La razón radica en que en entornos pesados ralentizan bastante el modo preview y pueden provocar problemas de rendimiento.
* En lugar de crear un tag por configuración, hacer uso, si es posible, de las tablas de consulta o de los custom javascript.
* Los custom Javascript deben de ser anónimos.
* Usar la variable constante siempre que haya que reutilizar un mismo valor.
* Usar carpetas para mantener todo lo más organizado posible.
* Dar control de publicación sólo a la gente correcta.
* Usar siempre workspaces con un nombre y una descripción.
* No es necesario implementar código adicional de gtag.js en GTM.
* No es recomendable implementar gtag.js en la página si se va a utilizar GTM.
* No se debe utilizar la opción de Etiqueta HTML personalizada para implementar etiquetas basadas en gtag.js.
* Divide los contenedores grandes en contenedores más pequeños usando zonas si se dispone de Tag Manager 360.
* Prueba todas tus etiquetas y cambios.
* Hay que relajarse y tomarse un respiro en los procesos tediosos.
* Si se tienen dudas, siempre preguntar.
* No debe importarse, ni sobreescribir el contenedor sin consultarnos previamente.