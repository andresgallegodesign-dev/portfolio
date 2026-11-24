#!/usr/bin/env python3
# Copia el sitio a prev/ para la vista previa (fuentes de Google en lugar de Fontshare; index.html como fragmento).
import re, shutil, os, glob
import sys
SRC=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # raíz del repo
P=sys.argv[1] if len(sys.argv)>1 else "/tmp/portfolio-preview"  # carpeta de salida (por defecto /tmp/portfolio-preview)
GF='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap">'
def fix(s):
    s=re.sub(r'\n<link rel="stylesheet" href="https://api.fontshare.com/v2/css\?f\[\]=cabinet-grotesk[^>]*>','',s)
    s=s.replace('<link rel="preconnect" href="https://api.fontshare.com">\n','')
    return re.sub(r'<link rel="stylesheet" href="https://api.fontshare.com[^>]*>',GF,s)
os.makedirs(P+"/en",exist_ok=True)
for f in glob.glob(SRC+"/*.html")+glob.glob(SRC+"/en/*.html"):
    rel=os.path.relpath(f,SRC); s=fix(open(f).read())
    if rel=="index.html":
        s=re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset[^>]*>\s*<meta name="viewport"[^>]*>\s*','',s)
        s=re.sub(r'<meta name="description"[^>]*>\s*','',s); s=s.replace('</head>\n<body>\n','').replace('</body>\n</html>\n','')
    open(P+"/"+rel,"w").write(s)
css=open(SRC+"/assets/css/style.css").read()
os.makedirs(P+"/assets/css",exist_ok=True); open(P+"/assets/css/style.css","w").write(css)
for sub in ("js","img","data"):
    shutil.copytree(SRC+"/assets/"+sub,P+"/assets/"+sub,dirs_exist_ok=True,ignore=shutil.ignore_patterns("originales"))
print("preview ok")
