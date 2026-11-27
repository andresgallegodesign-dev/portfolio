# Galería de la página Personal: una lista de filas, de arriba abajo.
# Cada fila tiene 1 imagen (ancho completo) o 2 (pareja con la misma altura).
# Cada imagen: (archivo en assets/img/personal/, texto alternativo ES, texto alternativo EN, ancho, alto).
# build.py la usa para generar personal.html; se puede editar sin tocar build.py.

FILAS = [
    [('guitarsman.webp', 'Guitarrista en amarillo', 'Guitarist on a yellow background', 1, 1),
     ('k3.webp', 'Tres guitarristas en azul y amarillo', 'Three guitarists in blue and yellow', 1, 1)],
    [('camiseta.webp', 'Camisetas de la marca Suerte le digo', 'T-shirts for the brand Suerte le digo', 1, 1)],
    [('closeup.webp', 'Detalle del estampado Suerte', 'Close-up of the Suerte print', 1, 1),
     ('detalle-talla.webp', 'Etiqueta Suerte le digo, est. 2020', 'Suerte le digo neck label, est. 2020', 1, 1)],
    [('skate-brazos.webp', 'Chico caminando con el monopatín bajo el brazo, dibujo a línea', 'Boy walking with a skateboard under his arm, line drawing', 1200, 1200),
     ('dogs.webp', 'Montaña de perros', 'Mountain of dogs', 533, 400)],
    [('helados-pattern.webp', 'Patrón de helados', 'Ice cream pattern', 1, 1),
     ('music.webp', 'Patrón de música y conciertos', 'Music and concerts pattern', 1, 1)],
    [('personas.webp', 'Maraña de personas entrelazadas en grises y naranja', 'Tangle of intertwined people in greys and orange', 1200, 1200),
     ('cuadro-camisa.webp', 'Chico de espaldas con camisa estampada dentro de un marco, con un cigarro en la mano', 'Boy seen from behind in a patterned shirt inside a frame, holding a cigarette', 1200, 1200)],
    [('yorokobu-skatepark.webp', 'Portada para Yorokobu con un skatepark isométrico y contraportada de Volkswagen', 'Yorokobu cover with an isometric skatepark and Volkswagen back cover', 1920, 1280)],
    [('letra-h.webp', 'Letra H construida con formas de colores sobre fondo oscuro', 'Letter H built from colourful shapes on a dark background', 800, 600),
     ('coche.webp', 'Ilustración de coche y cajas', 'Illustration of a car and boxes', 898, 672)],
    [('crane.webp', 'Ilustración en viñetas', 'Comic-style panel illustration', 1080, 1363),
     ('cuarentena.webp', 'Cuarentena', 'Quarantine', 2000, 1333)],
    [('museo.webp', 'Chico mirando un cuadro con un ojo en un museo', 'Boy looking at a painting of an eye in a museum', 1200, 1500),
     ('planta.webp', 'Planta en maceta pintada con tinta negra', 'Potted plant painted in black ink', 1280, 1600)],
    [('leo-luego-pienso.webp', 'Ilustración «Leo, luego pienso»: dos personas leyendo', '“Leo, luego pienso” illustration: two people reading', 752, 564),
     ('leo-luego-pienso-mupi.webp', 'Cartel «Leo, luego pienso» del Mes del Libro 2019 en un mupi', '“Leo, luego pienso” Book Month 2019 poster on a street billboard', 1300, 790)],
    [('skate-pantalla.webp', 'Chico con monopatín saliendo de la pantalla de un móvil', 'Boy with a skateboard stepping out of a phone screen', 1200, 1200),
     ('mundo-skate.webp', 'Chico sobre dos monopatines sosteniendo el mundo', 'Boy on two skateboards holding up the world', 1200, 1300)],
]


def galeria_html(lang, pre):
    """HTML de la galería. lang: 'es' o 'en'; pre: prefijo de ruta ('' o '../')."""
    def fig(fl, es, en, w, h, par):
        alt = es if lang == "es" else en
        st = f' style="flex: {w/h:.4f} 1 0"' if par else ""
        return (f'<figure class="media "{st}><div class="media__box" style="--ratio:{w} / {h}">'
                f'<img src="{pre}assets/img/personal/{fl}" alt="{alt}" loading="lazy"></div></figure>')
    g = ""
    for fila in FILAS:
        if len(fila) == 1:
            g += "  " + fig(*fila[0], False) + "\n"
        else:
            g += '  <div class="fila-par">' + "".join(fig(*im, True) for im in fila) + "</div>\n"
    return g
