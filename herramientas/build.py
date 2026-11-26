#!/usr/bin/env python3
# Generador bilingüe (ES en la raíz, EN en /en/). Solo para mí; el resultado es HTML plano editable.
# Cada texto se escribe con t("español", "english"). Para cambiar un texto, se edita aquí y se vuelve a ejecutar.
import os

import os as _os
OUT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))  # raíz del repo (la carpeta que contiene "herramientas")
EMAIL = "andresgallego.design@gmail.com"
SITE = "https://andresgallego.com"
L = "es"      # idioma que se está generando
PRE = ""      # prefijo hacia la raíz del sitio ("" en español, "../" en inglés)

def t(es, en): return en if L == "en" else es

# Nombre de archivo de cada página en cada idioma
FILES = {
    "index":    {"es": "index.html",              "en": "index.html"},
    "about":    {"es": "sobre-mi.html",           "en": "about.html"},
    "personal": {"es": "personal.html",           "en": "personal.html"},
    "fz":       {"es": "farmerzone-pagos.html",   "en": "farmerzone-payouts.html"},
    "hub":      {"es": "hub-imagenes.html",       "en": "central-image-hub.html"},
    "alerts":   {"es": "alertas-favoritos.html",  "en": "alerts-favourites.html"},
}
def f(key): return FILES[key][L]   # nombre del archivo que se escribe (con .html)
def limpia(key, lang):
    """Dirección sin .html (GitHub Pages sirve /sobre-mi como sobre-mi.html); la portada es la carpeta."""
    return "" if key == "index" else FILES[key][lang][:-len(".html")]
def u(key):
    """Enlace limpio a una página del idioma actual, relativo a la página en la que estamos."""
    return limpia(key, L) or "./"
def abs_url(key, lang):
    """URL absoluta (limpia) de una página en un idioma."""
    return SITE + ("/" if lang == "es" else "/en/") + limpia(key, lang)

def other_url(key):
    """Enlace (limpio) a la misma página en el otro idioma."""
    return "en/" + limpia(key, "en") if L == "es" else "../" + limpia(key, "es")

def ldjson(key):
    if key not in ("index", "about"): return ""
    return '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Andrés Gallego","jobTitle":"Product designer","url":"https://andresgallego.com/","address":{"@type":"PostalAddress","addressLocality":"Madrid","addressCountry":"ES"},"sameAs":["https://www.linkedin.com/in/andres-gallego/","https://dribbble.com/andresgallego","https://www.behance.net/andresgallego"]}</script>'

def head(key, title, desc):
    return f"""<!doctype html>
<html lang="{L}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Andrés Gallego">
<meta name="theme-color" content="#212427">
<link rel="canonical" href="{abs_url(key, L)}">
<link rel="alternate" hreflang="es" href="{abs_url(key, "es")}">
<link rel="alternate" hreflang="en" href="{abs_url(key, "en")}">
<link rel="alternate" hreflang="x-default" href="{abs_url(key, "es")}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Andrés Gallego">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{abs_url(key, L)}">
<meta property="og:image" content="{SITE}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{t("Andrés Gallego, product designer en Madrid", "Andrés Gallego, product designer in Madrid")}">
<meta property="og:locale" content="{t("es_ES", "en_GB")}">
<meta property="og:locale:alternate" content="{t("en_GB", "es_ES")}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE}/assets/img/og-image.jpg">
{ldjson(key)}
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&display=swap">
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap">
<link rel="icon" type="image/png" sizes="32x32" href="{PRE}assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="{PRE}assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="{PRE}assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="{PRE}assets/css/style.css">
<style>
.cargando{{position:fixed;inset:0;z-index:9999;display:grid;place-content:center;justify-items:center;gap:4px;background:#fff;opacity:0;pointer-events:none;animation:cargando-entra .3s ease 1.2s forwards;transition:opacity .4s ease}}
.cargando.fuera{{animation:none;opacity:0!important;visibility:hidden;transition:opacity .4s ease,visibility 0s .4s}}
@keyframes cargando-entra{{to{{opacity:1;pointer-events:auto}}}}
.cargando__cab{{width:150px;height:auto;min-height:213px;display:block}}
.cargando__puntos{{display:flex;gap:9px;height:14px;align-items:center}}
.cargando__puntos i{{width:9px;height:9px;border-radius:50%;background:#212427;animation:cargando-punto 1.2s ease-in-out infinite}}
.cargando__puntos i:nth-child(2){{animation-delay:.2s}}.cargando__puntos i:nth-child(3){{animation-delay:.4s}}
@keyframes cargando-punto{{0%,70%,100%{{opacity:.18;transform:scale(.8)}}35%{{opacity:1;transform:scale(1.1)}}}}
@media (prefers-reduced-motion:reduce){{.cargando__puntos i{{animation:none;opacity:.6}}}}
</style>
<noscript><style>.cargando{{display:none}}</style></noscript>
<script src="{PRE}assets/js/main.js" defer></script>
</head>
<body>
<div class="cargando" id="cargando" role="status" aria-live="polite"><img class="cargando__cab" data-src="{PRE}assets/img/cabezon-mini.webp" alt=""><div class="cargando__puntos" aria-hidden="true"><i></i><i></i><i></i></div><span class="solo-lectores">{t("Cargando…", "Loading…")}</span></div>
<script>(function(){{var c=document.getElementById("cargando");if(!c)return;setTimeout(function(){{var i=c.querySelector("img");if(i&&c.parentNode&&!c.classList.contains("fuera"))i.src=i.getAttribute("data-src")}},600);var f=function(){{c.classList.add("fuera");setTimeout(function(){{c.remove()}},600)}};if(document.readyState==="complete")f();else{{window.addEventListener("load",f);setTimeout(f,12000)}}}})();</script>
<a class="skip" href="#main">{t("Saltar al contenido", "Skip to content")}</a>
"""

def nav(cur, key):
    def a(cls, href, text, k):
        c = ' aria-current="page"' if cur == k else ""
        return f'<a class="{cls}" href="{href}"{c}>{text}</a>'
    lang_txt = "EN" if L == "es" else "ES"
    lang_lbl = "Read this page in English" if L == "es" else "Leer esta página en español"
    lang_code = "en" if L == "es" else "es"
    lang_href = other_url(key)
    return f"""<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="trazo" x="-12%" y="-50%" width="124%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.06" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter><filter id="trazo-fino" x="-12%" y="-50%" width="124%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter><filter id="trazo-card" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter></svg>
<nav class="site-nav" aria-label="{t("Principal", "Main")}">
  <a class="nav-name" href="{u("index")}">Andrés Gallego</a>
  <a class="nav-lang" href="{lang_href}" hreflang="{lang_code}" lang="{lang_code}" aria-label="{lang_lbl}">{lang_txt}</a>
  <div class="m-cabecera">
    <a class="m-id" href="{u("index")}"><span class="m-foto"><img src="{PRE}assets/img/andres.jpg" alt=""></span><span class="m-nombre">Andrés Gallego</span></a>
    <div class="m-acciones">
      <a class="m-btn" href="mailto:andresgallego.design@gmail.com" aria-label="{t("Enviar un email a Andrés", "Email Andrés")}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg></a>
      <a class="m-btn" href="https://www.linkedin.com/in/andres-gallego/" target="_blank" rel="noopener" aria-label="{t("LinkedIn de Andrés", "Andrés on LinkedIn")}"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M5.2 9.2h3.1V19H5.2zM6.75 4.6a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10.4 9.2h3v1.35h.04c.42-.8 1.45-1.65 2.98-1.65 3.18 0 3.77 2.1 3.77 4.8V19h-3.1v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V19h-3.1z"/></svg></a>
      <a class="m-btn m-lang" href="{lang_href}" hreflang="{lang_code}" lang="{lang_code}" aria-label="{lang_lbl}">{lang_txt}</a>
    </div>
  </div>
  <div class="nav-pill">
    {a("nav-tl", ("#trabajos" if key == "index" else u("index") + "#trabajos"), t("Proyectos", "Work"), "h")}
    {a("nav-tr", u("about"), t("Sobre mí", "About"), "s")}
    {a("nav-bl", u("personal"), "Personal", "x")}
    {a("nav-br", ("#contacto" if key in ("index", "about", "personal") else u("index") + "#contacto"), t("Contacto", "Contact"), "c")}
  </div>
</nav>
"""

def media(file, alt, ratio="16 / 10", cap=None, cls=""):
    fc = f"<figcaption>{cap}</figcaption>" if cap else ""
    return (f'<figure class="media {cls}"><div class="media__box" style="--ratio:{ratio}">'
            f'<img src="{PRE}assets/img/{file}" alt="{alt}" loading="lazy"></div>{fc}</figure>')

def duo(a, b): return f'<div class="duo">{a}{b}</div>'

def foot():
    return f"""<footer class="pie"><p>© 2026 Andrés Gallego · {t("Product designer en Madrid", "Product designer in Madrid")}</p></footer>
</body>
</html>
"""

