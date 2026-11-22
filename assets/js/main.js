/* Portfolio de Andrés Gallego · comportamiento mínimo, sin dependencias. */
(function () {
  document.documentElement.classList.add("js");
  var en = document.documentElement.lang === "en";
  var IMG = "assets/img/";
  try { if (document.currentScript && document.currentScript.src) IMG = new URL("../img/", document.currentScript.src).href; } catch (e) {}

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
    function sueltaK() {
      var r = skate.getBoundingClientRect();
      /* tamaño proporcional a la figura (la tabla ocupa ≈ un tercio de su alto) y sale de donde la sujeta */
      var H = Math.max(60, r.height * 0.42);
      var cx = r.left + r.width * 0.4, cy = Math.max(70 + H / 2, r.top + r.height * 0.66);
      var dir = Math.random() < 0.5 ? -1 : 1, fuerza = movil.matches ? 0.6 : 1;
      clearTimeout(K.fin);
      piezasK.forEach(function (p, i) {
        p.w = H * p.t.w; p.h = H * p.t.h;
        p.el.style.width = p.w.toFixed(1) + "px"; p.el.style.height = p.h.toFixed(1) + "px";
        p.x = cx + p.dx * H - p.w / 2; p.y = cy + p.dy * H - p.h / 2; p.r = 0;
        if (i === 0) { p.vx = dir * (80 + Math.random() * 80) * fuerza; p.vy = -80; p.vr = dir * (90 + Math.random() * 110); }
        else {
          /* las piezas salen despedidas hacia fuera desde donde estaban montadas */
          var lado = p.dx ? Math.sign(p.dx) : (Math.random() < 0.5 ? -1 : 1);
          p.vx = (lado * (60 + Math.random() * 160) + dir * 40) * fuerza;
          p.vy = -(150 + Math.random() * 300);
          p.vr = lado * (200 + Math.random() * 400);
        }
        p.quieto = 0; p.parado = false; pintaK(p);
      });
      K.lanzado = true; muestraK(); arrancaK();
    }
    window.addEventListener("scroll", function () {
      if (calma.matches) return;
      var y = window.scrollY;
      if (y > 90 && !K.lanzado) sueltaK();
      if (y < 20 && K.lanzado) { K.lanzado = false; clearTimeout(K.fin); cancelAnimationFrame(K.raf); K.raf = 0; ocultaK(); }
    }, { passive: true });
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
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = en ? "Select and copy" : "Selecciona y copia";
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
    var todos = Array.prototype.slice.call(lista.children);
    for (var q = todos.length - 1; q > 0; q--) { var z = Math.floor(Math.random() * (q + 1)), tmp = todos[q]; todos[q] = todos[z]; todos[z] = tmp; }
    todos.forEach(function (li, n) { if (n < 6) lista.appendChild(li); else li.remove(); });
  }
  var discos = document.querySelectorAll(".disco");
  if (discos.length) {
    var audio = new Audio(), actual = null, cb = 0;
    var norm = function (x) { return (x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
    /* Apple limita las consultas (~20 por minuto): se hacen una a una y el resultado se guarda 7 días en el navegador */
    var cola = Promise.resolve();
    function api(url) {
      return new Promise(function (ok) {
        function jsonp() {
          var n = "__disco" + (++cb), sc = document.createElement("script"), hecho = false;
          function fin(r) { if (hecho) return; hecho = true; ok(r); sc.remove(); try { delete window[n]; } catch (e) { window[n] = undefined; } }
          window[n] = function (data) { fin(data && data.results || []); };
          sc.onerror = function () { fin([]); };
          setTimeout(function () { fin([]); }, 8000);
          sc.src = url + "&callback=" + n; document.head.appendChild(sc);
        }
        if (window.fetch) fetch(url).then(function (r) { return r.json(); }).then(function (d) { ok(d.results || []); }).catch(jsonp); else jsonp();
      }).then(function (r) { return new Promise(function (ok) { setTimeout(function () { ok(r); }, 350); }); });
    }
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
    function busca(d) {
      var term = d.getAttribute("data-term"), clave = "disco:" + term, c = null;
      try { c = JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) {}
      if (c && c.preview && Date.now() - c.t < 6048e5) return Promise.resolve(c);
      return enCola(function () {
        var r = null;
        return api(base + "search?media=music&entity=song&limit=25&country=ES&term=" + encodeURIComponent(term))
          .then(function (res) { r = elige(res, d); if (r) return r;
            return api(base + "search?media=music&entity=song&limit=25&country=US&term=" + encodeURIComponent(term)).then(function (res2) { return elige(res2, d); }); })
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
    discos.forEach(function (d) {
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
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { carga(e.target); io.unobserve(e.target); } }); }, { rootMargin: "300px" });
      discos.forEach(function (d) { io.observe(d); });
    } else discos.forEach(carga);
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
})();
