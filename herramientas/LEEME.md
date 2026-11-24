# Herramientas del portfolio

Estos archivos no forman parte de la web; sirven para montarla. GitHub Pages los publica igual, pero nadie los usa.

- `build.py`: genera las páginas HTML (español en la raíz, inglés en `/en/`), `sitemap.xml`, `robots.txt` y `404.html`. Los textos se editan dentro con `t("español", "english")`. Se ejecuta con `python3 herramientas/build.py` desde la raíz del repo.
- `preview.py`: copia la web a una carpeta para la vista previa en un Artifact de Claude (cambia Switzer por una fuente de Google, porque el Artifact bloquea Fontshare). Uso: `python3 herramientas/preview.py /ruta/de/salida`.
- `sincroniza_discos.py`: tras editar `assets/data/discos.json`, copia esos datos dentro de `assets/js/main.js`.

## Cómo añadir una canción
1. Añadirla a la lista `CANCIONES` de `build.py` (título, artista, término de búsqueda, clave de título, clave de artista, color del vinilo).
2. Añadir su entrada en `assets/data/discos.json` con la clave igual al término de búsqueda: título, artista, álbum original, año, enlace del fragmento y de la carátula (600x600).
3. Ejecutar `sincroniza_discos.py` y `build.py`. Conviene que el total sea múltiplo de 6.

## Qué es de cada archivo
- Los textos y la estructura de las páginas viven en `build.py`: no se editan los HTML a mano, se regeneran.
- Los estilos (`assets/css/style.css`) y el comportamiento (`assets/js/main.js`) se editan directamente.