def contacto():
    return f"""<section class="contacto" id="contacto" aria-labelledby="h-contacto">
  <h2 id="h-contacto">{t("¡Hablemos!", "Let’s talk!")}</h2>
  <p>{t("Abierto a hablar de nuevos proyectos o simplemente a charlar sobre diseño.", "Open to talking about new projects or just chatting about design.")}</p>
  <p class="contacto__fila"><button type="button" class="copiar-mail" data-mail="{EMAIL}" data-ok="{t("¡Email copiado!", "Email copied!")}" aria-label="{t("Copiar email", "Copy email")}"><span class="contacto__mail">{EMAIL}</span><svg class="i-copiar" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/></svg><svg class="i-ok" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></p>
  <ul class="contacto__links">
    <li><a href="https://www.linkedin.com/in/andres-gallego/" target="_blank" rel="noopener">LinkedIn →</a></li>
    <li><a href="https://dribbble.com/andresgallego" target="_blank" rel="noopener">Dribbble →</a></li>
    <li><a href="https://www.behance.net/andresgallego" target="_blank" rel="noopener">Behance →</a></li>
  </ul>
</section>
"""

def proyectos():
    return [
        dict(key="fz", titulo=t("Pagos de FarmerZone", "FarmerZone Payouts"), empresa="CrowdFarming", ano="2024",
             bg="#DFEBE9", oscuro=False, tags=["B2B Design", "Partner Portal"], img="farmerzone-portada.webp",
             portada=t("Portada de Pagos de FarmerZone", "Cover of FarmerZone Payouts"),
             resumen=t("Cada mes, los agricultores recibían un Excel tan complejo que necesitaba un tutorial en YouTube. Lo convertimos en una sección de pagos clara, con trazabilidad de cada pedido hasta su pago.", "Every month, farmers received a spreadsheet so complex it needed a YouTube tutorial. We turned it into a clear payouts section that traces every order to its payment.")),
        dict(key="hub", titulo=t("Un hub central para las imágenes de los proyectos", "A central hub for project images"), empresa="CrowdFarming", ano="2025",
             bg="#F2ECE1", oscuro=False, tags=["CMS", "B2B Design"], img="hub-imagenes-portada.webp",
             portada=t("Portada del hub de imágenes", "Cover of the project image hub"),
             resumen=t("Publicar un proyecto obligaba a elegir y ordenar sus imágenes a mano, fuera del back office. Diseñé un único lugar para gestionarlas, con su texto alternativo en 7 idiomas.", "Publishing a project meant choosing and ordering its images by hand, outside the back office. I designed a single place to manage them, with alt text in 7 languages.")),
        dict(key="alerts", titulo=t("Alertas, favoritos y búsquedas guardadas", "Alerts, favourites and saved searches"), empresa="Astara Store", ano="2023",
             bg="#212427", oscuro=True, tags=["B2C Design", "Search and Discovery"], img="alertas-portada.webp",
             portada=t("Portada de Alertas, favoritos y búsquedas guardadas", "Cover of Alerts, favourites and saved searches"),
             resumen=t("Comprar un coche es una decisión larga y meditada. Diseñé favoritos, búsquedas guardadas y alertas para que encontrar el coche ideal no fuera empezar de cero cada vez.", "Buying a car is a long, considered decision. I designed favourites, saved searches and alerts so that finding the right car didn’t mean starting from scratch every time.")),
    ]

from PIL import Image as _I
BW, BH = _I.open(_os.path.join(OUT, 'assets/img/puerta.webp')).size
ARROW = '<svg class="hero__arrow" viewBox="0 0 30 70" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 2v64M3 54l12 13 12-13"/></svg>'

# ---------------- Portada ----------------
def index():
    cards = ""
    for p in proyectos():
        cls = "card reveal card--oscuro" if p["oscuro"] else "card reveal"
        tags = "".join(f'<li class="chip">{x}</li>' for x in p["tags"])
        cards += f"""    <article class="{cls}" style="--bg:{p['bg']}">
      <div class="card__texto">
        <div>
          <p class="card__meta">{p['empresa']} · {p['ano']}</p>
          <h2><a class="card__link" href="{u(p['key'])}">{p['titulo']}</a></h2>
          <p class="card__resumen">{p['resumen']}</p>
        </div>
        <ul class="card__tags" style="list-style:none;padding:0;margin:0">{tags}</ul>
        <span class="btn" aria-hidden="true">{t("Ver proyecto", "View project")}</span>
      </div>
      <div class="card__media">{media(p['img'], p['portada'], '4 / 3')}</div>
    </article>
"""
    return head("index", t("Andrés Gallego · Product designer", "Andrés Gallego · Product designer"),
                t("Portfolio de Andrés Gallego, product designer en Madrid: más de 4 años en producto digital y 15 en diseño gráfico y visual. Casos de CrowdFarming y Astara Store.", "Portfolio of Andrés Gallego, product designer in Madrid: over 4 years in digital product and 15 in graphic and visual design. Case studies from CrowdFarming and Astara Store.")) + nav("h", "index") + f"""<main id="main" class="page">
<header class="hero">
  <img class="dibujo dibujo--hero" data-balon="{PRE}assets/img/cabeza.png" src="{PRE}assets/img/cabezon.webp" alt="{t("Ilustración animada de una cabeza apoyada sobre un libro abierto", "Animated illustration of a head resting on an open book")}">
  <h1>{t("¡Hola! Soy Andrés. Product designer.", "Hi! I’m Andrés. Product designer.")}</h1>
  <p class="hero__sub">{t("Más de 4 años en producto digital y 15 en diseño.", "Over 4 years in digital product and 15 in design.")}</p>
  <p class="hero__ctas"><a href="#trabajos">{t("Ver proyectos", "See projects")}</a><a href="{u('about')}">{t("Saber más de mí", "More about me")}</a></p>
</header>
<section class="intro" aria-label="{t("Presentación", "Introduction")}">
  <div class="intro__inner">
    <img class="intro__dibujo" src="{PRE}assets/img/patin.webp" alt="{t("Ilustración animada de un chico de pie sujetando un monopatín", "Animated illustration of a boy standing and holding a skateboard")}" width="400" height="508">
    <div class="intro__texto">
      <p>{t("Diseño productos digitales con empatía y cariño por los detalles. Creo que un buen producto se nota en lo pequeño.", "I design digital products with empathy and a love for the details. I believe a good product shows in the small things.")}</p>
      <p>{t("Estos son mis últimos trabajos.", "These are my latest projects.")}</p>
    </div>
  </div>
</section>
<div class="trabajos-banda" id="trabajos"><section class="trabajos" aria-label="{t("Proyectos", "Projects")}">
{cards}</section></div>
{contacto()}
</main>
""" + foot()

# ---------------- Sobre mí ----------------
def parada(year, tipo, rol, lugar, fechas, desc=""):
    d = f'\n          <p class="parada__desc">{desc}</p>' if desc else ""
    return f"""        <li class="parada" data-year="{year}">
          <span class="parada__punto" aria-hidden="true"></span>
          <p class="parada__tipo">{tipo}</p>
          <h3 class="parada__rol">{rol}</h3>
          <p class="parada__lugar">{lugar}</p>
          <p class="parada__fechas">{fechas}</p>{d}
        </li>
"""

