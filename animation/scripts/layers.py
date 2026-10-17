"""Cut the upscaled poster into animation layers.

Coordinates are in "poster space": the poster scaled to 1080x1640.
Layers are written at LAYER_SCALE x that size so camera pushes stay sharp.
"""
import sys, json
import numpy as np, cv2

src, outdir = sys.argv[1], sys.argv[2]
LAYER_SCALE = 1.5
PW, PH = 1080, 1640

hi = cv2.imread(src)  # BGR, 4x upscale
P = cv2.resize(hi, (PW, PH), interpolation=cv2.INTER_AREA).astype(np.float32)
L = cv2.resize(hi, (int(PW * LAYER_SCALE), int(PH * LAYER_SCALE)), interpolation=cv2.INTER_AREA)

BOXES = {
    'arch': (262, 52, 820, 1012),
    'garlandL': (28, 0, 252, 735),
    'garlandR': (828, 0, 1052, 735),
    'diyaL': (55, 1230, 225, 1605),
    'diyaR': (855, 1230, 1025, 1605),
}

# --- background model: cubic polynomial fit on magenta pixels outside objects
b, g, r = P[..., 0], P[..., 1], P[..., 2]
magenta = (g < 45) & (r > 120) & (b > 60) & (r > b)
excl = np.zeros_like(magenta)
for x0, y0, x1, y1 in BOXES.values():
    excl[y0:y1, x0:x1] = True
excl[:, :45] = excl[:, -45:] = True  # border lines
excl[:45, :] = excl[-45:, :] = True
ys, xs = np.nonzero(magenta & ~excl)
idx = np.random.default_rng(0).choice(len(xs), min(40000, len(xs)), replace=False)
xs, ys = xs[idx], ys[idx]

def feats(x, y):
    x = x / PW * 2 - 1
    y = y / PH * 2 - 1
    return np.stack([np.ones_like(x), x, y, x * x, x * y, y * y, x**3, x * x * y, x * y * y, y**3, x**4, y**4, x*x*y*y], -1)

A = feats(xs.astype(np.float64), ys.astype(np.float64))
coef = np.linalg.lstsq(A, P[ys, xs].astype(np.float64), rcond=None)[0]

def bg_at(w, h, yscale):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    return np.clip(feats(xx * PW / w, yy * yscale) @ coef, 0, 255)

bgP = bg_at(PW, PH, 1.0).astype(np.float32)
print('bg fit residual', np.abs(A @ coef - P[ys, xs]).mean())

# Full-frame background (1080x1920): stretch the model vertically, no extrapolation.
frame_bg = bg_at(1080, 1920, PH / 1920)
cv2.imwrite(f'{outdir}/bg.png', frame_bg.astype(np.uint8))

# --- per-layer alpha
dist = np.linalg.norm(P - bgP, axis=2)
meta = {}
for name, (x0, y0, x1, y1) in BOXES.items():
    d = dist[y0:y1, x0:x1]
    soft = np.clip((d - 22) / 40, 0, 1)
    hard = (d > 40).astype(np.uint8)
    hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    # fill enclosed holes (e.g. the pink sky inside the arch)
    h, w = hard.shape
    ff = np.pad(1 - hard, 1, constant_values=1).astype(np.uint8)
    mask = np.zeros((h + 4, w + 4), np.uint8)
    cv2.floodFill(ff, mask, (0, 0), 2)
    holes = (ff[1:-1, 1:-1] == 1).astype(np.float32)
    # keep only the largest connected parts so stray specks vanish
    alpha = np.maximum(soft, holes)
    if name != 'arch':
        # drop the poster's thin border lines: an opening deletes 2-4px strokes
        # but keeps flowers and lamps, which are far thicker
        body = cv2.morphologyEx(hard, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
        body = cv2.dilate(body, np.ones((9, 9), np.uint8)).astype(np.float32)
        alpha = alpha * cv2.GaussianBlur(body, (0, 0), 2)
        alpha[: max(0, 8 - y0)] = 0  # black letterbox edge above the poster
        # border strokes that hug the frame edge, clear of any flower or lamp
        xs_ = np.arange(x0, x1)
        alpha[:, (xs_ < 50) | (xs_ > 1030)] = 0
        alpha[max(0, 1594 - y0):] = 0
    if name == 'arch':
        alpha = np.maximum(alpha, cv2.erode(holes + hard, np.ones((3, 3))).clip(0, 1))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.8)
    s = LAYER_SCALE
    X0, Y0, X1, Y1 = int(x0 * s), int(y0 * s), int(x1 * s), int(y1 * s)
    rgb = L[Y0:Y1, X0:X1]
    a = cv2.resize(alpha, (X1 - X0, Y1 - Y0), interpolation=cv2.INTER_LINEAR)
    rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])
    cv2.imwrite(f'{outdir}/{name}.png', rgba)
    meta[name] = {'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0}

json.dump(meta, open(f'{outdir}/layers.json', 'w'), indent=1)
print(json.dumps(meta))
