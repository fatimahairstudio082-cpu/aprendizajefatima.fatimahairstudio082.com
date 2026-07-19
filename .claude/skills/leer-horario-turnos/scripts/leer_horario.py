#!/usr/bin/env python3
"""
Lee un cuadrante de turnos (una fila por persona, una columna por día) y extrae
los turnos de UNA fila leyendo el COLOR de cada celda — no la letra, porque los
días de libre/vacaciones suelen ir sin letra.

Uso:
    python3 leer_horario.py foto.jpg --mes 7 --ano 2026 --row-frac 0.64
    python3 leer_horario.py foto.jpg --mes 7 --ano 2026 --row-y 453
    python3 leer_horario.py foto.jpg                # lista las filas detectadas

Requiere Pillow:  pip install Pillow
"""
import argparse, calendar, sys

DIAS_SEM = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']  # weekday(): 0=lunes
TURNOS = ['manana', 'tarde', 'noche', 'libre', 'festivo']
ETIQ = {'manana': '☀️  Mañana', 'tarde': '🌤️  Tarde', 'noche': '🌙  Noche',
        'libre': '🟢  Libre', 'festivo': '🎉  Vacaciones'}


def lum(p):
    return (p[0] + p[1] + p[2]) / 3


def hue(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    df = mx - mn
    if df == 0:
        return 0.0
    if mx == r:
        h = 60 * (((g - b) / df) % 6)
    elif mx == g:
        h = 60 * (((b - r) / df) + 2)
    else:
        h = 60 * (((r - g) / df) + 4)
    return h + 360 if h < 0 else h


def clasificar(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    v = mx / 255
    s = 0 if mx == 0 else (mx - mn) / mx
    if v < 0.22 or s < 0.18:          # texto negro / celda sin color
        return None
    h = hue(r, g, b)
    if h < 20 or h >= 345:
        return 'festivo'              # rojo
    if h < 52:
        return 'noche'                # naranja/ámbar ~45°
    if h < 70:
        return 'manana'               # amarillo ~60°
    if h < 170:
        return 'libre'                # verde ~89°
    if 175 <= h < 260:
        return 'tarde'                # azul ~196°
    return None


def lineas_oscuras(px, W, H, vertical):
    """Devuelve las posiciones (agrupadas) de las líneas de rejilla."""
    if vertical:
        a0, a1 = int(H * 0.08), int(H * 0.95)   # recorre y
        lo, hi, largo = 0, W, a1 - a0
        def es_oscuro(i, y): return lum(px[i, y]) < 110
    else:
        a0, a1 = int(W * 0.02), int(W * 0.98)   # recorre x
        lo, hi, largo = 0, H, a1 - a0
        def es_oscuro(i, x): return lum(px[x, i]) < 110
    thr = (largo / 2) * 0.5
    lines, run = [], []
    for i in range(lo, hi):
        c = sum(1 for j in range(a0, a1, 2) if es_oscuro(i, j))
        if c >= thr:
            run.append(i)
        elif run:
            lines.append(round(sum(run) / len(run)))
            run = []
    if run:
        lines.append(round(sum(run) / len(run)))
    return lines


def centros_dia(vlines, dias_mes):
    if len(vlines) < min(dias_mes, 8):
        return None
    celdas = [(vlines[i], vlines[i + 1], vlines[i + 1] - vlines[i]) for i in range(len(vlines) - 1)]
    ws = sorted(c[2] for c in celdas)
    med = ws[len(ws) // 2]
    dias = [c for c in celdas if med * 0.6 < c[2] < med * 1.8]
    if len(dias) < dias_mes - 3:
        return None
    return [round((c[0] + c[1]) / 2) for c in dias[-dias_mes:]]


def color_celda(px, W, H, cx, cy, hw, hh):
    br = bg = bb = n = 0
    for y in range(cy - hh, cy + hh + 1, max(1, hh // 4)):
        for x in range(cx - hw, cx + hw + 1, max(1, hw // 4)):
            if 0 <= x < W and 0 <= y < H:
                r, g, b = px[x, y][:3]
                mx, mn = max(r, g, b), min(r, g, b)
                s = 0 if mx == 0 else (mx - mn) / mx
                if mx / 255 >= 0.22 and s >= 0.18:
                    br += r; bg += g; bb += b; n += 1
    return (br // n, bg // n, bb // n) if n else None


def main():
    ap = argparse.ArgumentParser(description="Lee turnos de un cuadrante por color de celda.")
    ap.add_argument("imagen")
    ap.add_argument("--mes", type=int, help="Mes 1-12 del cuadrante")
    ap.add_argument("--ano", type=int, help="Año del cuadrante")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--row-y", type=int, help="Y en píxeles del centro de tu fila")
    g.add_argument("--row-frac", type=float, help="Fracción 0..1 de la altura donde está tu fila")
    args = ap.parse_args()

    try:
        from PIL import Image
    except ImportError:
        sys.exit("Falta Pillow. Instala con:  pip install Pillow")

    im = Image.open(args.imagen).convert("RGB")
    W, H = im.size
    px = im.load()

    hlines = lineas_oscuras(px, W, H, vertical=False)

    if args.row_y is None and args.row_frac is None:
        print(f"Imagen {W}x{H}. Filas detectadas (bandas entre líneas horizontales):")
        for i in range(len(hlines) - 1):
            y0, y1 = hlines[i], hlines[i + 1]
            print(f"  banda {i:2d}: y {y0}-{y1}  (centro {round((y0+y1)/2)}, frac {round((y0+y1)/2/H,3)})")
        print("\nVuelve a llamar con --row-y <centro> o --row-frac <frac> de TU fila,\n"
              "y añade --mes y --ano.")
        return

    if args.mes is None or args.ano is None:
        sys.exit("Indica --mes (1-12) y --ano.")

    mes0 = args.mes - 1
    dias_mes = calendar.monthrange(args.ano, args.mes)[1]
    cols = centros_dia(lineas_oscuras(px, W, H, vertical=True), dias_mes)
    if not cols:
        sys.exit("No distingo la rejilla. Usa una foto recta y completa (que se vean todos los días).")

    yc = args.row_y if args.row_y is not None else int(args.row_frac * H)
    cellH = 20
    for i in range(len(hlines) - 1):
        if hlines[i] <= yc <= hlines[i + 1]:
            yc = round((hlines[i] + hlines[i + 1]) / 2)
            cellH = hlines[i + 1] - hlines[i]
            break

    pitch = (cols[1] - cols[0]) if len(cols) > 1 else 20
    hw = max(4, round(pitch * 0.32))
    hh = max(4, round(cellH * 0.32))

    grupos = {t: [] for t in TURNOS}
    leidos = 0
    for d in range(min(len(cols), dias_mes)):
        c = color_celda(px, W, H, cols[d], yc, hw, hh)
        t = clasificar(*c) if c else None
        if t:
            grupos[t].append(d + 1)
            leidos += 1

    import datetime
    print(f"\nHorario leído — {calendar.month_name[args.mes]} {args.ano}  "
          f"({leidos}/{dias_mes} días)")
    if leidos < dias_mes - 3:
        print("⚠️  Leí menos días de los que tiene el mes: revisa que la foto esté recta y "
              "completa, o ajusta --row-y / --row-frac a tu fila.")
    for t in TURNOS:
        ds = grupos[t]
        if not ds and t == 'festivo':
            continue
        etiquetas = ", ".join(f"{DIAS_SEM[datetime.date(args.ano, args.mes, d).weekday()]} {d}" for d in ds)
        print(f"  {ETIQ[t]:14} ({len(ds):2d}): {etiquetas or '—'}")


if __name__ == "__main__":
    main()