def sobre():
    trabajo, formacion = t("Trabajo", "Work"), t("Formación", "Training")
    paradas = (
        parada("2010", trabajo, "Editorial Designer", "Gráficas 4", t("Marzo 2010 - Noviembre 2012", "March 2010 - November 2012"),
                t("Maquetación de proyectos para grandes editoriales como Edelvives y Maeva.", "Layout of projects for major publishers such as Edelvives and Maeva."))
      + parada("2013", trabajo, "Visual Designer", "NotesRing Services", t("Enero 2013 - Febrero 2014 · Madrid", "January 2013 - February 2014 · Madrid"),
                t("Único diseñador: definí la estrategia, conceptualicé y produje proyectos digitales e impresos.", "Sole designer: I defined the strategy, conceptualised and produced digital and print projects."))
      + parada("2014", trabajo, "Design Lead", "Hey AV", t("Marzo 2014 - Septiembre 2022", "March 2014 - September 2022"),
                t("Lideré el equipo de diseño (3 personas) en proyectos digitales y de impresión para clientes como IFEMA Madrid, BancaMarch, Óptica Roma, Madrid Destino, Sandevid y Hogar Sí.", "I led the design team (3 people) on digital and print projects for clients such as IFEMA Madrid, BancaMarch, Óptica Roma, Madrid Destino, Sandevid and Hogar Sí."))
      + parada("2021", formacion, "Interaction Design Program | UX/UI", "La Nave Nodriza", t("Noviembre 2021 - Junio 2022", "November 2021 - June 2022"),
                t("El salto al producto digital: diseño de interacción y UX/UI.", "The leap into digital product: interaction design and UX/UI."))
      + parada("2022", trabajo, "Product Designer", "Astara Store", t("Octubre 2022 - Febrero 2024", "October 2022 - February 2024"),
                t("Diseño end-to-end (UX/UI) de la experiencia de compra online de vehículos (sector automoción) y de funcionalidades del Marketplace y de otras marcas de la casa, en estrecha colaboración con producto y tecnología.", "End-to-end (UX/UI) design of the online vehicle buying experience (automotive) and of Marketplace features and other in-house brands, working closely with product and engineering."))
      + parada("2024", trabajo, "Product Designer", "CrowdFarming", t("Febrero 2024 - Noviembre 2026", "February 2024 - November 2026"),
                t("Diseñé desde cero Farmeneur, cooperativa digital para agricultores europeos (+350 usuarios): conceptualización, UX/UI e identidad visual, como único diseñador y trabajando con desarrollo hasta su implementación. Rediseñé las herramientas internas de gestión de pagos y de organización de recursos visuales, y contribuí a la creación y evolución del Design System.", "I designed Farmeneur from scratch, a digital cooperative for European farmers (350+ users): concept, UX/UI and visual identity, as the only designer and working with engineering through to implementation. I redesigned the internal payment management and visual asset tools, and contributed to the creation and evolution of the Design System."))
    )
    cv = t("assets/cv/Andres_CV_2026.pdf", "assets/cv/Andres_CV_2026_EN.pdf")
    return head("about", t("Sobre mí · Andrés Gallego", "About · Andrés Gallego"),
                t("Colombiano de Carabanchel y Moratalaz. Product designer en Madrid con una trayectoria que va del diseño editorial y la publicidad al producto digital UX/UI.", "Colombian from Carabanchel and Moratalaz. Product designer in Madrid, moving from editorial design and advertising into digital product UX/UI.")) + nav("s", "about") + f"""<main id="main" class="page">
<div class="sobre-bloque">
<section class="sobre">
  <div class="sobre__cab">
    <div class="retrato">
      <div class="avatar">AG<img src="{PRE}assets/img/andres-montana.webp" alt="{t("Retrato de Andrés Gallego", "Portrait of Andrés Gallego")}"></div>
      <img class="dibujo dibujo--skate dibujo--movil" src="{PRE}assets/img/pizza.webp" alt="{t("Ilustración animada de una figura con un monopatín", "Animated illustration of a figure with a skateboard")}">
    </div>
    <h1 class="solo-lectores">{t("Product Designer con más de 4 años en producto digital y 15 de experiencia en diseño gráfico y visual", "Product Designer with over 4 years in digital product and 15 years of experience in graphic and visual design")}</h1>
  </div>
</section>
<section class="bio" id="quien" aria-labelledby="h-quien">
  <div class="bio__inner">
    <h2 id="h-quien" class="solo-lectores">{t("Quién soy", "Who I am")}</h2>
    <div class="bio__texto">
      <p>{t("Nací en Colombia y vivo en Madrid desde los nueve años, así que suelo decir que soy colombiano de Carabanchel y Moratalaz.", "I was born in Colombia and have lived in Madrid since I was nine, so I like to say I’m a Colombian from Carabanchel and Moratalaz.")}</p>
      <p>{t("Estudié artes gráficas y mis inicios en el diseño fueron en el mundo editorial. Con el tiempo me entró la curiosidad por la parte más creativa de los proyectos y me encaminé hacia la dirección de arte y el diseño gráfico.", "I studied graphic arts and started out in editorial design. Over time my curiosity pulled me towards the more creative side of projects, and I moved into art direction and graphic design.")}</p>
      <p>{t("Tras ocho años en publicidad y marketing, decidí lanzarme a una nueva aventura: el producto digital UX/UI. Allí aprovecho toda mi experiencia previa en diseño para crear experiencias de interacción y resolver problemas reales.", "After eight years in advertising and marketing, I decided to take on a new adventure: digital product design, UX/UI. There I bring all my previous design experience to interaction design and problem solving.")}</p>
      <p>{t("Trabajo con IA como una herramienta más del proceso: me ayuda a explorar opciones, prototipar en código real y validar ideas más rápido, sin perder el criterio de diseño. Este portfolio lo he construido así, iterando cada detalle hasta publicarlo.", "I work with AI as one more tool in the process: it helps me explore options, prototype in real code and validate ideas faster, without losing design judgement. I built this portfolio that way, iterating every detail until it went live.")}</p>
    </div>
    <a class="enlace-cv" href="{PRE}{cv}" target="_blank" rel="noopener"><svg class="enlace-cv__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>{t("Descargar currículum", "Download CV")}</a>
    <img class="dibujo bio__skate" src="{PRE}assets/img/pizza.webp" alt="" aria-hidden="true">
  </div>
</section>
</div>
<section class="detalle">
  <div class="journey" id="recorrido">
    <aside class="journey__lado">
      <h2>{t("Mi recorrido", "My journey")}</h2>
      <div class="journey__cabeza">
        <p class="journey__year" aria-hidden="true">2010</p>
      </div>
      <h3 class="journey__sub">{t("Producto y UX", "Product & UX")}</h3>
      <ul class="habilidades">
        <li>Product thinking</li><li>{t("UX strategy y resolución de problemas", "UX strategy and problem solving")}</li><li>{t("Flujos de usuario e interaction design", "User flows and interaction design")}</li><li>{t("Arquitectura de la información", "Information architecture")}</li><li>User research</li>
      </ul>
      <h3 class="journey__sub">{t("Diseño de interfaz", "Interface design")}</h3>
      <ul class="habilidades">
        <li>UX/UI</li><li>{t("Design systems y librerías de componentes", "Design systems and component libraries")}</li><li>{t("Prototipado y wireframing", "Prototyping and wireframing")}</li><li>{t("Diseño visual", "Visual design")}</li><li>{t("Dirección de arte y branding", "Art direction and branding")}</li>
      </ul>
    </aside>
    <div class="journey__camino">
      <span class="journey__linea" aria-hidden="true"><span class="journey__relleno"></span></span>
      <ol class="paradas">
{paradas}        <li class="parada parada--siguiente" data-year="{t("Hoy", "Today")}">
          <span class="parada__punto" aria-hidden="true"></span>
          <p class="parada__tipo">{t("Próxima parada", "Next stop")}</p>
          <h3 class="parada__rol">{t("¿Tu equipo?", "Your team?")}</h3>          <p class="parada__fechas"><a href="#contacto">{t("Hablemos", "Let’s talk")} →</a></p>
        </li>
      </ol>
    </div>
  </div>
</section>
<section class="cierre-gris">
  <div class="cierre__dibujo cierre__musica" role="img" aria-label="{t("Ilustración de un personaje con un radiocasete por cabeza, con la música sonando", "Illustration of a character with a boombox for a head, with music playing")}"><img src="{PRE}assets/img/musica-andres.webp" alt="" width="521" height="536"><img class="cierre__onda cierre__onda--izq" src="{PRE}assets/img/musica-onda-izq.webp" alt="" width="521" height="536"><img class="cierre__onda cierre__onda--der" src="{PRE}assets/img/musica-onda-der.webp" alt="" width="521" height="536"></div></section>
{musica()}
{contacto()}
</main>
""" + foot()

# ---------------- Música (discos con preview) ----------------
CANCIONES = [
    # (título, artista, término de búsqueda, clave título, clave artista, color del vinilo)
    ("1979", "The Smashing Pumpkins", "1979 Smashing Pumpkins", "1979", "smashing", "#2f6f73"),
    ("Nights", "Frank Ocean", "Nights Frank Ocean", "nights", "frank ocean", "#d99a3d"),
    ("Esperanza", "Hermanos Gutiérrez", "Esperanza Hermanos Gutierrez", "esperanza", "gutierrez", "#b5522e"),
    ("Sin sentimientos", "Grupo Niche", "Sin sentimientos Grupo Niche", "sin sentimientos", "niche", "#c0392b"),
    ("Weird Fishes / Arpeggi", "Radiohead", "Weird Fishes Arpeggi Radiohead", "weird fishes", "radiohead", "#3f6fb0"),
    ("El hombre pájaro", "Robe", "Robe Iniesta El hombre pajaro", "hombre pajaro", "robe|iniesta", "#6b7f3a"),
    ("Pain", "The War on Drugs", "Pain The War on Drugs", "pain", "war on drugs", "#4a6fa5"),
    ("Escarcha", "Héctor Lavoe", "Escarcha Hector Lavoe", "escarcha", "lavoe", "#c47f2a"),
    ("Triste y vacía", "Héctor Lavoe y Willie Colón", "Triste y vacia Hector Lavoe Willie Colon", "triste y vacia", "lavoe|colon", "#8e3b5a"),
    ("One", "Metallica", "One Metallica", "one", "metallica", "#8a8f98"),
    ("Good News", "Mac Miller", "Good News Mac Miller", "good news", "mac miller", "#3c8a7a"),
    ("Sin medir distancias", "Diomedes Díaz", "Diomedes Diaz Sin medir distancias", "sin medir distancias", "diomedes", "#a8472f"),
    ("Queen of the Highway", "The Doors", "Queen of the highway The Doors", "queen of the highway", "doors", "#c8553d"),
    ("The Seed (2.0)", "The Roots y Cody ChesnuTT", "The Seed 2.0 The Roots Cody Chesnutt", "the seed", "roots|chesnutt", "#d9a441"),
    ("El preso", "Fruko y sus Tesos", "El preso Fruko y sus tesos", "el preso", "fruko", "#b8412f"),
    ("Hey", "Pixies", "Hey Pixies", "hey", "pixies", "#4f7a5a"),
    ("Snowblind", "Black Sabbath", "Snowblind Black Sabbath", "snowblind", "black sabbath", "#5a5f8a"),
    ("Nuthin’ but a “G” Thang", "Dr. Dre y Snoop Dogg", "Nuthin but a G thang Dr Dre Snoop Dogg", "thang", "dre|snoop", "#7a4fa0"),
    ("Under the Bridge", "Red Hot Chili Peppers", "Under the bridge Red Hot Chili Peppers", "under the bridge", "chili peppers", "#d2552f"),
    ("Hard Row", "The Black Keys", "Hard Row The Black Keys", "hard row", "black keys", "#3c6e91"),
    ("Tighten Up", "The Black Keys", "Tighten Up The Black Keys", "tighten up", "black keys", "#c99a2e"),
    ("Hometown Glory", "Adele", "Hometown Glory Adele", "hometown glory", "adele", "#2f6f8f"),
    ("Lágrimas negras", "Bebo Valdés y Diego El Cigala", "Lagrimas negras Bebo Valdes Diego El Cigala", "lagrimas negras", "cigala|bebo", "#a23b4f"),
    ("Si te vas…", "Extremoduro", "Si te vas Extremoduro", "si te vas", "extremoduro", "#6b8e4e"),
    ("Danny Nedelko", "IDLES", "Danny Nedelko Idles", "danny nedelko", "idles", "#3aa0a0"),
    ("The Funeral", "Band of Horses", "The Funeral Band of Horses", "the funeral", "band of horses", "#8a6a4f"),
    ("Old Man", "Neil Young", "Old man Neil Young", "old man", "neil young", "#c49a3c"),
    ("Soldier On", "The Temper Trap", "Soldier on The Temper Trap", "soldier on", "temper trap", "#4f7a9c"),
    ("Fake Tales of San Francisco", "Arctic Monkeys", "Fake tales of San Francisco Arctic Monkeys", "fake tales of san francisco", "arctic monkeys", "#b24a3a"),
    ("Everlong", "Foo Fighters", "Everlong Foo Fighters", "everlong", "foo fighters", "#d4682a"),
]

