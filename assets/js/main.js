/* Portfolio de Andrés Gallego · comportamiento mínimo, sin dependencias. */
(function () {
  document.documentElement.classList.add("js");
  var en = document.documentElement.lang === "en";
  var IMG = "assets/img/";
  try { if (document.currentScript && document.currentScript.src) IMG = new URL("../img/", document.currentScript.src).href; } catch (e) {}
  var DISCOS_URL = "assets/data/discos.json";
  try { if (document.currentScript && document.currentScript.src) DISCOS_URL = new URL("../data/discos.json", document.currentScript.src).href; } catch (e) {}

  /* Botón de volver en los casos: si se llegó desde la portada de esta misma web, vuelve atrás en el historial (recupera el punto exacto del scroll); si no, va a los proyectos */
  var volver = document.querySelector(".volver");
  if (volver) volver.addEventListener("click", function (e) {
    try {
      var ref = document.referrer ? new URL(document.referrer) : null;
      var esPortada = ref && ref.origin === location.origin && /\/(en\/)?(index(\.html)?)?$/.test(ref.pathname);
      if (esPortada && history.length > 1) { e.preventDefault(); history.back(); }
    } catch (err) {}
  });

  /* Los enlaces internos van sin .html (andresgallego.com/sobre-mi). Abriendo la web desde el ordenador (file://) eso no funciona,
     así que solo en ese caso se les vuelve a poner el .html (o index.html a las carpetas). En la web publicada no hace nada. */
  if (location.protocol === "file:") {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (!h || /^(#|[a-z]+:|\/\/)/i.test(h) || /^assets\//.test(h.replace(/^(\.\.\/)+/, ""))) return;
      var i = h.indexOf("#"), ruta = i < 0 ? h : h.slice(0, i), ancla = i < 0 ? "" : h.slice(i);
      if (/\/$/.test(ruta) || ruta === "." || ruta === "..") ruta = ruta.replace(/\/?$/, "/") + "index.html";
      else if (!/\.[a-z0-9]+$/i.test(ruta.split("/").pop())) ruta += ".html";
      a.setAttribute("href", ruta + ancla);
    });
  }

  /* Imágenes: si el archivo no existe, se muestra un marcador con el nombre que debe tener. */
  document.querySelectorAll(".media__box").forEach(function (box) {
    var img = box.querySelector("img");
    if (!img) return;
    function ok() { box.classList.add("is-loaded"); }
    function falta() {
      box.classList.add("missing");
      box.dataset.alt = img.getAttribute("alt") || "";
      box.dataset.file = img.getAttribute("src") || "";
    }
    if (img.complete) { img.naturalWidth ? ok() : falta(); }
    else { img.addEventListener("load", ok); img.addEventListener("error", falta); }
  });

  /* Foto de perfil: si falta, se queda el círculo con las iniciales. */
  document.querySelectorAll(".avatar img").forEach(function (img) {
    function quitar() { img.remove(); }
    if (img.complete) { if (!img.naturalWidth) quitar(); }
    else { img.addEventListener("error", quitar); }
  });

  /* Las tarjetas y bloques suben suavemente al entrar en pantalla. */
  var reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add("in"); });
  }

  /* Página de proyectos: al pasar por un título se cambia la vista previa. */
  var enlaces = document.querySelectorAll("[data-preview]");
  var previews = document.querySelectorAll(".preview");
  var lista = document.querySelector(".menu__lista");
  function activar(id) {
    previews.forEach(function (p) { p.classList.toggle("activa", p.id === id); });
    enlaces.forEach(function (a) { a.classList.toggle("atenuado", a.dataset.preview !== id); });
  }
  enlaces.forEach(function (a) {
    a.addEventListener("mouseenter", function () { activar(a.dataset.preview); });
    a.addEventListener("focus", function () { activar(a.dataset.preview); });
  });
  if (lista) {
    lista.addEventListener("mouseleave", function () {
      enlaces.forEach(function (a) { a.classList.remove("atenuado"); });
    });
  }

  /* Recorrido (Sobre mí): la línea se rellena al hacer scroll y la parada activa cambia el año. */
  var journey = document.querySelector(".journey");
  if (journey) {
    var paradas = Array.prototype.slice.call(journey.querySelectorAll(".parada"));
    var relleno = journey.querySelector(".journey__camino");
    var year = journey.querySelector(".journey__year");
    var actual = null;
    function tick() {
      var vh = window.innerHeight, ref = vh * 0.5;
      var r = relleno.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (ref - r.top) / r.height));
      relleno.style.setProperty("--progreso", p.toFixed(4));
      var mejor = paradas[0];
      paradas.forEach(function (el) {
        var b = el.getBoundingClientRect();
        if (b.top < ref) { mejor = el; el.classList.add("vista"); }
      });
      paradas.forEach(function (el) { el.classList.toggle("activa", el === mejor); });
      if (mejor !== actual) {
        actual = mejor;
        if (year) {
          year.classList.add("cambia");
          setTimeout(function () { year.textContent = mejor.dataset.year; year.classList.remove("cambia"); }, 120);
        }
      }
    }
    var ocupado = false;
    function onScroll() { if (ocupado) return; ocupado = true; requestAnimationFrame(function () { ocupado = false; tick(); }); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
  }

  /* Portada en móvil: al hacer scroll, la ilustración sale disparada hacia arriba. */
  var gif = document.querySelector(".hero .dibujo--hero");
  var cab = document.querySelector(".m-cabecera");
  var movil = window.matchMedia("(max-width: 800px)");
  var calma = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (gif) {
    var pendiente = false;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function salida() {
      pendiente = false;
      if (!movil.matches || calma.matches) { gif.style.transform = ""; gif.style.opacity = ""; return; }
      var y = Math.max(0, window.scrollY);
      var a = Math.min(1, y / 260);              /* 0 → 1 durante los primeros 260 px */
      var g = ease(a);
      gif.style.transform = "translate3d(0," + (-g * 220).toFixed(1) + "px,0) scale(" + (1 - g * 0.18).toFixed(3) + ")";
      gif.style.opacity = (1 - Math.min(1, y / 340)).toFixed(3);
    }
    window.addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(salida); } }, { passive: true });
    window.addEventListener("resize", salida);
    salida();
  }

  /* Portada: tras el scroll, la cabeza cae como un balón, rebota y rueda. Un toque la vuelve a lanzar. */
  if (gif && gif.dataset.balon) {
    var balon = document.createElement("img");
    balon.className = "balon"; balon.src = gif.dataset.balon; balon.alt = ""; balon.setAttribute("aria-hidden", "true");
    document.body.appendChild(balon);
    var B = { x: 0, y: 0, vx: 0, vy: 0, r: 0, w: 54, activo: false, lanzado: false, quieto: 0, raf: 0, t0: 0, fin: 0 };
    var G = 2600;   /* gravedad px/s² */
    function suelo() { return window.innerHeight - (movil.matches ? 96 : 30) - B.w * 0.9; }  /* encima de la barra (móvil) o del borde inferior */
    function pinta() { balon.style.transform = "translate3d(" + B.x.toFixed(1) + "px," + B.y.toFixed(1) + "px,0) rotate(" + B.r.toFixed(1) + "deg)"; }
    function paso(ts) {
      if (!B.t0) B.t0 = ts;
      var dt = Math.min(0.032, (ts - B.t0) / 1000); B.t0 = ts;
      B.vy += G * dt; B.x += B.vx * dt; B.y += B.vy * dt; B.r += (B.vx * dt / (B.w / 2)) * 57.3;
      var f = suelo(), maxX = window.innerWidth - B.w;
      if (B.y >= f) {
        B.y = f;
        if (Math.abs(B.vy) > 160) { B.vy = -B.vy * 0.62; B.vx *= 0.9; B.quieto = 0; }
        else { B.vy = 0; B.vx *= 0.96; B.quieto += dt; }
      }
      if (B.x < 0) { B.x = 0; B.vx = Math.abs(B.vx) * 0.7; }
      if (B.x > maxX) { B.x = maxX; B.vx = -Math.abs(B.vx) * 0.7; }
      pinta();
      if (B.quieto > 0.35 && Math.abs(B.vx) < 8) {
        B.activo = false; B.t0 = 0;
        B.fin = setTimeout(function () { balon.classList.add("oculto"); balon.classList.remove("visible"); }, 450);
        return;
      }
      B.raf = requestAnimationFrame(paso);
    }
    function lanza(x, y, vx, vy) {
      clearTimeout(B.fin); cancelAnimationFrame(B.raf);
      B.w = balon.offsetWidth || 54;
      balon.classList.remove("oculto"); balon.classList.add("visible");
      B.x = x; B.y = y; B.vx = vx; B.vy = vy; B.quieto = 0; B.t0 = 0; B.activo = true; pinta();
      B.raf = requestAnimationFrame(paso);
    }
    function suelta() {
      var r = gif.getBoundingClientRect();
      /* En escritorio la cabeza que cae mantiene la proporción que tiene en la ilustración (algo mayor que en el dibujo, ≈38 % de su ancho, máx. 78 px). */
      if (!movil.matches && r.width) balon.style.width = Math.min(78, r.width * 0.38).toFixed(1) + "px"; else balon.style.width = "";
      B.w = balon.offsetWidth || 54;
      var cx = r.left + r.width * 0.584 - B.w / 2, cy = Math.max(60, r.top + r.height * 0.318 - B.w / 2);
      B.lanzado = true;
      lanza(cx, cy, (Math.random() < 0.5 ? -1 : 1) * (movil.matches ? 110 + Math.random() * 80 : 200 + Math.random() * 160), -380);
    }
    balon.addEventListener("click", function () {
      lanza(B.x, Math.min(B.y, suelo()), (Math.random() < 0.5 ? -1 : 1) * (movil.matches ? 140 + Math.random() * 120 : 260 + Math.random() * 220), -1100);
    });
    window.addEventListener("scroll", function () {
      if (calma.matches) return;
      var y = window.scrollY;
      if (y > 110 && !B.lanzado) suelta();
      if (y < 20 && B.lanzado) { B.lanzado = false; clearTimeout(B.fin); cancelAnimationFrame(B.raf); B.activo = false; balon.classList.remove("visible"); balon.classList.add("oculto"); }
    }, { passive: true });
  }

  /* Sobre mí: tras el scroll, el skate de la figura se desmonta: tabla, ejes y ruedas caen, rebotan y se quedan en el suelo. Un toque a una pieza la vuelve a lanzar. */
  var skate = document.querySelector(".sobre .dibujo--skate");
  if (skate) {
    /* tipo, imagen, ancho y alto relativos al largo de la tabla (H), rebote y giro */
    var TIPOS = {
      tabla: { src: IMG + "tabla.svg", w: 0.38, h: 1, rebote: 0.42 },
      eje:   { src: IMG + "eje.svg",   w: 0.42,  h: 0.105, rebote: 0.5 },
      rueda: { src: IMG + "rueda.svg", w: 0.2, h: 0.164, rebote: 0.62 }
    };
    /* posición inicial de cada pieza respecto al centro de la tabla, en unidades de H (como en el dibujo: eje cruzado y una rueda a cada lado) */
    var MONTAJE = [["tabla", 0, 0], ["eje", 0, -0.3], ["eje", 0, 0.3], ["rueda", -0.25, -0.3], ["rueda", 0.25, -0.3], ["rueda", -0.25, 0.3], ["rueda", 0.25, 0.3]];
    var K = { lista: [], raf: 0, t0: 0, lanzado: false, fin: 0 };
    var GP = 2400;
    var piezasK = MONTAJE.map(function (m) {
      var el = document.createElement("img");
      el.className = "balon balon--porcion balon--skate"; el.src = TIPOS[m[0]].src; el.alt = ""; el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
      var p = { el: el, t: TIPOS[m[0]], dx: m[1], dy: m[2], x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, w: 0, h: 0, quieto: 0, parado: true };
      el.addEventListener("click", function () {
        var dir = Math.random() < 0.5 ? -1 : 1;
        p.vx = dir * (movil.matches ? 120 + Math.random() * 100 : 200 + Math.random() * 180); p.vy = -900; p.vr = dir * 360;
        p.y = Math.min(p.y, sueloK(p)); p.quieto = 0; p.parado = false;
        clearTimeout(K.fin); muestraK(); arrancaK();
      });
      return p;
    });
    function sueloK(p) { return window.innerHeight - (movil.matches ? 96 : 30) - p.h; }
    function pintaK(p) { p.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) rotate(" + p.r.toFixed(1) + "deg)"; }
    function muestraK() { piezasK.forEach(function (p) { p.el.classList.remove("oculto"); p.el.classList.add("visible"); }); }
    function ocultaK() { piezasK.forEach(function (p) { p.el.classList.add("oculto"); p.el.classList.remove("visible"); }); }
    function arrancaK() { if (!K.raf) { K.t0 = 0; K.raf = requestAnimationFrame(pasoK); } }
    function pasoK(ts) {
      if (!K.t0) K.t0 = ts;
      var dt = Math.min(0.032, (ts - K.t0) / 1000); K.t0 = ts;
      var vivas = 0;
      piezasK.forEach(function (p) {
        if (p.parado) return;
        p.vy += GP * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        var f = sueloK(p), maxX = window.innerWidth - p.w;
        if (p.y >= f) {
          p.y = f;
          if (Math.abs(p.vy) > 150) { p.vy = -p.vy * p.t.rebote; p.vx *= 0.72; p.vr *= 0.6; p.quieto = 0; }
          else { p.vy = 0; p.vx *= 0.82; p.vr *= 0.8; p.quieto += dt; }
        }
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.5; }
        if (p.x > maxX) { p.x = maxX; p.vx = -Math.abs(p.vx) * 0.5; }
        pintaK(p);
        if (p.quieto > 0.7 && Math.abs(p.vx) < 6) p.parado = true; else vivas++;
      });
      if (!vivas) {
        K.raf = 0;
        K.fin = setTimeout(ocultaK, 500);
        return;
      }
      K.raf = requestAnimationFrame(pasoK);
    }
    /* La ilustración que se ve: en móvil y tablet, la de la foto; en escritorio, la que acompaña a la biografía (la de la foto va oculta y mide 0) */
    var skateBio = document.querySelector(".bio__skate");
    function figuraK() { return (skate.offsetWidth || !skateBio) ? skate : skateBio; }
    function sueltaK() {
      var r = figuraK().getBoundingClientRect();
      /* tamaño proporcional a la figura (la tabla ocupa ≈ un tercio de su alto) y sale de donde la sujeta */
      var H = Math.max(60, r.height * 0.42);
      var cx = r.left + r.width * 0.4, cy = Math.max(70 + H / 2, r.top + r.height * 0.66);
      var dir = Math.random() < 0.5 ? -1 : 1, fuerza = movil.matches ? 0.6 : 1;
      clearTimeout(K.fin);
      piezasK.forEach(function (p, i) {
        p.w = H * p.t.w; p.h = H * p.t.h;
        p.el.style.width = p.w.toFixed(1) + "px"; p.el.style.height = p.h.toFixed(1) + "px";
        p.x = cx + p.dx * H - p.w / 2; p.y = cy + p.dy * H - p.h / 2; p.r = 0;
        /* se le resbala de la mano: todo el conjunto cae junto, casi recto y con un leve giro; las piezas se sueltan unas de otras al rebotar en el suelo */
        if (i === 0) { K.vx0 = dir * (35 + Math.random() * 35) * fuerza; K.vr0 = dir * (35 + Math.random() * 45); p.vx = K.vx0; p.vy = 0; p.vr = K.vr0; }
        else { p.vx = K.vx0 + (Math.random() - 0.5) * 50 * fuerza; p.vy = Math.random() * 40; p.vr = K.vr0 + (Math.random() - 0.5) * 140; }
        p.quieto = 0; p.parado = false; pintaK(p);
      });
      K.lanzado = true; muestraK(); arrancaK();
    }
    window.addEventListener("scroll", function () {
      if (calma.matches) return;
      var y = window.scrollY, fig = figuraK(), r = fig.getBoundingClientRect();
      if (fig === skate) {
        /* móvil y tablet: se desmonta al empezar a hacer scroll */
        if (y > 90 && !K.lanzado) sueltaK();
        if (y < 20 && K.lanzado) reiniciaK();
      } else {
        /* escritorio: se desmonta cuando el scroll llega a la animación, y se vuelve a armar al subir por encima de ella */
        if (!K.lanzado && (r.top + r.height / 2) < window.innerHeight * 0.55 && r.bottom > 90) sueltaK();
        if (K.lanzado && (y < 20 || (r.top + r.height / 2) > window.innerHeight * 0.85)) reiniciaK();
      }
    }, { passive: true });
    function reiniciaK() { K.lanzado = false; clearTimeout(K.fin); cancelAnimationFrame(K.raf); K.raf = 0; ocultaK(); }
  }

  /* Personal: tras el scroll, todas las piezas de la ilustración del título se sueltan, caen, rebotan y se desvanecen. */
  var titulo = document.querySelector(".personal .dibujo--titulo");
  if (titulo) {
    /* [x, y, ancho, alto] de cada pieza en el atlas assets/img/piezas.webp (1024 × 501) y [x, y] de dónde está en la ilustración (700 × 615) */
    var ATLAS = { src: IMG + "piezas.webp", w: 1024, h: 501, fw: 700, fh: 615 };
    var PIEZAS = [[0,0,219,184,178,19],[221,0,151,180,167,281],[374,0,170,152,309,419],[546,0,176,151,374,286],[724,0,115,144,223,381],[841,0,88,143,142,264],[0,186,162,137,30,245],[164,186,99,117,482,268],[265,186,135,114,90,434],[402,186,80,113,518,92],[484,186,96,112,317,60],[582,186,174,110,268,116],[758,186,184,110,266,200],[0,325,92,108,438,111],[94,325,50,108,480,465],[146,325,145,99,509,407],[293,325,135,98,356,366],[430,325,59,91,398,44],[491,325,96,90,303,502],[589,325,85,81,567,289],[676,325,90,80,65,391],[768,325,148,79,26,174],[918,325,90,65,588,364],[0,435,48,64,458,218],[50,435,46,58,299,324],[98,435,71,56,506,205],[171,435,46,54,165,203],[219,435,43,53,475,25],[264,435,43,52,216,209],[309,435,71,50,583,242],[382,435,57,47,110,156],[441,435,37,47,404,437],[480,435,42,46,471,74],[524,435,31,46,285,474],[557,435,33,43,264,507],[592,435,37,42,546,264]];
    var capa = document.createElement("div");
    capa.className = "piezas"; capa.setAttribute("aria-hidden", "true");
    document.body.appendChild(capa);
    var S = { lista: [], raf: 0, t0: 0, t: 0, lanzado: false, fin: 0 };
    var GR = 2400;
    function sueloT(h) { return window.innerHeight - (movil.matches ? 96 : 24) - h; }
    function pintaT(p) { p.el.style.transform = "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px,0) rotate(" + p.r.toFixed(1) + "deg)"; }
    function pasoT(ts) {
      if (!S.t0) S.t0 = ts;
      var dt = Math.min(0.032, (ts - S.t0) / 1000); S.t0 = ts; S.t += dt;
      var quietas = 0, maxX = window.innerWidth;
      S.lista.forEach(function (p) {
        if (S.t < p.d) return;
        if (p.quieto) { quietas++; return; }
        p.vy += GR * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        var f = sueloT(p.h);
        if (p.y >= f) {
          p.y = f;
          if (Math.abs(p.vy) > 140) { p.vy = -p.vy * 0.38; p.vx *= 0.75; p.vr *= 0.6; p.q = 0; }
          else { p.vy = 0; p.vx *= 0.8; p.vr *= 0.75; p.q += dt; if (p.q > 0.35) { p.quieto = true; } }
        }
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.5; }
        if (p.x > maxX - p.w) { p.x = maxX - p.w; p.vx = -Math.abs(p.vx) * 0.5; }
        pintaT(p);
      });
      if (quietas === S.lista.length) {
        S.raf = 0; S.t0 = 0;
        S.fin = setTimeout(function () { capa.classList.add("oculto"); }, 450);
        return;
      }
      S.raf = requestAnimationFrame(pasoT);
    }
    function sueltaT() {
      var r = titulo.getBoundingClientRect();
      if (!r.width) return;
      var s = r.width / ATLAS.fw, off = r.top < 70 ? 70 - r.top : 0;
      capa.innerHTML = ""; capa.classList.remove("oculto"); S.lista = [];
      PIEZAS.forEach(function (q) {
        var el = document.createElement("i");
        el.style.width = (q[2] * s).toFixed(1) + "px"; el.style.height = (q[3] * s).toFixed(1) + "px";
        el.style.backgroundImage = "url(" + ATLAS.src + ")";
        el.style.backgroundSize = (ATLAS.w * s).toFixed(1) + "px " + (ATLAS.h * s).toFixed(1) + "px";
        el.style.backgroundPosition = (-q[0] * s).toFixed(1) + "px " + (-q[1] * s).toFixed(1) + "px";
        capa.appendChild(el);
        var ry = (q[5] + q[3] / 2) / ATLAS.fh, k = movil.matches ? 0.6 : 1;
        var p = { el: el, w: q[2] * s, h: q[3] * s, x: r.left + q[4] * s, y: r.top + q[5] * s + off,
          vx: (Math.random() - 0.5) * 360 * k, vy: -(60 + Math.random() * 260) * k, r: 0, vr: (Math.random() - 0.5) * 520,
          d: (1 - ry) * 0.32 + Math.random() * 0.12, q: 0, quieto: false };
        S.lista.push(p); pintaT(p);
      });
      titulo.style.visibility = "hidden";
      S.lanzado = true; S.t = 0; S.t0 = 0; clearTimeout(S.fin); cancelAnimationFrame(S.raf);
      S.raf = requestAnimationFrame(pasoT);
    }
    function reiniciaT() {
      S.lanzado = false; clearTimeout(S.fin); cancelAnimationFrame(S.raf); S.raf = 0;
      capa.innerHTML = ""; S.lista = []; titulo.style.visibility = "";
    }
    window.addEventListener("scroll", function () {
      if (calma.matches) return;
      var y = window.scrollY;
      if (y > 90 && !S.lanzado) sueltaT();
      if (y < 20 && S.lanzado) reiniciaT();
    }, { passive: true });
  }

  /* Cabecera móvil: se oculta al bajar y reaparece al subir. */
  if (cab) {
    var ultimo = window.scrollY, esperando = false, raiz = document.documentElement;
    function cabecera() {
      esperando = false;
      var y = Math.max(0, window.scrollY), d = y - ultimo;
      raiz.classList.toggle("cab-fondo", y > 30);
      if (y < 10) raiz.classList.remove("cab-oculta");
      else if (d > 6 && y > 70) raiz.classList.add("cab-oculta");
      else if (d < -6) raiz.classList.remove("cab-oculta");
      if (Math.abs(d) > 6) ultimo = y;
    }
    window.addEventListener("scroll", function () { if (!esperando) { esperando = true; requestAnimationFrame(cabecera); } }, { passive: true });
    cabecera();
  }

  /* Botón de email: muestra la dirección con "Copiar" y "Abrir correo" (funciona aunque el móvil no tenga app de correo configurada). */
  var btnMail = document.querySelector(".m-btn[href^='mailto:']");
  if (btnMail) {
    var dir = btnMail.getAttribute("href").replace("mailto:", "");
    var pop = document.createElement("div");
    pop.className = "correo-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Contacto por email"); pop.hidden = true;
    pop.innerHTML = '<p class="correo-pop__dir"></p><div class="correo-pop__acc"><button type="button" class="correo-pop__copiar">' + (en ? "Copy" : "Copiar") + '</button><a class="correo-pop__abrir" href="mailto:' + dir + '">' + (en ? "Open email" : "Abrir correo") + '</a></div>';
    pop.querySelector(".correo-pop__dir").textContent = dir;
    document.body.appendChild(pop);
    var cierre = 0;
    function cerrar() { pop.hidden = true; clearTimeout(cierre); }
    btnMail.addEventListener("click", function (e) {
      e.preventDefault(); pop.hidden = !pop.hidden; clearTimeout(cierre);
      if (!pop.hidden) { pop.querySelector(".correo-pop__copiar").textContent = en ? "Copy" : "Copiar"; cierre = setTimeout(cerrar, 9000); }
    });
    pop.querySelector(".correo-pop__copiar").addEventListener("click", function (e) {
      var b = e.currentTarget;
      function ok() { b.textContent = en ? "Copied!" : "¡Copiado!"; }
      function sel() {
        var r = document.createRange(); r.selectNodeContents(pop.querySelector(".correo-pop__dir"));
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        /* Sin portapapeles moderno (p. ej. página en http), se intenta la copia clásica; si tampoco, queda seleccionado para copiar a mano */
        var hecho = false; try { hecho = document.execCommand("copy"); } catch (e) {}
        if (hecho) ok(); else b.textContent = en ? "Select and copy" : "Selecciona y copia";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(dir).then(ok, sel); else sel();
    });
    document.addEventListener("click", function (e) { if (!pop.hidden && !pop.contains(e.target) && !btnMail.contains(e.target)) cerrar(); });
    window.addEventListener("scroll", function () { if (!pop.hidden) cerrar(); }, { passive: true });
  }
  /* Email entero clicable: copia la dirección y muestra "Email copied!" un momento */
  document.querySelectorAll(".copiar-mail").forEach(function (b) {
    var txt = b.querySelector(".contacto__mail"), orig = txt.textContent;
    b.addEventListener("click", function () {
      var dir = b.getAttribute("data-mail");
      function ok() { b.classList.add("copiado"); txt.textContent = b.getAttribute("data-ok"); clearTimeout(b.__t); b.__t = setTimeout(function () { b.classList.remove("copiado"); txt.textContent = orig; }, 2000); }
      function sel() {
        var r = document.createRange(); r.selectNodeContents(txt); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { if (document.execCommand("copy")) ok(); } catch (e) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(dir).then(ok, sel); else sel();
    });
  });
  /* Música: busca carátula y fragmento (30 s) de cada canción en el catálogo de Apple y reproduce uno a la vez. */
  /* Hay más canciones en la lista que huecos: se barajan y solo se muestran 6 distintas en cada carga */
  var lista = document.querySelector(".discos");
  if (lista) {
    var todos = Array.prototype.slice.call(lista.children), MAX = 6;
    var baraja = function (a) { for (var q = a.length - 1; q > 0; q--) { var z = Math.floor(Math.random() * (q + 1)), tmp = a[q]; a[q] = a[z]; a[z] = tmp; } return a; };
    /* Mazo: el orden barajado de todas las canciones; se reparten de 6 en 6 y no se repite ninguna hasta haberlas visto todas */
    var mazo = baraja(todos.slice());
    mazo.splice(0, MAX).forEach(function (li) { lista.appendChild(li); });
    mazo.forEach(function (li) { li.remove(); });
  }
  var discos = document.querySelectorAll(".disco");
  if (discos.length) {
    var audio = new Audio(), actual = null, cb = 0;
    var norm = function (x) { return (x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
    /* Apple limita las consultas (~20 por minuto): se hacen una a una y el resultado se guarda 7 días en el navegador */
    var cola = Promise.resolve();
    function apiRapida(url) {
      return new Promise(function (ok) {
        function jsonp() {
          var n = "__disco" + (++cb), sc = document.createElement("script"), hecho = false;
          function fin(r) { if (hecho) return; hecho = true; ok(r); sc.remove(); try { delete window[n]; } catch (e) { window[n] = undefined; } }
          window[n] = function (data) { fin(data && data.results || []); };
          sc.onerror = function () { fin([]); };
          setTimeout(function () { fin([]); }, 5000);
          sc.src = url + "&callback=" + n; document.head.appendChild(sc);
        }
        if (window.fetch) fetch(url).then(function (r) { return r.json(); }).then(function (d) { ok(d.results || []); }).catch(jsonp); else jsonp();
      });
    }
    function api(url) { return apiRapida(url).then(function (r) { return new Promise(function (ok) { setTimeout(function () { ok(r); }, 350); }); }); }
    function enCola(fn) { var p = cola.then(fn); cola = p.catch(function () {}); return p; }
    var base = "https://itunes.apple.com/";
    function elige(res, d) {
      var kt = d.getAttribute("data-titulo"), claves = d.getAttribute("data-artista").split("|");
      var buenos = res.filter(function (r) { return r.previewUrl && norm(r.trackName).indexOf(kt) > -1 && claves.some(function (k) { return norm(r.artistName).indexOf(k) > -1; }); });
      /* Se descartan versiones en directo/acústicas/remix y se prefiere la grabación de estudio más antigua (la original) */
      var raro = /\b(en vivo|live|acustic|acoustic|unplugged|remix|karaoke|tributo|tribute|cover|version|sesion|session|mtv)\b/;
      var estudio = buenos.filter(function (r) { return !raro.test(norm(r.trackName + " " + (r.collectionName || ""))); });
      if (estudio.length) buenos = estudio;
      var porFecha = function (a, b) { return String(a.releaseDate || "9").localeCompare(String(b.releaseDate || "9")); };
      var exactos = buenos.filter(function (r) { return norm(r.trackName).replace(/\s*[\(\[].*$/, "").trim() === kt; });
      return (exactos.sort(porFecha)[0]) || buenos.sort(porFecha)[0] || null;
    }
    /* Datos ya resueltos (carátula + fragmento de cada canción): cargan al instante, sin consultar a Apple */
    /* DISCOS_DATA se genera a partir de assets/data/discos.json (va dentro de este archivo para que funcione también abriendo la web con doble clic, sin servidor) */
    var DISCOS_DATA = /*DISCOS_INICIO*/{"1979 Smashing Pumpkins":{"t":"1979 (Remastered 2012)","ar":"The Smashing Pumpkins","al":"Mellon Collie And The Infinite Sadness (2012 Remastered)","y":"1995","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8b/14/59/8b1459ed-e19a-81e8-6098-20ae3b658390/mzaf_17713329694871791363.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/ce/b2/caceb2ed-50f0-c666-e4d0-165a0a1541fc/13UABIM04008.rgb.jpg/600x600bb.jpg"},"Nights Frank Ocean":{"t":"Nights","ar":"Frank Ocean","al":"Blonde","y":"2016","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a6/8c/70/a68c700b-0c96-2eff-79a7-b4c3607a4a0f/mzaf_6282991914472119670.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg"},"Esperanza Hermanos Gutierrez":{"t":"Esperanza","ar":"Hermanos Gutiérrez","al":"Eternamente","y":"2021","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/bd/93/58bd9312-bfb9-1414-3c11-57e3b783addf/mzaf_15713102932025994910.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1a/ee/14/1aee14ba-9901-4132-2d0f-4c2138b431e4/4062851515566_EternamenteCoverDiscosG.jpg/600x600bb.jpg"},"Sin sentimientos Grupo Niche":{"t":"Sin Sentimientos","ar":"Grupo Niche","al":"Cielo de Tambores","y":"1990","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/a7/53/9aa753fd-4fed-e47c-64bd-c9834f92ef5d/mzaf_10353265557661452474.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/48/25/e0/4825e0c2-047c-c047-facd-c0b0c71b7eab/196873951478.jpg/600x600bb.jpg"},"Weird Fishes Arpeggi Radiohead":{"t":"Weird Fishes / Arpeggi","ar":"Radiohead","al":"In Rainbows","y":"2007","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/12/eb/3a12ebaf-89c1-1ac9-6821-3a1de510ef51/mzaf_14543910941982290973.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/600x600bb.jpg"},"Robe Iniesta El hombre pajaro":{"t":"El hombre pájaro","ar":"Robe","al":"Se nos lleva el aire","y":"2023","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/bd/71/9ebd7124-aeb5-6e0a-eb36-5b5e850b76e6/mzaf_9892468601461839551.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3b/23/34/3b233486-4bce-8255-4e0a-6c9608ada0a5/8447053038451.jpg/600x600bb.jpg"},"Pain The War on Drugs":{"t":"Pain","ar":"The War on Drugs","al":"A Deeper Understanding","y":"2017","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b0/3c/90/b03c9006-6c4d-efa1-8ab6-ba1f0b2713f5/mzaf_10105274316269771351.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a7/58/ea/a758ea6b-866e-302c-668a-bad3aa2cf32e/075679893109.jpg/600x600bb.jpg"},"Escarcha Hector Lavoe":{"t":"Escarcha","ar":"Héctor Lavoe","al":"Strikes Back","y":"1987","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1c/32/3e/1c323e86-138f-6796-6faa-ef615a6426aa/mzaf_10657357764132759837.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2e/aa/21/2eaa21b5-e118-0f3c-ec5e-2a21ef38f0b7/19CRGIM08926.rgb.jpg/600x600bb.jpg"},"Triste y vacia Hector Lavoe Willie Colon":{"t":"Triste y Vacía","ar":"Willie Colón & Héctor Lavoe","al":"Vigilante","y":"1982","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1a/89/e4/1a89e40f-3426-7924-135d-da732c2fac75/mzaf_9379689782230113735.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7c/1c/11/7c1c1148-6ff2-fbb0-d535-b4eef8172b07/18CRGIM08461.rgb.jpg/600x600bb.jpg"},"One Metallica":{"t":"One","ar":"Metallica","al":"…And Justice for All (Remastered)","y":"1988","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a9/61/e9/a961e966-bc66-8d07-2477-622fe0d89686/mzaf_16549455621910097892.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/c0/c0/6d/c0c06d9a-16a9-2989-1a24-1f3231fc06f8/18UMGIM34141.rgb.jpg/600x600bb.jpg"},"Good News Mac Miller":{"t":"Good News","ar":"Mac Miller","al":"Circles","y":"2020","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/55/80/7d/55807d1d-19d4-481c-0b36-24120ad3623b/mzaf_16364320153408868703.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/23/39/38/23393826-762f-ec76-dc1e-9344f647c958/093624905981.jpg/600x600bb.jpg"},"Diomedes Diaz Sin medir distancias":{"t":"Sin Medir Distancias","ar":"Diomedes Díaz & Cocha Molina","al":"Brindo Con el Alma","y":"1986","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/f5/d9/17f5d901-e664-11b5-22b7-8c8be07a5b7f/mzaf_16104861865937670018.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music/87/e7/2a/mzi.wqsiewge.jpg/600x600bb.jpg"},"Queen of the highway The Doors":{"t":"Queen Of The Highway","ar":"The Doors","al":"Morrison Hotel","y":"1970","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/25/c6/6025c6f4-440e-4711-c716-6c8fb7b51f68/mzaf_3940942259770003685.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ea/1f/65/ea1f6524-49ef-0d1f-6948-fd7d7d6b0256/603497838721.jpg/600x600bb.jpg"},"The Seed 2.0 The Roots Cody Chesnutt":{"t":"The Seed (2.0)","ar":"The Roots","al":"Phrenology","y":"2002","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cc/4f/14/cc4f14d6-1cd5-e131-0422-a271747c70d7/mzaf_12938087780991860785.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/99/e8/0e/99e80e8f-4a84-8e4d-a2de-c01b2d3d9fc5/20UMGIM96042.rgb.jpg/600x600bb.jpg"},"El preso Fruko y sus tesos":{"t":"El Preso","ar":"Fruko y Sus Tesos","al":"Fruko El Grande","y":"1975","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4c/ba/2a/4cba2acb-6ca7-cf2c-494c-a8ccf1963a91/mzaf_7518653317667425988.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/a0/fc/96/a0fc96bf-7d9f-af62-dd28-b6e23716d183/14209.jpg/600x600bb.jpg"},"Hey Pixies":{"t":"Hey","ar":"Pixies","al":"Doolittle","y":"1989","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5c/b9/ec/5cb9ec4a-a687-7e22-c1b2-269c938b040b/mzaf_9883427498137094488.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/07/72/34077276-8f67-c638-8c4f-73dd89d2dfab/5014436905025.png/600x600bb.jpg"},"Snowblind Black Sabbath":{"t":"Snowblind","ar":"Black Sabbath","al":"Black Sabbath, Vol. 4","y":"1972","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/af/d2/c6/afd2c62a-0be6-5b70-3797-4b4c40c5b2e8/mzaf_10993334868941746378.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/65/68/ac/6568ace4-0c7a-6387-47ed-2f4c3411ff4d/075992725927.jpg/600x600bb.jpg"},"Nuthin but a G thang Dr Dre Snoop Dogg":{"t":"Nuthin' But a \"G\" Thang","ar":"Dr. Dre & Snoop Dogg","al":"The Chronic","y":"1992","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/51/f9/b4/51f9b498-1e42-f113-78a0-c19a7dc15233/mzaf_12815259284929753573.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/22/55/6c/22556ce7-92fb-3a7a-af98-33b0e4bed0d8/23UMGIM07603.rgb.jpg/600x600bb.jpg"},"Under the bridge Red Hot Chili Peppers":{"t":"Under the Bridge","ar":"Red Hot Chili Peppers","al":"Blood Sugar Sex Magik","y":"1991","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9b/5b/76/9b5b76af-214c-82c9-2dae-5971e3bb25ba/mzaf_12325461313798845398.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/2b/56/2b2b564c-e21e-bd40-a8cf-cb47dedcb7df/093624932147.jpg/600x600bb.jpg"},"Hard Row The Black Keys":{"t":"Hard Row","ar":"The Black Keys","al":"Thickfreakness","y":"2003","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ec/dd/61/ecdd6176-9b4a-fa07-490f-5544a592e22f/mzaf_18405919951516237024.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/40/dc/fd/40dcfd07-03fa-5a23-d7d4-7725ba62d947/886446284408.jpg/600x600bb.jpg"},"Tighten Up The Black Keys":{"t":"Tighten Up","ar":"The Black Keys","al":"Brothers (Deluxe Remastered Anniversary Edition)","y":"2010","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/36/c0/55/36c0550d-4512-95ed-8b0d-0161e20438bf/mzaf_15168718613742319582.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/45/98/c6/4598c6f0-b6dd-8909-ac3e-0272c4453121/075597916430.jpg/600x600bb.jpg"},"Hometown Glory Adele":{"t":"Hometown Glory","ar":"Adele","al":"19","y":"2008","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/32/7c/55/327c55f1-bbde-4233-392d-222f335c1d0c/mzaf_1125095491072100170.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/93/3b/dd/933bddde-bd73-0fd2-70f5-f4cf683c34f7/191404093863.png/600x600bb.jpg"},"Lagrimas negras Bebo Valdes Diego El Cigala":{"t":"Lágrimas Negras","ar":"Bebo Valdés & Diego El Cigala","al":"Lágrimas Negras","y":"2003","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/d2/d4/bbd2d4f0-b887-a87e-0ca5-7871b269c036/mzaf_13790404227447963274.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/24/48/5f/24485f93-6a25-4695-f45e-f8d506e62dca/8445162613989.jpg/600x600bb.jpg"},"Si te vas Extremoduro":{"t":"Si Te Vas...","ar":"Extremoduro","al":"Material Defectuoso","y":"2011","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f8/9a/be/f89abe6e-5f3e-66aa-041e-8448b6b0c860/mzaf_7470930615544417258.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c5/68/7f/c5687f87-d9b8-2a4b-d356-c70b7c34e6ea/mzi.reuhhldv.jpg/600x600bb.jpg"},"Danny Nedelko Idles":{"t":"Danny Nedelko","ar":"IDLES","al":"Joy as an Act of Resistance.","y":"2018","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/de/2a/29/de2a2991-adb9-0bd7-ff5a-1fc55c82896c/mzaf_3682283440419544124.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/25/82/79258275-f516-77d9-3398-7e2d7f4f3af3/720841215806_Cover.jpg/600x600bb.jpg"},"The Funeral Band of Horses":{"t":"The Funeral","ar":"Band of Horses","al":"Everything All The Time (20th Anniversary Edition)","y":"2006","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4a/50/3a/4a503a7e-ab10-46ca-7c80-7cc2f1596663/mzaf_10022980710498459080.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/de/90/fb/de90fb54-a087-6025-fb13-3334537688c2/098787173062.png/600x600bb.jpg"},"Old man Neil Young":{"t":"Old Man","ar":"Neil Young","al":"Harvest","y":"1972","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/97/ec/5c/97ec5cc2-846f-c579-1b6a-3b94a519d1bc/mzaf_10476094718101135464.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e0/4b/c4/e04bc4e6-9d3a-0bab-c953-f139c72fd337/093624924722.jpg/600x600bb.jpg"},"Soldier on The Temper Trap":{"t":"Soldier On","ar":"The Temper Trap","al":"Conditions","y":"2009","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/dd/4a/14/dd4a14bc-6148-6e82-888f-65ee22b79088/mzaf_4834768246018707656.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/71/12/6f/71126f46-82f3-65ce-4cbe-5a4f1afa6667/0044003198685_Cover.jpg/600x600bb.jpg"},"Fake tales of San Francisco Arctic Monkeys":{"t":"Fake Tales of San Francisco","ar":"Arctic Monkeys","al":"Whatever People Say I Am, That's What I'm Not","y":"2006","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/ed/72/6eed72b3-c665-061f-a1af-346ad66c5dc1/mzaf_12929384886507228267.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/cf/9b/96/cf9b9637-f619-eceb-5382-e9b4d44e74fb/dj.npwkgmai.jpg/600x600bb.jpg"},"Everlong Foo Fighters":{"t":"Everlong","ar":"Foo Fighters","al":"The Colour and the Shape","y":"1997","p":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/25/c7/3525c700-8776-5b4d-fdd2-7754b26c7fbf/mzaf_10256655135081434791.plus.aac.p.m4a","a":"https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/f5/86/68f586ca-a375-9965-a864-9e227e77ef5b/884977570328.jpg/600x600bb.jpg"}}/*DISCOS_FIN*/;
    function cargaEstatico() { return Promise.resolve(DISCOS_DATA); }
    function busca(d) {
      var term = d.getAttribute("data-term");
      return cargaEstatico().then(function (m) {
        var e = m && m[term];
        return e && e.p ? { preview: e.p, art: e.a, t: Date.now() } : vivo(d);
      });
    }
    function vivo(d, saltar) {
      var term = d.getAttribute("data-term"), clave = "disco:" + term, c = null;
      try { c = JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) {}
      if (!saltar && c && c.preview && Date.now() - c.t < 6048e5) return Promise.resolve(c);
      /* La primera consulta va en paralelo (sin esperar la cola); solo los reintentos se hacen de uno en uno */
      var r = null;
      return apiRapida(base + "search?media=music&entity=song&limit=25&country=ES&term=" + encodeURIComponent(term))
        .then(function (res) { r = elige(res, d); return r; })
        .then(function (x) { if (x) return x; return enCola(function () {
        return api(base + "search?media=music&entity=song&limit=25&country=US&term=" + encodeURIComponent(term)).then(function (res2) { return elige(res2, d); })
          .then(function (x) { r = x; if (r) return r;
            /* Último intento: buscar al artista y repasar su catálogo */
            var nombres = (d.getAttribute("data-artistas") || "").split("|"), i = 0;
            function siguiente() {
              if (i >= nombres.length) return null;
              return api(base + "search?media=music&entity=musicArtist&limit=3&country=ES&term=" + encodeURIComponent(nombres[i++]))
                .then(function (as) { if (!as.length) return siguiente();
                  return api(base + "lookup?id=" + as[0].artistId + "&entity=song&limit=200&country=ES").then(function (cat) { return elige(cat, d) || siguiente(); }); });
            }
            return siguiente(); })
          .then(function (x) {
            if (!x) { try { console.warn("[música] sin resultado para:", term); } catch (e) {} return null; }
            var o = { preview: x.previewUrl, art: (x.artworkUrl100 || "").replace("100x100", "600x600"), t: Date.now() };
            try { localStorage.setItem(clave, JSON.stringify(o)); } catch (e) {}
            return o;
          });
        }); })
        .then(function (x) {
          if (!x) return null;
          if (x.preview) return x;
          var o = { preview: x.previewUrl, art: (x.artworkUrl100 || "").replace("100x100", "600x600"), t: Date.now() };
          try { localStorage.setItem(clave, JSON.stringify(o)); } catch (e) {}
          return o;
        });
    }
    /* Color del vinilo: el tono dominante de la carátula (si el navegador deja leer la imagen) */
    function colorDe(img) {
      try {
        var cv = document.createElement("canvas"); cv.width = cv.height = 32;
        var cx = cv.getContext("2d"); cx.drawImage(img, 0, 0, 32, 32);
        var px = cx.getImageData(0, 0, 32, 32).data, bins = [];
        for (var h0 = 0; h0 < 12; h0++) bins.push({ w: 0, r: 0, g: 0, b: 0 });
        for (var i = 0; i < px.length; i += 4) {
          var r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, dlt = mx - mn;
          if (l < 0.12 || l > 0.92 || dlt < 0.12) continue;
          var s = dlt / (1 - Math.abs(2 * l - 1)), h = mx === r ? ((g - b) / dlt + 6) % 6 : mx === g ? (b - r) / dlt + 2 : (r - g) / dlt + 4;
          var k = bins[Math.floor(h * 2) % 12], w = s * (1 - Math.abs(2 * l - 1));
          k.w += w; k.r += px[i] * w; k.g += px[i + 1] * w; k.b += px[i + 2] * w;
        }
        var top = bins.reduce(function (a, k) { return k.w > a.w ? k : a; }, bins[0]);
        if (top.w <= 0) return null;
        var R = top.r / top.w / 255, G = top.g / top.w / 255, B = top.b / top.w / 255;
        var mx2 = Math.max(R, G, B), mn2 = Math.min(R, G, B), L = (mx2 + mn2) / 2, D = mx2 - mn2, S = D / (1 - Math.abs(2 * L - 1));
        var H = mx2 === R ? ((G - B) / D + 6) % 6 : mx2 === G ? (B - R) / D + 2 : (R - G) / D + 4;
        S = Math.max(S, 0.45); L = Math.min(Math.max(L, 0.36), 0.55);
        return "hsl(" + Math.round(H * 60) + "," + Math.round(Math.min(S, 0.85) * 100) + "%," + Math.round(L * 100) + "%)";
      } catch (e) { return null; }
    }
    function pintaPortada(d, url) {
      var img = d.querySelector(".disco__portada img"), probado = false;
      img.crossOrigin = "anonymous";
      img.onload = function () { img.hidden = false; var c = colorDe(img); if (c) d.style.setProperty("--vinilo", c); };
      img.onerror = function () { if (!probado) { probado = true; img.removeAttribute("crossorigin"); img.src = url; } };
      img.src = url;
    }
    function carga(d) {
      if (d.__cargado) return; d.__cargado = true;
      busca(d).then(function (o) {
        if (!o) return;
        d.__preview = o.preview;
        pintaPortada(d, o.art);
        d.querySelector(".disco__play").disabled = false;
      });
    }
    function para() { audio.pause(); if (actual) { actual.classList.remove("sonando"); actual = null; } }
    audio.addEventListener("ended", para);
    audio.addEventListener("error", function () {
      var d = actual; if (!d || d.__reintento) { para(); return; }
      d.__reintento = true;
      vivo(d, true).then(function (o) { if (o && actual === d) { d.__preview = o.preview; audio.src = o.preview; var p = audio.play(); if (p && p.catch) p.catch(para); } else para(); });
    });
    function enlaza(d) {
      if (d.__enlazado) return; d.__enlazado = true;
      var portada = d.querySelector(".disco__portada"), play = d.querySelector(".disco__play");
      portada.addEventListener("click", function () {
        var abre = !d.classList.contains("abierto");
        d.classList.toggle("abierto", abre); portada.setAttribute("aria-expanded", abre ? "true" : "false");
        if (!abre && actual === d) para();
        carga(d);
      });
      play.addEventListener("click", function () {
        if (actual === d) { para(); return; }
        para();
        if (!d.__preview) return;
        audio.src = d.__preview; actual = d; d.classList.add("sonando");
        var p = audio.play(); if (p && p.catch) p.catch(para);
      });
    }
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { carga(e.target); io.unobserve(e.target); } }); }, { rootMargin: "300px" }) : null;
    function activa(d) { enlaza(d); if (io) io.observe(d); else carga(d); }
    discos.forEach(activa);
    /* Pista discreta de que los discos se pueden sacar: cada disco asoma de la funda la primera vez que el scroll lo trae a la pantalla (en móvil, uno a uno al bajar; en escritorio, por filas), y de vez en cuando uno de los que se ven vuelve a asomar. Todo se para en cuanto alguien abre un disco. */
    var tocado = false, enVista = false, recordando = false, ioA = null;
    function asoma(d, retraso) {
      setTimeout(function () {
        if (tocado || d.classList.contains("abierto")) return;
        d.classList.add("asoma"); setTimeout(function () { d.classList.remove("asoma"); }, 700);
      }, retraso || 0);
    }
    function ola() { if (tocado || !ioA) return; Array.prototype.forEach.call(lista.children, function (d) { d.__asomado = false; ioA.unobserve(d); ioA.observe(d); }); }
    lista.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".disco__portada")) tocado = true; });
    lista.addEventListener("touchstart", function () {}, { passive: true });  /* para que :active funcione al tocar en iPhone */
    if (!calma.matches && "IntersectionObserver" in window) {
      ioA = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting || e.target.__asomado) return;
          e.target.__asomado = true;
          asoma(e.target, 250 + (Array.prototype.indexOf.call(lista.children, e.target) % 2) * 170);
          if (!recordando) {
            recordando = true;
            setInterval(function () {
              if (tocado || !enVista || document.hidden) return;
              var h = window.innerHeight, visibles = Array.prototype.filter.call(lista.children, function (d) {
                var r = d.getBoundingClientRect(); return !d.classList.contains("abierto") && r.top > 60 && r.bottom < h - 20;
              });
              if (visibles.length) asoma(visibles[Math.floor(Math.random() * visibles.length)]);
            }, 6500);
          }
        });
      }, { rootMargin: "0px 0px -35% 0px" });
      Array.prototype.forEach.call(lista.children, function (d) { ioA.observe(d); });
      new IntersectionObserver(function (es) { enVista = es[0].isIntersecting; }).observe(lista);
    }
    /* Botón juguetón: saca otra tanda de 6 discos (prefiriendo los que no se ven ahora) */
    var otra = document.querySelector(".musica__otra");
    if (otra && lista && typeof todos !== "undefined" && todos.length > MAX) {
      var frases = en ? ["Dig through the crate", "Spin another batch", "What else is in there?", "One more and I\u2019ll stop"]
                      : ["Rebuscar en la caja", "Otra tanda, DJ", "A ver qué más hay por ahí", "Una más y paro"];
      var txt = otra.querySelector(".musica__otra-txt"), aviso = document.getElementById("musica-aviso"), vez = 0, ocupado = false;
      otra.hidden = false;
      otra.addEventListener("click", function () {
        if (ocupado) return; ocupado = true;
        para(); otra.classList.add("girando"); setTimeout(function () { otra.classList.remove("girando"); }, 700); lista.classList.add("mezclando");
        setTimeout(function () {
          var visibles = Array.prototype.slice.call(lista.children);
          var nuevos = mazo.splice(0, MAX);
          if (nuevos.length < MAX) {
            /* Se acabó el mazo: se rebaraja con todas las demás, dejando para el final las que ya están en pantalla */
            var resto = todos.filter(function (li) { return nuevos.indexOf(li) < 0; });
            var frescas = resto.filter(function (li) { return visibles.indexOf(li) < 0; }), vistas = resto.filter(function (li) { return visibles.indexOf(li) > -1; });
            mazo = baraja(frescas).concat(baraja(vistas));
            nuevos = nuevos.concat(mazo.splice(0, MAX - nuevos.length));
          }
          visibles.forEach(function (li) {
            li.classList.remove("abierto", "sonando");
            var pb = li.querySelector(".disco__portada"); if (pb) pb.setAttribute("aria-expanded", "false");
            li.remove();
          });
          nuevos.forEach(function (li) { lista.appendChild(li); activa(li); });
          vez = (vez + 1) % frases.length; if (txt) txt.textContent = frases[vez];
          if (aviso) aviso.textContent = en ? "New selection of records" : "Nueva selección de discos";
          lista.classList.remove("mezclando"); ocupado = false; setTimeout(ola, 350);
        }, 260);
      });
    }
  }
  /* Sobre mí: sobre el naranja los enlaces de la cabecera pasan a negro mientras lo cruzan */
  var naranja = document.querySelector(".sobre-bloque");
  if (naranja) {
    var enlaces = document.querySelectorAll(".site-nav a"), pend = false;
    var revisa = function () {
      pend = false;
      var m = naranja.getBoundingClientRect();
      enlaces.forEach(function (a) {
        var r = a.getBoundingClientRect(), y = r.top + r.height / 2;
        a.classList.toggle("nav-negro", y > m.top && y < m.top + 0);
      });
    };
    var pide = function () { if (!pend) { pend = true; requestAnimationFrame(revisa); } };
    window.addEventListener("scroll", pide, { passive: true }); window.addEventListener("resize", pide); revisa();
  }
  /* Enlaces internos (p. ej. "Ver proyectos"): bajan suavemente a la sección SIN añadir #ancla a la dirección.
     Así, si alguien copia o comparte la URL, siempre es la home limpia y no salta directo a los proyectos. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip")) return;
    var id = a.getAttribute("href").slice(1), t = id && document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" });
  });
})();
