# Portfolio de Andrés Gallego

Web estática: HTML + CSS + un JS mínimo. Sin instalación ni herramientas de compilación.
Español en la raíz, inglés en `en/`, con selector ES/EN en la cabecera.

## Ver en local
Abre `index.html` en el navegador. Para que la música funcione necesitas conexión a internet (las carátulas y los fragmentos vienen del catálogo de Apple).

## Estructura
- Español: `index.html`, `sobre-mi.html`, `personal.html`, `farmerzone-pagos.html`, `hub-imagenes.html`, `alertas-favoritos.html`
- Inglés (`en/`): `index.html`, `about.html`, `personal.html`, `farmerzone-payouts.html`, `central-image-hub.html`, `alerts-favourites.html`
- `assets/css/style.css`, `assets/js/main.js`, `assets/img/`, `assets/cv/`

Cada cambio de texto hay que hacerlo en las dos versiones (la española y la de `en/`).

## Editar
- **Textos**: abre el `.html` de la página y cambia el texto entre etiquetas. Cada sección está en un bloque `<section>`.
- **Colores, tamaños**: `assets/css/style.css`, variables al inicio (`:root`).
- **Imágenes**: sustituye el archivo en `assets/img/` manteniendo el nombre. Si falta una imagen, la web muestra un recuadro punteado con el nombre esperado. Las imágenes de los casos son `farmerzone-*.webp`, `hub-*.webp` y `alertas-*.webp` (las portadas terminan en `-portada.webp`). Conviene exportarlas en webp, de unos 1800 px de ancho como máximo.
- **CV**: `assets/cv/Andres_CV_2026.pdf` (español) y `assets/cv/Andres_CV_2026_EN.pdf` (inglés). Se abren en otra pestaña; para actualizarlos, sustituye el archivo manteniendo el nombre.
- **Nuevo proyecto**: duplica un caso (`hub-imagenes.html`), cambia el texto y añade su tarjeta en `index.html` (y lo mismo en `en/`). Con Claude se hace en una conversación.
- **Favicon**: `assets/img/favicon-32.png`, `favicon-192.png` y `apple-touch-icon.png`.

## Música (Sobre mí)
Al final de `sobre-mi.html` (y `en/about.html`) hay una lista de canciones, cada una un `<li class="disco">`. En cada carga la web baraja la lista y **muestra solo 6**, así que puedes tener más guardadas.

Para añadir o cambiar una canción, copia un `<li class="disco">` y cambia:
- `data-term`: lo que se busca en Apple (título + artista, sin tildes ayuda).
- `data-titulo`: parte del título que debe coincidir (minúsculas, sin tildes).
- `data-artista`: parte del nombre del artista que debe coincidir. Si hay varios, sepáralos con `|` (por ejemplo `lavoe|colon`).
- `data-artistas`: nombre que se muestra a lectores de pantalla.
- `--vinilo`: color del vinilo si no se puede sacar de la carátula.
- El texto del `<p class="solo-lectores">` (título — artista).

Si una canción no carga, abre la consola del navegador y busca avisos que empiecen por `[música]`. Suele bastar con ajustar `data-term` y `data-titulo`. Los resultados se guardan 7 días en el navegador.

## Tipografías
Ahora: Solo Switzer (todo el sitio) desde Fontshare. Para usar PP Neue: sube los WOFF2 a `assets/fonts/`, añade `@font-face` en `style.css` y cambia `--font-texto` y `--font-ui`. Comprueba antes que tu licencia cubre uso web.

## Publicar gratis (GitHub Pages)
1. Crea un repositorio en GitHub y sube esta carpeta.
2. Settings → Pages → Branch `main`, carpeta `/ (root)`.
3. Cada vez que subas un cambio, la web se actualiza sola.
El archivo `CNAME` ya contiene `andresgallego.com`. Para que el dominio funcione hay que apuntar su DNS a GitHub Pages (4 registros A y un CNAME de `www`), y luego marcar *Enforce HTTPS* en Settings → Pages.

## Metadatos y SEO
Cada página lleva título, descripción, URL canónica, `hreflang` (es/en), Open Graph y Twitter Card, todo con `https://andresgallego.com`. La imagen al compartir el enlace es `assets/img/og-image.jpg` (1200×630). Además: `sitemap.xml`, `robots.txt` y `404.html`. Si cambia el dominio, hay que actualizar esas URLs.

## Pendiente
- Caso Farmeneur.
- Optimizar imágenes pesadas (`pizza.webp`, `andres.jpg`) solo si se puede sin perder calidad.

## Música (discos)

Las carátulas y los fragmentos de audio de las canciones están guardados en `assets/data/discos.json` (clave = `data-term` de cada canción en `build.py`). La web lee ese archivo y carga al instante, sin consultar a Apple en cada visita. Si algún audio dejara de funcionar, `main.js` hace una búsqueda en vivo en iTunes como plan B.

Para cambiar una canción: edita `CANCIONES` en `build.py` y añade su entrada en `discos.json` (título, preview `p` y carátula `a` de la API de iTunes: `https://itunes.apple.com/search?media=music&entity=song&term=...`).