def musica():
    play = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M8 5.5v13l11-6.5z"/><path class="i-pausa" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
    d = ""
    for ti, ar, term, kt, ka, col in CANCIONES:
        d += f"""    <li class="disco" data-term="{term}" data-titulo="{kt}" data-artista="{ka}" data-artistas="{ar}{"|Robe Iniesta" if ar == "Robe" else ""}" style="--vinilo:{col}">
      <div class="disco__caja">
        <div class="disco__vinilo"><span class="disco__giro" aria-hidden="true"></span>
          <button type="button" class="disco__play" aria-label="{t("Reproducir un fragmento de", "Play a snippet of")} {ti}" disabled>{play}</button></div>
        <button type="button" class="disco__portada" aria-expanded="false" aria-label="{t("Sacar el disco de", "Pull out the record of")} {ti}"><span class="disco__rotulo">{ti}</span><img alt="{t("Carátula de", "Cover of")} {ti}" hidden></button>
      </div>
      <p class="solo-lectores">{ti} — {ar}</p>
    </li>
"""
    return f"""<section class="musica" id="musica" aria-labelledby="h-musica">
  <div class="musica__inner">
    <h2 id="h-musica" class="solo-lectores">{t("Música", "Music")}</h2>
    <p class="musica__intro">{t("La música me mantiene productivo y concentrado.<br>Estas son algunas de mis canciones favoritas:", "Music keeps me productive and focused.<br>Here are some of my favourite tracks:")}</p>
    <p class="musica__pista">{t("Saca el disco y dale al play", "Pull out the record and hit play")}</p>
    <ul class="discos">
{d}    </ul>
    <button type="button" class="enlace-cv musica__otra" hidden><svg class="musica__otra-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="musica__otra-txt">{t("Rebuscar en la caja", "Dig through the crate")}</span></button>
    <p class="solo-lectores" role="status" aria-live="polite" id="musica-aviso"></p>
  </div>
</section>
"""

# ---------------- Personal ----------------
def personal():
    items = [("personal/guitarsman.webp", t("Guitarrista en amarillo", "Guitarist on a yellow background"), "1 / 1", True),
             ("personal/k3.webp", t("Tres guitarristas en azul y amarillo", "Three guitarists in blue and yellow"), "1 / 1", True),
             ("personal/camiseta.webp", t("Camisetas de la marca Suerte le digo", "T-shirts for the brand Suerte le digo"), "1 / 1", False),
             ("personal/closeup.webp", t("Detalle del estampado Suerte", "Close-up of the Suerte print"), "1 / 1", True),
             ("personal/detalle-talla.webp", t("Etiqueta Suerte le digo, est. 2020", "Suerte le digo neck label, est. 2020"), "1 / 1", True),
             ("personal/helados-pattern.webp", t("Patrón de helados", "Ice cream pattern"), "1 / 1", True),
             ("personal/music.webp", t("Patrón de música y conciertos", "Music and concerts pattern"), "1 / 1", True),
             ("personal/coche.webp", t("Ilustración de coche y cajas", "Illustration of a car and boxes"), "898 / 672", True),
             ("personal/dogs.webp", t("Montaña de perros", "Mountain of dogs"), "533 / 400", True)]
    g = ""
    for fl, alt, ratio, m in items:
        g += "  " + media(fl, alt, ratio, cls="media--m" if m else "") + "\n"
    g += ('  <div class="fila-par">' + media("personal/crane.webp", t("Ilustración en viñetas", "Comic-style panel illustration"), "1080 / 1363", cls="par-a")
          + media("personal/cuarentena.webp", t("Cuarentena", "Quarantine"), "2000 / 1333", cls="par-b") + '</div>\n')
    proyectos_vis = [
        ("visual-keepgoing.webp", "Keepgoing", t("Packaging", "Packaging"), t("Envase de la barrita EnergyBar de chocolate y avellana de Keepgoing", "Keepgoing EnergyBar chocolate hazelnut pack"), "https://www.behance.net/gallery/127960447/Keepgoing"),
        ("visual-carme-pinos.webp", t("Exposición Carme Pinós", "Carme Pinós exhibition"), t("Museo ICO · 2020", "Museo ICO · 2020"), t("Cartel tipográfico de la exposición Carme Pinós. Máquinas en el entorno, Museo ICO", "Typographic poster for the exhibition Carme Pinós. Machines in the landscape, Museo ICO"), "https://www.behance.net/gallery/109660359/Exposicion-Carme-Pinos"),
    ]
    vis = ""
    for fl, titulo, meta, alt, url in proyectos_vis:
        vis += (f'    <article class="visual"><a class="visual__enlace" href="{url}" target="_blank" rel="noopener">'
                + media("personal/" + fl, alt, "7 / 4") +
                f'<h3>{titulo}</h3><p class="visual__meta">{meta}</p><p class="visual__ver">{t("Ver en Behance", "View on Behance")} →</p></a></article>\n')
    return head("personal", t("Personal · Andrés Gallego", "Personal · Andrés Gallego"),
                t("Ilustraciones y otros trabajos de Andrés Gallego.", "Illustrations and other work by Andrés Gallego.")) + nav("x", "personal") + f"""<main id="main" class="page">
<div class="personal">
<header><img class="dibujo dibujo--cierre dibujo--titulo" src="{PRE}assets/img/pieces.webp" alt="{t("Ilustración animada de una figura de pie", "Animated illustration of a standing figure")}"><h1 class="sr-solo">Personal</h1><p>{t("Ilustraciones y otros trabajos.", "Illustrations and other work.")}</p></header>
<section class="ilustraciones" aria-label="{t("Ilustración y otros trabajos", "Illustration and other work")}">
<div class="galeria">
{g}</div>
</section>
<section class="visuales" aria-labelledby="h-visual">
  <h2 id="h-visual">{t("Diseño gráfico y editorial", "Graphic and editorial design")}</h2>
  <p class="visuales__intro">{t("Proyectos de mis años en diseño visual, antes de pasarme al producto digital.", "Projects from my years in visual design, before moving into digital product.")}</p>
  <div class="visuales__lista">
{vis}  </div>
</section>
</div>
{contacto()}
</main>
""" + foot()

# ---------------- Casos de estudio ----------------
def caso(key, sub, meta, secciones, siguiente):
    P = {p["key"]: p for p in proyectos()}
    p = P[key]
    m = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in meta)
    body = ""
    for titulo, cont, tono in secciones:
        cls = "cs-section" + (f" cs-section--{tono}" if tono else "")
        body += f'<section class="{cls}"><div class="cs-wrap"><h2>{titulo}</h2>\n{cont}\n</div></section>\n'
    nx = P[siguiente]
    return head(key, p["titulo"] + " · Andrés Gallego", sub) + nav("h", key) + f"""<main id="main" class="page">
<header class="cs-hero"><a class="volver" href="{u('index')}" aria-label="{t('Volver a proyectos', 'Back to work')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5.5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a><h1>{p['titulo']}</h1><p class="sub">{sub}</p></header>
<div class="cs-portada">{media(p['img'], p['portada'], '16 / 9')}</div>
<dl class="cs-meta">{m}</dl>
{body}<a class="siguiente" href="{u(siguiente)}"><small>{t("Siguiente proyecto", "Next project")}</small><span>{nx['titulo']} →</span></a>
</main>
""" + foot()

def co(x, c=""): return f'<div class="callout {c}">{x}</div>'
def ul(*items): return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"

