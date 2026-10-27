# Tipografías de la portada

Descargadas el 27 de octubre de 2026 desde Google Fonts para servirlas localmente. Los archivos WOFF2 se conservan sin modificaciones. No se necesita ninguna petición a Google Fonts al visitar la web.

La referencia utiliza [esta hoja oficial de Google Fonts](https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;600&display=swap). Se guardan los subconjuntos Latin y Latin Extended; el primero incluye las letras acentuadas y la eñe utilizadas en español y gallego.

| Archivo | Familia | Ejes variables verificados | Bytes |
| --- | --- | --- | ---: |
| `Archivo-Variable-Latin.woff2` | Archivo | `wght` 100–900, `wdth` 62–125 | 90.104 |
| `Archivo-Variable-LatinExt.woff2` | Archivo | `wght` 100–900, `wdth` 62–125 | 86.240 |
| `JetBrainsMono-Variable-Latin.woff2` | JetBrains Mono | `wght` 400–800 | 31.432 |
| `JetBrainsMono-Variable-LatinExt.woff2` | JetBrains Mono | `wght` 400–800 | 11.624 |

La portada declara las fuentes en `static/assets/redesign/home.css` con `font-display: swap` y sus respectivos `unicode-range`. El archivo Latin de Archivo es el principal candidato para precarga. No hace falta precargar los subconjuntos Extended; el navegador los solicita si encuentra caracteres de ese rango.

## Origen de cada archivo

- [Archivo Latin](https://fonts.gstatic.com/s/archivo/v25/k3kQo8UDI-1M0wlSfdnoLg.woff2)
- [Archivo Latin Extended](https://fonts.gstatic.com/s/archivo/v25/k3kQo8UDI-1M0wlSfdfoLnnA.woff2)
- [JetBrains Mono Latin](https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2)
- [JetBrains Mono Latin Extended](https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwhsk.woff2)

## Licencias

Ambas familias se distribuyen bajo SIL Open Font License 1.1. Sus textos completos están junto a los binarios:

- `OFL-Archivo.txt`, procedente del [repositorio oficial google/fonts](https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt). Copyright 2020 The Archivo Project Authors.
- `OFL-JetBrainsMono.txt`, procedente del [repositorio oficial google/fonts](https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt). Copyright 2020 The JetBrains Mono Project Authors.

## Integridad

Se verificaron la firma `wOF2`, la longitud del contenedor, la descompresión Brotli y los ejes de la tabla `fvar` de los cuatro archivos, sin añadir dependencias al proyecto.

```text
e3a28eade21a900c7155a247757f4b2834c07bb7ef07ad7efa55cebaac1e8f5e  Archivo-Variable-Latin.woff2
5717f37059660ca5c899bad6c48ee22c3ac55cb3c484055241689d0f905a1a86  Archivo-Variable-LatinExt.woff2
83c005d49d8a6a50474c73a5a36ac0468076e9c4a29da7bdb14995d80560a5be  JetBrainsMono-Variable-Latin.woff2
db5ff4db83e580426280e9337a58dc57d3a83784a1b03ad80914651594441d52  JetBrainsMono-Variable-LatinExt.woff2
```
