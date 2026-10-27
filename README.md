# Luratic

Web de recursos de analítica digital: extensiones para Chrome, plantillas de Google Tag Manager, herramientas web y perfiles del equipo, con recorridos visuales y documentación de uso.

## Desarrollo

La web se genera con **Hugo 0.168.0**. Las comprobaciones previas a publicar usan Python 3 y Node.js 18 o posterior, sin paquetes npm ni base de datos.

```bash
hugo server --environment development
```

## Añadir un recurso

```bash
hugo new content recursos/mi-herramienta.md
```

Rellena la ficha y cambia `draft` a `false` cuando esté preparada. El catálogo, sus recuentos y la página de detalle se generan automáticamente. Los perfiles se editan en `content/equipo/`.

La selección y el orden de las cinco tarjetas de portada se mantienen en `data/home.json`: primero las webs, después las extensiones y finalmente Clarity. Los vídeos y recorridos completos están en las fichas.

La portada adapta el diseño «Cercana» a Hugo: filtros y búsqueda sobre los destacados, capturas reales y perfiles del equipo inmediatamente después de los recursos. El panel de eventos es una demo local con código ilustrativo; sus controles no modifican el GTM ni el consentimiento real. No necesita React ni dependencias de ejecución externas.

## Verificar antes de integrar

```bash
hugo --gc --minify --cleanDestinationDir --environment preview
python3 scripts/check_site.py --public public --check-legacy
python3 scripts/check_privacy.py --public public
node scripts/check_tracking.mjs --public public --preview
```

Netlify usa `netlify.toml` para construir la web y verificar privacidad y tracking antes de publicar. Las previews y las ramas no cargan el GTM de producción. El logo original, las políticas de privacidad y las rutas históricas se conservan. Los textos y las imágenes de las demos se mantienen en `data/demos.json` y `static/images/demos/`.

Consulta [la guía de mantenimiento](docs/MAINTENANCE.md) para editar contenido, revisar un Deploy Preview, integrar cambios y volver a un despliegue anterior.

## Primera renovación

Preparada desde el commit `90ef7ff5533fb69d2dc2c439037337749514aa38`, en la rama de trabajo `redesign/2026`. El código mantiene el repositorio y el flujo de GitHub + Netlify existentes; no requiere crear otro repositorio de GitHub.