def metas(empresa, rol_sector_foco_con):
    sector, foco, con = rol_sector_foco_con
    return [(t("Empresa", "Company"), empresa), (t("Rol", "Role"), "Product Designer"), (t("Sector", "Sector"), sector),
            (t("Foco", "Focus"), foco), (t("Con quién", "Worked with"), con)]

def fz():
    S = [
     (t("Contexto", "Context"), f"""<p>{t("La <strong>FarmerZone</strong> es el <strong>portal privado de todos los agricultores que venden a través de la plataforma de CrowdFarming</strong>. Es su dashboard central para gestionar las actividades clave de su negocio, como:", "The <strong>FarmerZone</strong> is the <strong>private portal for every farmer who sells through the CrowdFarming platform</strong>. It is their central dashboard to manage the key activities of their business, such as:")}</p>
{ul(t("Seguir las ventas y las adopciones", "Tracking sales and adoptions"), t("Revisar los pedidos y los próximos envíos", "Reviewing orders and upcoming shipments"))}
{media("farmerzone-dashboard.webp", t("Login y dashboard de la FarmerZone", "FarmerZone login and dashboard"), cap=t("Login y dashboard de la FarmerZone", "FarmerZone login and dashboard"))}""", ""),
     (t("El reto", "The challenge"), f"""<p>{t("Cada mes, el equipo de finanzas enviaba a los agricultores un <strong>Excel gigante con el desglose detallado de su pago</strong>.", "Every month, the finance team sent farmers a <strong>giant Excel file with the detailed breakdown of their payout</strong>.")}</p>
{media("farmerzone-excel.webp", t("Excel de pagos", "Payout spreadsheet"), cap=t("Excel de pagos", "Payout spreadsheet"))}
<p>{t("La hoja de cálculo era tan compleja que hizo falta un tutorial en YouTube para explicársela a los agricultores.", "The spreadsheet was so complex that a YouTube tutorial was needed to explain it to farmers.")}</p>
{media("farmerzone-youtube.webp", t("Tutorial de YouTube sobre los pagos", "YouTube tutorial about payouts"), cap=t("Tutorial de YouTube sobre los pagos", "YouTube tutorial about payouts"))}
<p>{t("¿Cómo podíamos llevar este proceso a la FarmerZone?", "How could we bring this process into the FarmerZone?")}</p>
{co(t("🎯 Crear una experiencia simple, transparente y fiable <strong>para los agricultores</strong>, para que puedan consultar sus pagos en cualquier momento y lugar.", "🎯 Create a simple, transparent and reliable experience <strong>for farmers</strong>, so they can check their payouts anytime, anywhere."))}
{co(t("💼 <strong>Reducir la carga de trabajo del equipo de Finanzas</strong> y minimizar el riesgo de error humano.", "💼 <strong>Reduce the Finance team’s workload</strong> and minimise the risk of human error."))}""", "veis"),
     (t("Investigación", "Research"), f"""{ul(t("Primero, estudié el Excel gigante <strong>columna por columna</strong>.", "First, I studied the giant Excel file <strong>column by column</strong>."), t("Mi objetivo era encontrar una <strong>forma más sencilla de agrupar y mostrar</strong> toda esa información.", "My goal was to find a <strong>simpler way to group and show</strong> all that information."), t("Creo que vi el <strong>vídeo tutorial unas 30 veces</strong> ▶️.", "I think I watched the <strong>tutorial video about 30 times</strong> ▶️."), t("Descubrir qué problemas (<strong>además de los evidentes</strong>) tenían los agricultores con esto.", "Finding out which problems (<strong>beyond the obvious ones</strong>) farmers had with it."))}
{media("farmerzone-figjam.webp", t("Dashboard de FigJam", "FigJam dashboard"), cap=t("Dashboard de FigJam: entender los pagos y extraer conclusiones", "FigJam dashboard: understanding payouts and drawing conclusions"))}
<h3>{t("Hallazgos clave", "Key findings")}</h3>
{co(t("📑 Necesitan entender fácilmente <strong>qué pedidos corresponden a cada pago</strong>.", "📑 They need to easily understand <strong>which orders belong to each payout</strong>."), "callout--gris")}
{co(t("🟡 Necesitan conocer el <strong>estado de pago de cada pedido</strong>.", "🟡 They need to know the <strong>payment status of each order</strong>."), "callout--gris")}
{co(t("💡 Crear <strong>trazabilidad total conectando cada pedido directamente con su pago</strong>.", "💡 Create <strong>full traceability by connecting each order directly to its payout</strong>."))}""", ""),
     (t("La solución", "The solution"), f"""<h3>{t("Una sección de pagos clara y accionable", "A clear, actionable payouts section")}</h3>
{media("farmerzone-pagos.webp", t("Sección de pagos con dashboard resumen y tabla", "Payouts section with summary dashboard and table"))}
{ul(t("La página empieza con un <strong>dashboard resumen</strong> que da a los agricultores una visión rápida y general de sus datos de ingresos más importantes.", "The page starts with a <strong>summary dashboard</strong> that gives farmers a quick overview of their most important income data."), t("Debajo hay una tabla detallada y con buscador de cada pago, que aporta la transparencia y la trazabilidad totales que faltaban en el antiguo Excel.", "Below it there is a detailed, searchable table of every payout, bringing the full transparency and traceability that the old Excel lacked."), t("Los agricultores pueden filtrar por temporada o por rango de fechas, y así tienen pleno control para encontrar justo la información que necesitan.", "Farmers can filter by season or date range, so they have full control to find exactly the information they need."))}
<h3>{t("La página de detalle del pago", "The payout detail page")}</h3>
{media("farmerzone-detalle.webp", t("Página de detalle del pago", "Payout detail page"))}
{ul(t("Esta pantalla ofrece trazabilidad total: muestra <strong>cada producto incluido en el pago y lo enlaza con su pedido original</strong>.", "This screen offers full traceability: it shows <strong>every product included in the payout and links it to its original order</strong>."), t("Arriba se muestra un <strong>resumen de todos los pedidos incluidos</strong> y hay una opción de «Descargar a Excel» para su propia contabilidad.", "At the top there is a <strong>summary of all the included orders</strong> and a “Download to Excel” option for their own bookkeeping."))}
<h3>{t("Desglose completo del precio", "Full price breakdown")}</h3>
{media("farmerzone-desglose.webp", t("Desglose completo del precio", "Full price breakdown"))}
<p>{t("Para el máximo nivel de detalle, los agricultores pueden hacer clic en cualquier producto y ver el desglose completo del precio.", "For the highest level of detail, farmers can click on any product and see its full price breakdown.")}</p>
<h3>{t("Conectando pedidos con pagos", "Connecting orders with payouts")}</h3>
{media("farmerzone-pedidos.webp", t("Sección de pedidos rediseñada", "Redesigned orders section"))}
<p>{t("El proyecto de Pagos reveló una <strong>oportunidad para rediseñar toda la sección de «Pedidos»</strong>.", "The Payouts project revealed an <strong>opportunity to redesign the whole “Orders” section</strong>.")}</p>
{co(t("⬆️ <strong>Mejoramos por completo el sistema de filtros</strong>. Ahora incluye pestañas de filtro rápido por estado de pago y «filter chips» visibles, que antes no existían.", "⬆️ <strong>We completely improved the filter system</strong>. It now includes quick-filter tabs by payment status and visible filter chips, which didn’t exist before."))}
{co(t("🖇️ Cada <strong>pedido pagado ahora enlaza directamente con su pago correspondiente</strong>, creando la trazabilidad de principio a fin que <strong>los agricultores necesitaban</strong>.", "🖇️ Each <strong>paid order now links directly to its corresponding payout</strong>, creating the end-to-end traceability that <strong>farmers needed</strong>."))}""", "fondito"),
     (t("Impacto y próximos pasos", "Impact and next steps"), f"""{co(t("🚀 La nueva sección de Pagos ya está en producción. Hemos sustituido con éxito el complejo Excel por una experiencia simple, transparente y fiable para nuestros agricultores.", "🚀 The new Payouts section is already in production. We have successfully replaced the complex Excel with a simple, transparent and reliable experience for our farmers."), "callout--gris")}
{co(t("🚨 El <strong>siguiente paso inmediato es mejorar el formato del informe de Excel descargable</strong>. Fue una decisión deliberada para poder lanzar antes y es la máxima prioridad de la próxima iteración.", "🚨 The <strong>immediate next step is to improve the format of the downloadable Excel report</strong>. It was a deliberate decision so we could launch sooner, and it is the top priority of the next iteration."), "callout--gris")}""", ""),
    ]
    return caso("fz", t("Del Excel gigante a una sección de pagos clara, transparente y trazable para los agricultores.", "From a giant Excel file to a clear, transparent and traceable payouts section for farmers."),
        metas("CrowdFarming (2024)", (t("Agrotech, E-commerce", "Agrotech, E-commerce"), "B2B Design, Partner Portal", t("Product Management, equipo de Finanzas", "Product Management, Finance team"))), S, "hub")

