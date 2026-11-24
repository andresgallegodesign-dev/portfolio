#!/usr/bin/env python3
# Copia los datos de assets/data/discos.json dentro de assets/js/main.js (entre /*DISCOS_INICIO*/ y /*DISCOS_FIN*/),
# para que las portadas funcionen también abriendo la web con doble clic. Ejecutar tras tocar discos.json.
import json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(R, "assets/data/discos.json"), encoding="utf-8"))
p = os.path.join(R, "assets/js/main.js"); s = open(p, encoding="utf-8").read()
i = s.index("/*DISCOS_INICIO*/") + len("/*DISCOS_INICIO*/"); j = s.index("/*DISCOS_FIN*/")
open(p, "w", encoding="utf-8").write(s[:i] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + s[j:])
print("main.js actualizado con", len(d), "canciones")