def hub():
    S = [
     (t("Contexto", "Context"), f"""<p>{t("CrowdFarming es una plataforma que conecta a los consumidores directamente con los agricultores, donde los usuarios pueden «adoptar» un árbol o una unidad de cultivo, pedir cajas sueltas o crear una suscripción.", "CrowdFarming is a platform that connects consumers directly with farmers, where users can “adopt” a tree or a crop unit, order single boxes or create a subscription.")}</p>
<p>{t("<strong>FRP</strong> es el <strong>nuevo back office de CrowdFarming</strong>, un proyecto que sigue en marcha y que implica mucho trabajo de migración y código legacy.", "<strong>FRP</strong> is <strong>CrowdFarming’s new back office</strong>, an ongoing project that involves a lot of migration work and legacy code.")}</p>
{duo(media("hub-backoffice-antiguo.webp", t("Back office antiguo", "Old back office"), cap=t("Back office antiguo", "Old back office")), media("hub-backoffice-nuevo.webp", t("Back office nuevo", "New back office"), cap=t("Back office nuevo", "New back office")))}""", ""),
     (t("El reto", "The challenge"), f"""<p>{t("El <strong>equipo web de CrowdFarming</strong> itera constantemente sobre cómo se muestran las imágenes. Por ejemplo, prueban a poner varias fotos dentro de una misma card o a añadir vídeos de YouTube a la página de producto.", "The <strong>CrowdFarming web team</strong> is constantly iterating on how images are displayed. For example, they test putting several photos inside a single card or adding YouTube videos to the product page.")}</p>
{duo(media("hub-reto-1.webp", t("Variante de card con varias fotos", "Card variant with several photos")), media("hub-reto-2.webp", t("Página de producto con vídeo", "Product page with video")))}
{co(t("🚨 El <strong>problema de fondo</strong>: la selección y el orden de las imágenes eran un proceso manual, <strong>desconectado del back office</strong>. Esto generaba dos problemas importantes: inconsistencias en los datos y <strong>retrasos significativos en la publicación de nuevos proyectos</strong>.", "🚨 The <strong>underlying problem</strong>: selecting and ordering images was a manual process, <strong>disconnected from the back office</strong>. This caused two major issues: data inconsistencies and <strong>significant delays in publishing new projects</strong>."), "callout--aviso")}""", "veis"),
     (t("Punto de partida", "Starting point"), f"""<p>{t("Mi primer paso fue entender a fondo el problema y el escenario existente con el que tenía que trabajar. En FRP, un «Proyecto» es <strong>una agregación de otras entidades como Agricultores, Fincas y Productos</strong>. Muchas de estas entidades tienen <strong>sus propias imágenes</strong>, y cada imagen requiere <strong>texto alternativo en 7 idiomas distintos</strong>, lo que añadía complejidad.", "My first step was to deeply understand the problem and the existing scenario I had to work with. In FRP, a “Project” is <strong>an aggregation of other entities such as Farmers, Farms and Products</strong>. Many of these entities have <strong>their own images</strong>, and each image requires <strong>alt text in 7 different languages</strong>, which added complexity.")}</p>
{co(t("📂 Un <strong>«Proyecto» es una agregación de varias entidades</strong> (p. ej., Agricultores, Fincas, Productos, etc.).", "📂 A <strong>“Project” is an aggregation of several entities</strong> (e.g. Farmers, Farms, Products, etc.)."), "callout--gris")}
{co(t("🖼️ Muchas de estas entidades <strong>tienen sus propias imágenes</strong>, y cada una necesita texto alternativo en 7 idiomas.", "🖼️ Many of these entities <strong>have their own images</strong>, and each one needs alt text in 7 languages."), "callout--gris")}
{duo(media("hub-punto-partida-1.webp", t("Entidades con sus propias imágenes", "Entities with their own images"), cap=t("Muchas de estas entidades tienen sus propias imágenes, y cada una necesita texto alternativo en 7 idiomas.", "Many of these entities have their own images, and each one needs alt text in 7 languages.")), media("hub-punto-partida-2.webp", t("Página de Proyecto anterior en FRP", "Previous Project page in FRP"), cap=t("La página de Proyecto anterior en FRP. Los usuarios no podían ver todas las imágenes de un vistazo, ni editarlas o gestionar su orden.", "The previous Project page in FRP. Users couldn’t see all the images at a glance, nor edit them or manage their order.")))}""", ""),
     (t("Investigación", "Research"), f"""<p>{t("Entrevisté a varios usuarios de nuestro equipo de back office para entender mejor sus necesidades e identificar nuevas oportunidades.", "I interviewed several users from our back office team to better understand their needs and identify new opportunities.")}</p>
<p>{t("Estos fueron los principales insights:", "These were the main insights:")}</p>
{ul(t("Poder <strong>ver todas las imágenes del proyecto en un solo lugar</strong>", "Being able to <strong>see all the project’s images in one place</strong>"), t("Poder <strong>añadir y eliminar imágenes</strong>", "Being able to <strong>add and remove images</strong>"), t("Poder <strong>reordenar</strong> las imágenes", "Being able to <strong>reorder</strong> images"), t("Poder diferenciar <strong>entre imágenes de card</strong> e <strong>imágenes de la página de producto</strong>", "Being able to tell <strong>card images</strong> from <strong>product page images</strong>"))}
{co(t("💡 Oportunidad: <strong>mejorar</strong> la experiencia de <strong>gestionar el texto alternativo multiidioma</strong>.", "💡 Opportunity: <strong>improve</strong> the experience of <strong>managing multilingual alt text</strong>."))}
{media("hub-insights.webp", t("Resumen de insights de la investigación", "Summary of research insights"))}
<p>{t("Con estos insights en mente, hice un <strong>benchmark</strong>. Analicé cómo resuelven problemas similares productos con galerías de imágenes complejas, como Shopify, WordPress y Squarespace.", "With these insights in mind, I ran a <strong>benchmark</strong>. I analysed how products with complex image galleries, such as Shopify, WordPress and Squarespace, solve similar problems.")}</p>""", "fondito"),
     (t("Ideación", "Ideation"), f"""<p>{t("Con los insights de la investigación en mente, pasé a la fase de ideación.", "With the research insights in mind, I moved on to the ideation phase.")}</p>
<p>{t("Mi primera propuesta fue diseñar una card autónoma que permitiera a los usuarios <strong>subir varias imágenes a la vez</strong> y reordenarlas fácilmente.", "My first proposal was to design a standalone card that let users <strong>upload several images at once</strong> and reorder them easily.")}</p>
{media("hub-ideacion.webp", t("Primera propuesta: card autónoma de subida múltiple", "First proposal: standalone multi-upload card"), cap=t("La primera propuesta fue diseñar una card autónoma que permitiera a los usuarios subir varias imágenes a la vez y reordenarlas fácilmente.", "The first proposal was to design a standalone card that let users upload several images at once and reorder them easily."))}
<h3>{t("Restricciones y descubrimientos", "Constraints and discoveries")}</h3>
{co(t("⛔ <strong>No era posible recortar una imagen después de subirla</strong> (esto crearía imágenes duplicadas). <strong>Requería un esfuerzo de desarrollo</strong> que quedaba fuera del alcance de este proyecto.", "⛔ <strong>It wasn’t possible to crop an image after uploading it</strong> (this would create duplicate images). <strong>It required development effort</strong> that was outside the scope of this project."))}
{co(t("🖼️ La web de CrowdFarming utiliza <strong>otras dos proporciones que el recortador actual del back office no contemplaba</strong>.", "🖼️ The CrowdFarming website uses <strong>two other aspect ratios that the back office’s current cropper didn’t support</strong>."))}""", ""),
     (t("La solución", "The solution"), f"""<h3>{t("Un único lugar para todas las imágenes del proyecto", "A single place for all the project’s images")}</h3>
{media("hub-solucion-1.webp", t("Todas las imágenes del proyecto en un solo lugar", "All the project’s images in one place"))}
{ul(t("Ahora, al crear un proyecto, el sistema encuentra y muestra automáticamente todas las imágenes relacionadas.", "Now, when creating a project, the system automatically finds and shows all the related images."), t("Esto aporta visibilidad inmediata y crea una única fuente de verdad para todos los visuales del proyecto.", "This provides immediate visibility and creates a single source of truth for all the project’s visuals."))}
<h3>{t("La pestaña «Files»: funcionalidades clave", "The “Files” tab: key features")}</h3>
{media("hub-files.webp", t("Pestaña Files", "Files tab"))}
{ul(t("Introdujimos una <strong>pestaña «Files» donde los usuarios pueden subir fotos nuevas y eliminarlas</strong>.", "We introduced a <strong>“Files” tab where users can upload new photos and delete them</strong>."), t("Era importante <strong>diferenciar</strong> esta biblioteca maestra <strong>de las imágenes seleccionadas en la pestaña «Info»</strong>, que representan la selección final del proyecto.", "It was important to <strong>differentiate</strong> this master library <strong>from the images selected in the “Info” tab</strong>, which represent the project’s final selection."))}
{co(t("🛡️ Una decisión de diseño clave fue <strong>proteger los assets originales: las imágenes heredadas (identificadas con tags) no se pueden eliminar aquí</strong>, sino que deben gestionarse en su origen.", "🛡️ A key design decision was to <strong>protect the original assets: inherited images (identified with tags) can’t be deleted here</strong> and must be managed at their source."))}
<h3>{t("Editar imágenes de PDP/CARD y su orden", "Editing PDP/CARD images and their order")}</h3>
{media("hub-modal.webp", t("Modal de dos paneles para editar imágenes", "Two-panel modal for editing images"))}
<p>{t("Diseñé un <strong>modal de dos paneles</strong> para que la edición fuera intuitiva. A la derecha, los usuarios ven su biblioteca completa de imágenes disponibles. A la izquierda, construyen su galería seleccionada añadiendo imágenes de la biblioteca y luego simplemente arrastrando para reordenarlas o eliminarlas.", "I designed a <strong>two-panel modal</strong> to make editing intuitive. On the right, users see their full library of available images. On the left, they build their selected gallery by adding images from the library and then simply dragging to reorder or remove them.")}</p>
<h3>{t("El flujo de subida y preparación", "The upload and preparation flow")}</h3>
{media("hub-subida.webp", t("Flujo de subida y recorte", "Upload and crop flow"))}
{co(t("🚧 <strong>Debido a las restricciones técnicas que mencioné</strong>, el flujo de subida se diseñó para <strong>imágenes individuales, con un recorte obligatorio</strong> en cada una.", "🚧 <strong>Because of the technical constraints I mentioned</strong>, the upload flow was designed for <strong>single images, with a mandatory crop</strong> on each one."))}
{co(t("🌐 Una decisión estratégica clave fue <strong>centralizar la gestión del texto alternativo</strong>. Quitamos esta responsabilidad de las entidades de origen (como Fincas o Productos) y convertimos al <strong>Proyecto en la única fuente de verdad</strong>. Esto da al equipo pleno control sobre la accesibilidad y el SEO específicos del proyecto.", "🌐 A key strategic decision was to <strong>centralise alt text management</strong>. We removed this responsibility from the source entities (such as Farms or Products) and made the <strong>Project the single source of truth</strong>. This gives the team full control over project-specific accessibility and SEO."))}
<h3>{t("Enriqueciendo el contenido con vídeo", "Enriching the content with video")}</h3>
{media("hub-video.webp", t("Incrustar vídeos de YouTube y Vimeo", "Embedding YouTube and Vimeo videos"))}
<p>{t("También añadimos la opción de incrustar vídeos de YouTube y Vimeo, con sus propios textos alternativos multiidioma.", "We also added the option to embed YouTube and Vimeo videos, with their own multilingual alt text.")}</p>""", "veis"),
     (t("Estado del proyecto y próximos pasos", "Project status and next steps"), f"""{co(t("✅ El diseño final fue <strong>validado con el equipo de Back Office</strong> y me alegra decir que fue <strong>aprobado por completo</strong> tanto por el PM como por el equipo de desarrollo.", "✅ The final design was <strong>validated with the Back Office team</strong> and I’m happy to say it was <strong>fully approved</strong> by both the PM and the development team."), "callout--gris")}
{co(t("🚀 Esperamos que este nuevo sistema <strong>reduzca el time-to-publish de los nuevos proyectos</strong> al <strong>ahorrar mucho tiempo</strong> tanto en <strong>gestionar</strong> las imágenes como en <strong>revisar</strong> el proyecto final.", "🚀 We expect this new system to <strong>reduce the time-to-publish of new projects</strong> by <strong>saving a lot of time</strong> both in <strong>managing</strong> images and in <strong>reviewing</strong> the final project."), "callout--gris")}
{co(t("🛠 Está en el <strong>backlog de desarrollo</strong> y le seguiré de cerca para apoyar a los ingenieros cuando llegue el momento de construirlo.", "🛠 It is in the <strong>development backlog</strong> and I’ll follow it closely to support the engineers when it’s time to build it."), "callout--gris")}""", ""),
    ]
    return caso("hub", t("Un único lugar para gestionar las imágenes de cada proyecto en el nuevo back office de CrowdFarming.", "A single place to manage the images of every project in CrowdFarming’s new back office."),
        metas("CrowdFarming (2025)", (t("Agrotech, E-commerce", "Agrotech, E-commerce"), "CMS, B2B Design", t("Equipo de desarrollo, equipo de Back Office", "Development team, Back Office team"))), S, "alerts")

def alertas():
    S = [
     (t("Contexto", "Context"), f"""<p>{t("<strong>Astara Store</strong> era un <strong>marketplace online</strong> de <strong>coches</strong> y <strong>motos</strong>.", "<strong>Astara Store</strong> was an <strong>online marketplace</strong> for <strong>cars</strong> and <strong>motorbikes</strong>.")}</p>
{media("alertas-contexto.webp", "Astara Store")}
{co(t("💰 El recorrido del usuario suele ser <strong>largo y complejo</strong>, ya que comprar un <strong>vehículo es una compra muy meditada</strong>.", "💰 The user journey is usually <strong>long and complex</strong>, since buying a <strong>vehicle is a very considered purchase</strong>."), "callout--gris")}""", ""),
     (t("El reto", "The challenge"), f"""<p>{t("Mi objetivo principal era <strong>mejorar esa experiencia de búsqueda y descubrimiento</strong>.", "My main goal was to <strong>improve that search and discovery experience</strong>.")}</p>
<p>{t("Para lograrlo, nos centramos en investigar y diseñar estas <strong>tres funcionalidades clave</strong>:", "To achieve it, we focused on researching and designing these <strong>three key features</strong>:")}</p>
{co(t("♥️ <strong>Favoritos</strong>, para que los usuarios puedan <strong>guardar y comparar</strong> coches concretos.", "♥️ <strong>Favourites</strong>, so users can <strong>save and compare</strong> specific cars."))}
{co(t("🔎 <strong>Búsquedas guardadas</strong>, para eliminar ese trabajo repetitivo del día a día.", "🔎 <strong>Saved searches</strong>, to remove that repetitive day-to-day work."))}
{co(t("🔔 Y por último, <strong>Alertas</strong>, para <strong>avisar de forma proactiva a los usuarios en el momento en que se publicaba su coche ideal</strong>.", "🔔 And finally, <strong>Alerts</strong>, to <strong>proactively notify users the moment their ideal car was listed</strong>."))}""", "veis"),
     (t("Investigación", "Research"), f"""<p>{t("Empecé la investigación analizando a la competencia. Me <strong>centré</strong> en cómo otras webs de coches integraban sus <strong>Favoritos</strong>, <strong>Búsquedas guardadas</strong> y <strong>Alertas</strong>, para aprender de sus soluciones y buenas prácticas.", "I started the research by analysing the competition. I <strong>focused</strong> on how other car websites integrated their <strong>Favourites</strong>, <strong>Saved searches</strong> and <strong>Alerts</strong>, to learn from their solutions and best practices.")}</p>
{media("alertas-competidores.webp", t("Competidores", "Competitors"), cap=t("Competidores", "Competitors"))}
<p>{t("Trabajé con mi Product Owner en una sesión de <strong>whiteboarding</strong> para <strong>mapear estos flujos</strong>. El objetivo era validar una V1 y asegurarnos de estar alineados antes de empezar con el diseño visual.", "I worked with my Product Owner in a <strong>whiteboarding</strong> session to <strong>map out these flows</strong>. The goal was to validate a V1 and make sure we were aligned before starting the visual design.")}</p>
{media("alertas-whiteboard.webp", t("Mapa de la sesión de whiteboarding", "Whiteboarding session map"), cap=t("Mapa de la sesión de whiteboarding", "Whiteboarding session map"))}""", ""),
     (t("Ideación", "Ideation"), f"""{ul(t("Con los flujos de usuario aprobados, empecé a traducirlos <strong>en wireframes de baja fidelidad</strong>.", "With the user flows approved, I started translating them <strong>into low-fidelity wireframes</strong>."), t("En Astara teníamos un <strong>UI kit en escala de grises</strong> que me permitía <strong>construir y probar estas estructuras rápidamente</strong>.", "At Astara we had a <strong>greyscale UI kit</strong> that allowed me to <strong>build and test these structures quickly</strong>."))}
{duo(media("alertas-wireframe-1.webp", t("Wireframe de baja fidelidad 1", "Low-fidelity wireframe 1")), media("alertas-wireframe-2.webp", t("Wireframe de baja fidelidad 2", "Low-fidelity wireframe 2")))}
{co(t("💡 Uno de los <strong>primeros retos de diseño</strong> fue decidir una <strong>ubicación consistente para el icono de «favorito»</strong>.", "💡 One of the <strong>first design challenges</strong> was deciding on a <strong>consistent placement for the “favourite” icon</strong>."), "callout--gris")}
<p>{t("El objetivo era encontrar una única solución que resultara intuitiva y funcionara a la perfección en todas las variantes de card.", "The goal was to find a single solution that felt intuitive and worked seamlessly across all card variants.")}</p>""", "fondito"),
     (t("La solución", "The solution"), f"""<h3>{t("♥ Favoritos", "♥ Favourites")}</h3>
<p>{t("Esta fue la solución que encontré para <strong>garantizar la consistencia en todos los layouts de cards de cada tipo de vehículo</strong>.", "This was the solution I found to <strong>ensure consistency across every card layout for each vehicle type</strong>.")}</p>
{media("alertas-favorito-icono.webp", t("Ubicación del icono de favorito en las cards", "Placement of the favourite icon on the cards"))}
{co(t("🎯 La solución fue <strong>establecer una ubicación única</strong> y <strong>consistente para el icono de «favorito»</strong> en la esquina inferior derecha de cada card. Este enfoque <strong>funciona a la perfección en todos los tipos de vehículo y layouts de card</strong>.", "🎯 The solution was to <strong>set a single, consistent placement for the “favourite” icon</strong> in the bottom-right corner of every card. This approach <strong>works seamlessly across all vehicle types and card layouts</strong>."), "callout--gris")}
<h3>{t("Página dedicada de «Favoritos»", "Dedicated “Favourites” page")}</h3>
{ul(t("Para dar a los usuarios un <strong>lugar central donde gestionar lo que encuentran</strong>, diseñé esta página dedicada de «Favoritos», que <strong>también incluye sus «Búsquedas guardadas»</strong>.", "To give users a <strong>central place to manage what they find</strong>, I designed this dedicated “Favourites” page, which <strong>also includes their “Saved searches”</strong>."), t("Otra decisión fue <strong>agrupar automáticamente los elementos por tipo de vehículo</strong>. Esto ayuda a los usuarios a mantenerse organizados y a comparar fácilmente las opciones que están considerando.", "Another decision was to <strong>automatically group items by vehicle type</strong>. This helps users stay organised and easily compare the options they’re considering."))}
{media("alertas-favoritos-pagina.webp", t("Página dedicada de Favoritos", "Dedicated Favourites page"), cap=t("Página dedicada de «Favoritos»", "Dedicated “Favourites” page"))}
<h3>{t("🔎 Búsquedas guardadas", "🔎 Saved searches")}</h3>
{ul(t("Para resolver el problema del trabajo repetitivo, diseñé la pestaña de «Búsquedas guardadas», donde <strong>los usuarios pueden repetir búsquedas complejas con un solo clic</strong>.", "To solve the problem of repetitive work, I designed the “Saved searches” tab, where <strong>users can repeat complex searches with a single click</strong>."), t("La funcionalidad clave aquí es el botón <strong>«Crear alerta»</strong>. Actúa como un puente intuitivo que <strong>permite a los usuarios</strong> convertir fácilmente una búsqueda guardada pasiva en una <strong>alerta proactiva y automática</strong>.", "The key feature here is the <strong>“Create alert”</strong> button. It acts as an intuitive bridge that <strong>lets users</strong> easily turn a passive saved search into a <strong>proactive, automatic alert</strong>."))}
{media("alertas-busquedas-guardadas.webp", t("Página dedicada de Búsquedas guardadas", "Dedicated Saved searches page"), cap=t("Página dedicada de «Búsquedas guardadas»", "Dedicated “Saved searches” page"))}
<h3>{t("🔔 Alertas", "🔔 Alerts")}</h3>
{ul(t("Para que la funcionalidad de «Alertas» fuera <strong>potente y fácil de encontrar</strong>, diseñé <strong>dos puntos de entrada principales</strong> para crearlas.", "To make the “Alerts” feature <strong>powerful and easy to find</strong>, I designed <strong>two main entry points</strong> to create them."), t("Los usuarios pueden <strong>crear una alerta directamente desde una página de resultados de búsqueda</strong> o desde su lista de <strong>búsquedas guardadas</strong> anteriormente.", "Users can <strong>create an alert directly from a search results page</strong> or from their list of previously <strong>saved searches</strong>."))}
{media("alertas-catalogo-motos.webp", t("Página del catálogo de motos", "Motorbike catalogue page"), cap=t("Página del catálogo de motos", "Motorbike catalogue page"))}
<h3>{t("Formulario de creación de alertas", "Alert creation form")}</h3>
{ul(t("Para el formulario de «Crear alerta», tomé la decisión deliberada de <strong>simplificar la experiencia sin incluir todos los filtros posibles</strong>.", "For the “Create alert” form, I made the deliberate decision to <strong>simplify the experience without including every possible filter</strong>."), t("En colaboración con mi Product Owner, <strong>identificamos y priorizamos solo los filtros más esenciales</strong> necesarios para crear una alerta con sentido.", "In collaboration with my Product Owner, we <strong>identified and prioritised only the most essential filters</strong> needed to create a meaningful alert."), t("Esto reduce la complejidad para el usuario y hace el proceso mucho <strong>más rápido</strong> y <strong>menos abrumador</strong>.", "This reduces complexity for the user and makes the process much <strong>faster</strong> and <strong>less overwhelming</strong>."))}
{media("alertas-formulario.webp", t("Formulario de creación de alertas", "Alert creation form"))}
<h3>{t("Notificaciones por email", "Email notifications")}</h3>
<p>{t("La experiencia de «Alertas» <strong>va más allá de la web</strong> y llega a la bandeja de entrada del usuario. Un último paso crucial fue diseñar el <strong>sistema completo de notificaciones por email</strong>.", "The “Alerts” experience <strong>goes beyond the website</strong> and reaches the user’s inbox. A crucial last step was designing the <strong>complete email notification system</strong>.")}</p>
{co(t("📨 Creé un <strong>conjunto de plantillas</strong> que cubre todo el ciclo de vida de una alerta —de la <strong>creación</strong> a los <strong>resultados</strong>— para garantizar una experiencia consistente y útil en cada punto de contacto.", "📨 I created a <strong>set of templates</strong> covering the whole lifecycle of an alert — from <strong>creation</strong> to <strong>results</strong> — to ensure a consistent and useful experience at every touchpoint."), "callout--gris")}
{media("alertas-emails.webp", t("Plantillas de notificaciones por email", "Email notification templates"), cap=t("Plantillas de notificaciones por email", "Email notification templates"))}
<h3>{t("Login y registro rápidos", "Quick login and sign-up")}</h3>
{ul(t("Para habilitar estas nuevas funcionalidades de personalización, los usuarios primero <strong>necesitaban una cuenta</strong>. Esto exigía <strong>diseñar un flujo de login y registro rápido y fluido</strong>.", "To enable these new personalisation features, users first <strong>needed an account</strong>. This required <strong>designing a quick and smooth login and sign-up flow</strong>."), t("El objetivo era <strong>que este paso tuviera la mínima fricción posible</strong>, apareciendo en contexto cuando el usuario intenta guardar por primera vez un vehículo o una búsqueda.", "The goal was <strong>to make this step as frictionless as possible</strong>, appearing in context when the user tries to save a vehicle or a search for the first time."))}
{media("alertas-login.webp", t("Flujo de login y registro rápidos", "Quick login and sign-up flow"))}""", ""),
     (t("Conclusión y aprendizajes clave", "Conclusion and key learnings"), f"""{co(t("✅ El proyecto <strong>concluyó con un diseño completo y de alta fidelidad, listo para el handoff</strong> al equipo de desarrollo.", "✅ The project <strong>concluded with a complete, high-fidelity design, ready for handoff</strong> to the development team."), "callout--gris")}
{co(t("🚫 Por desgracia, <strong>la empresa cesó su actividad antes de que esta funcionalidad pudiera implementarse</strong>.", "🚫 Unfortunately, <strong>the company ceased operations before this feature could be implemented</strong>."), "callout--gris")}""", "veis"),
    ]
    return caso("alerts", t("Mejorar la búsqueda y el descubrimiento en un marketplace de coches y motos con tres funcionalidades clave.", "Improving search and discovery in a car and motorbike marketplace with three key features."),
        metas("Astara Store (2023)", (t("Auto-tech, Movilidad, E-commerce", "Auto-tech, Mobility, E-commerce"), "B2C Design, Search and Discovery", t("Product Management, equipo de desarrollo", "Product Management, development team"))), S, "fz")

def build(lang):
    global L, PRE
    L = lang
    PRE = "" if lang == "es" else "../"
    folder = OUT if lang == "es" else os.path.join(OUT, "en")
    os.makedirs(folder, exist_ok=True)
    pages = {"index": index(), "about": sobre(), "personal": personal(), "fz": fz(), "hub": hub(), "alerts": alertas()}
    for key, c in pages.items():
        open(os.path.join(folder, f(key)), "w", encoding="utf-8").write(c)
    return [f(k) for k in pages]

print("ok es", build("es"))
print("ok en", build("en"))

# --- Archivos del sitio: sitemap, robots y 404 ---
import datetime
hoy = datetime.date.today().isoformat()
urls = ""
for k in FILES:
    esu, enu = abs_url(k, "es"), abs_url(k, "en")
    for u in (esu, enu):
        urls += (f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{hoy}</lastmod>\n"
                 f'    <xhtml:link rel="alternate" hreflang="es" href="{esu}"/>\n'
                 f'    <xhtml:link rel="alternate" hreflang="en" href="{enu}"/>\n  </url>\n')
open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls + '</urlset>\n')
open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
open(os.path.join(OUT, "404.html"), "w", encoding="utf-8").write("""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Página no encontrada · Andrés Gallego</title>
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<main class="page" style="min-height:100svh;display:grid;place-content:center;justify-items:center;text-align:center;gap:18px;padding:40px var(--gutter)">
  <h1 style="margin:0;font-weight:400;font-size:var(--fs-h1)">Esta página no existe</h1>
  <p style="margin:0">This page doesn’t exist.</p>
  <p class="hero__ctas"><a href="/">Volver al inicio</a><a href="/en/">Back to home</a></p>
</main>
</body>
</html>
""")
print("ok extras")
