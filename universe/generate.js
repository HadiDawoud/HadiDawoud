#!/usr/bin/env node
// Generates the banner SVG. No deps.
//   node generate.js [seed] [outfile]
// Numbers live in config.js; the math is here.
'use strict';
const fs = require('fs'), path = require('path');
const C = require('./config');

const seed = process.argv[2] !== undefined ? Number(process.argv[2]) : C.seed;
const outPath = process.argv[3] || path.join(__dirname, 'banner.svg');
const { width: W, height: H, palette: P } = C;
const TAU = Math.PI * 2;
const { x: CX, y: CY } = C.center;

// --- helpers ---
function mulberry32(a) {                      // same seed => same picture
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hashStr = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const stream = name => mulberry32((seed ^ hashStr(name)) >>> 0);   // one rng per feature so they don't stomp each other
const f = n => { const s = n.toFixed(1); return s.endsWith('.0') ? s.slice(0, -2) : s; };
const col = k => P[k] || k;
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = v => '#' + v.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
// blend near->far by depth z
const lerp = (near, far, z) => (1 - z) * near + z * far;
const mixHex = (near, far, z) => { const a = hex2rgb(near), b = hex2rgb(far); return rgb2hex(a.map((c, i) => lerp(c, b[i], z))); };

// turn a few points into a smooth path (Catmull-Rom -> cubic beziers)
function smooth(Pt, closed = false) {
  const n = Pt.length, at = i => closed ? Pt[(i + n) % n] : Pt[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(Pt[0][0])} ${f(Pt[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
         `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}
const poly = Pt => 'M' + Pt.map(p => `${f(p[0])} ${f(p[1])}`).join('L');
const defs = [], layers = [];
const add = s => layers.push(s);

// sky + glow defs
defs.push(`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.skyTop}"/><stop offset=".6" stop-color="${P.skyMid}"/><stop offset="1" stop-color="${P.skyLow}"/></linearGradient>`);
defs.push(`<radialGradient id="halo"><stop offset="0" stop-color="#fff4d8" stop-opacity=".9"/><stop offset=".07" stop-color="${P.ivory}" stop-opacity=".5"/><stop offset=".22" stop-color="${P.gold}" stop-opacity=".15"/><stop offset=".55" stop-color="#3b6f8f" stop-opacity=".06"/><stop offset="1" stop-color="#3b6f8f" stop-opacity="0"/></radialGradient>`);
defs.push(`<radialGradient id="starHalo"><stop offset="0" stop-color="${P.ivory}" stop-opacity=".35"/><stop offset="1" stop-color="${P.ivory}" stop-opacity="0"/></radialGradient>`);
defs.push(`<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="${P.skyTop}" stop-opacity="0"/><stop offset="1" stop-color="${P.skyTop}" stop-opacity=".85"/></radialGradient>`);
defs.push(`<filter id="blur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="3.2"/></filter>`);
add(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);

// stars + a couple of constellations
const S = C.stars, pl = C.planet, sr = stream('stars');
let stars = [];
for (let i = 0; i < S.count; i++) {
  const x = sr() * W, y = Math.pow(sr(), S.yBias) * H * S.maxY;
  const r = S.rMin + (S.rMax - S.rMin) * Math.pow(sr(), 4), o = 0.25 + 0.65 * sr();
  if (Math.hypot(x - CX, y - CY) < S.clearR) continue;
  if (Math.abs(x - pl.x) < pl.R * 2.6 && Math.abs(y - pl.y) < pl.R * 1.5) continue;
  stars.push({ x, y, r, o });
}
const lines = [];
const R4 = stream('starshape');
C.constellations.forEach(con => {
  const picked = [];
  con.anchors.forEach(([ax, ay]) => {                         // grab the closest unused star to each anchor
    let best = null, bd = 1e9;
    stars.forEach(s => { if (s.sel) return; const d = Math.hypot(s.x - ax, s.y - ay); if (d < bd) { bd = d; best = s; } });
    best.sel = { m: con.m, q: con.q, R: 4.5 + 4 * R4(), phi: -Math.PI / 2 + 0.2 * (R4() - .5) };
    picked.push(best);
  });
  for (let i = 0; i < picked.length - 1; i++) {                // connect them, stop short of the tips
    const A = picked[i], B = picked[i + 1], d = Math.hypot(B.x - A.x, B.y - A.y), ux = (B.x - A.x) / d, uy = (B.y - A.y) / d;
    const a = A.sel.R + 3, b = B.sel.R + 3;
    lines.push(`M${f(A.x + ux * a)} ${f(A.y + uy * a)}L${f(B.x - ux * b)} ${f(B.y - uy * b)}`);
  }
});
[[0.3, .3], [0.5, .5], [0.7, .7], [0.9, .9]].forEach(([lo, op], bi) => {
  const grp = stars.filter(s => !s.sel && s.o >= lo - 0.05 && s.o < lo + 0.15 + (bi === 3 ? 1 : 0));
  add(`<g fill="${P.ivory}" fill-opacity="${op}">${grp.map(s => `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}"/>`).join('')}</g>`);
});
// pointed star: alternate outer/inner radius, then walk around the circle
const starPoly = (cx, cy, R, q, m, phi) => Array.from({ length: 2 * m }, (_, i) => {
  const r = i % 2 === 0 ? R : q * R, a = TAU * i / (2 * m) + phi; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; }).join(' ');
add(`<path d="${lines.join('')}" fill="none" stroke="${P.silver}" stroke-opacity=".38" stroke-width=".6"/>`);
add(stars.filter(s => s.sel).map(s => `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.sel.R * 2.6)}" fill="url(#starHalo)"/><polygon points="${starPoly(s.x, s.y, s.sel.R, s.sel.q, s.sel.m, s.sel.phi)}" fill="${P.ivory}" fill-opacity=".92"/>`).join(''));

// little drift streaks (follow a vector field with RK4)
const FD = C.field, fr = stream('field');
const Fhat = (x, y) => { const u = -Math.sin(FD.omega * y), v = Math.sin(FD.omega * x), n = Math.hypot(u, v) + 1e-9; return [u / n, v / n]; };
function rk4(p, h) {
  const k1 = Fhat(p[0], p[1]), k2 = Fhat(p[0] + h / 2 * k1[0], p[1] + h / 2 * k1[1]),
        k3 = Fhat(p[0] + h / 2 * k2[0], p[1] + h / 2 * k2[1]), k4 = Fhat(p[0] + h * k3[0], p[1] + h * k3[1]);
  return [p[0] + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), p[1] + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
}
let fieldSvg = '';
for (let i = 0; i < FD.particles; i++) {
  const [x0, y0, x1, y1] = FD.region, s = [x0 + fr() * (x1 - x0), y0 + fr() * (y1 - y0)];
  if (Math.hypot(s[0] - CX, s[1] - CY) < FD.clearCenter) continue;
  if (Math.hypot(s[0] - pl.x, s[1] - pl.y) < pl.R * 1.4) continue;
  let p = s; const tr = [p];
  for (let k = 0; k < FD.steps; k++) { p = rk4(p, FD.h); if (k % 4 === 3) tr.push(p); }
  const n = tr.length, cuts = [0, Math.floor(n / 3), Math.floor(2 * n / 3), n - 1];
  [0.35, 0.7, 1].forEach((m, j) => {                       // fade the trail in toward the tip
    fieldSvg += `<path d="${smooth(tr.slice(cuts[j], cuts[j + 1] + 1))}" stroke-opacity="${f(FD.op * m)}"/>`; });
}
add(`<g fill="none" stroke="${P.teal}" stroke-width=".7" stroke-linecap="round">${fieldSvg}</g>`);

// light trails (short Fourier series)
const TR = C.trails;
const fourier = (c, t, scale = 1) => {
  let x = c.a0, y = 0;
  c.ax.forEach((a, k) => x += a * Math.cos((k + 1) * t)); c.bx.forEach((b, k) => x += b * Math.sin((k + 1) * t));
  c.cy.forEach((a, k) => y += a * Math.cos((k + 1) * t)); c.dy.forEach((b, k) => y += b * Math.sin((k + 1) * t));
  return [x, c.c0 + scale * y];
};
let trailSvg = '', glowSvg = '';
TR.open.forEach((c, ti) => {
  defs.push(`<linearGradient id="tg${ti}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${col(c.c)}" stop-opacity="0"/><stop offset=".22" stop-color="${col(c.c)}" stop-opacity=".6"/><stop offset=".5" stop-color="${col(c.c)}" stop-opacity="1"/><stop offset=".78" stop-color="${col(c.c)}" stop-opacity=".6"/><stop offset="1" stop-color="${col(c.c)}" stop-opacity="0"/></linearGradient>`);
  const mid = (TR.strands - 1) / 2;
  for (let s = 0; s < TR.strands; s++) {
    const sc = 1 + TR.eps * (s - mid), pts = [];
    for (let i = 0; i <= TR.samples; i++) pts.push(fourier(c, Math.PI * i / TR.samples, sc));
    const d = smooth(pts), o = c.op * (1 - 0.65 * Math.abs(s - mid) / mid);
    trailSvg += `<path d="${d}" stroke="url(#tg${ti})" stroke-opacity="${f(o * 100) / 100}" stroke-width="${s === mid ? .9 : .5}"/>`;
    if (s === mid) glowSvg += `<path d="${d}" stroke="url(#tg${ti})" stroke-opacity="${c.op * .55}" stroke-width="5"/>`;
  }
});
add(`<g fill="none" filter="url(#blur)">${glowSvg}</g><g fill="none" stroke-linecap="round">${trailSvg}</g>`);
{ const L = TR.loop, pts = []; for (let i = 0; i < L.samples; i++) pts.push(fourier(L, TAU * i / L.samples));
  add(`<path d="${smooth(pts, true)}" fill="none" stroke="${P.gold}" stroke-opacity="${L.op}" stroke-width=".6"/>`); }

// orbits around the pearl (kepler ellipse, tilted, then flattened to 2d)
function orbitPt(cx, cy, a, e, tilt, alpha, t) {
  const b = a * Math.sqrt(1 - e * e), X = a * Math.cos(t) - a * e, Y = b * Math.sin(t);
  const x = X, y = Y * Math.cos(tilt), z = Y * Math.sin(tilt), ca = Math.cos(alpha), sa = Math.sin(alpha);
  return [cx + x * ca - y * sa, cy + x * sa + y * ca, z];
}
// draw as a plain ellipse; clip so the far half sits behind the pearl
const deg = r => f(r * 180 / Math.PI);
const clipHalf = (id, cx, cy, alpha, front) => defs.push(`<clipPath id="${id}"><rect x="-3000" y="${front ? 0 : -3000}" width="6000" height="3000" transform="translate(${f(cx)} ${f(cy)}) rotate(${deg(alpha)})"/></clipPath>`);
const ellipseEl = (cx, cy, a, e, tilt, alpha) => {
  const b = a * Math.sqrt(1 - e * e), x0 = cx - a * e * Math.cos(alpha), y0 = cy - a * e * Math.sin(alpha);
  return `<ellipse cx="${f(x0)}" cy="${f(y0)}" rx="${f(a)}" ry="${f(b * Math.cos(tilt))}" transform="rotate(${deg(alpha)} ${f(x0)} ${f(y0)})"/>`; };
let oBack = '', oFront = '';
C.orbits.forEach((o, i) => {
  const st = `stroke="${col(o.c)}" stroke-width="${o.w}"`, el = ellipseEl(CX, CY, o.a, o.e, o.tilt, o.alpha);
  clipHalf('ob' + i, CX, CY, o.alpha, false); clipHalf('of' + i, CX, CY, o.alpha, true);
  oBack  += `<g clip-path="url(#ob${i})" ${st} stroke-opacity="${o.op * .45}">${el}</g>`;
  oFront += `<g clip-path="url(#of${i})" ${st} stroke-opacity="${o.op}">${el}</g>`;
  o.dots.forEach(t => { const p = orbitPt(CX, CY, o.a, o.e, o.tilt, o.alpha, t), front = Math.sin(t) > 0;
    (front ? (s => oFront += s) : (s => oBack += s))(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.2" fill="${col(o.c)}" stroke="none" fill-opacity="${front ? 1 : .55}"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="6" fill="${col(o.c)}" stroke="none" fill-opacity="${front ? .14 : .06}"/>`); });
});
add(`<g fill="none" stroke-linecap="round">${oBack}</g>`);                    // orbits behind the pearl

// the pearl - glow, rings, wavy shells, flares
const PE = C.pearl, CI = PE.circles;
add(`<circle cx="${CX}" cy="${CY}" r="${PE.haloR}" fill="url(#halo)"/>`);
let circ = '';
for (let j = 0; j <= CI.count; j++) {
  const R = CI.R0 + (CI.Rmax - CI.R0) * Math.pow(j / CI.count, CI.p);
  const op = CI.op0 * Math.exp(-(R - CI.R0) / CI.lambda) * (0.6 + 0.4 * Math.cos(TAU * j / CI.period));
  circ += `<circle r="${f(R)}" stroke-opacity="${f(op * 100) / 100}"/>`;
}
add(`<g transform="translate(${CX} ${CY})" fill="none" stroke="${P.ivory}" stroke-width="${CI.width}">${circ}</g>`);
let waves = '';
PE.waves.forEach(w => {                                      // squiggly closed curves around the center
  const N = Math.max(72, 12 * w.n), pts = [];
  for (let i = 0; i < N; i++) { const th = TAU * i / N, r = w.r0 + w.a * Math.sin(w.n * th + w.phi);
    pts.push([CX + r * Math.cos(th), CY + r * Math.sin(th)]); }
  waves += `<path d="${smooth(pts, true)}" stroke="${col(w.c)}" stroke-opacity="${w.op}"/>`;
});
add(`<g fill="none" stroke-width=".7">${waves}</g>`);
PE.flares.forEach(fl => add(`<polygon points="${starPoly(CX, CY, fl.R, fl.q, fl.m, fl.phi)}" fill="${P.ivory}" fill-opacity=".55"/>`));
add(`<circle cx="${CX}" cy="${CY}" r="${PE.ringR}" fill="none" stroke="${P.ivory}" stroke-opacity=".6" stroke-width=".8"/><circle cx="${CX}" cy="${CY}" r="${PE.coreR}" fill="#fff6dc"/>`);
add(`<g fill="none" stroke-linecap="round">${oFront}</g>`);                  // orbits in front

// planet + rings (back half, body, front half)
const RG = pl.rings, ca = Math.cos(pl.ringAlpha), sa = Math.sin(pl.ringAlpha);
const ringOp = u => (0.12 + 0.5 * Math.pow(0.5 + 0.5 * Math.sin(TAU * RG.freq * u + RG.phase), 2)) * (1 - Math.exp(-Math.pow((u - RG.gapAt) / RG.gapW, 2)));
let rBack = '', rFront = '';
clipHalf('rb', pl.x, pl.y, pl.ringAlpha, false); clipHalf('rf', pl.x, pl.y, pl.ringAlpha, true);
for (let i = 0; i < RG.count; i++) {
  const u = i / (RG.count - 1), a = pl.R * (RG.inner + (RG.outer - RG.inner) * u), op = ringOp(u);
  if (op < 0.03) continue;
  const el = ellipseEl(pl.x, pl.y, a, 0, pl.ringTilt, pl.ringAlpha).replace('/>', ` fill="none"/>`);
  rBack  += el.replace('/>', ` stroke-opacity="${f(op * .5 * 100) / 100}"/>`);
  rFront += el.replace('/>', ` stroke-opacity="${f(op * 100) / 100}"/>`);
}
add(`<g clip-path="url(#rb)" stroke="${P.ivory}" stroke-width=".7">${rBack}</g>`);
defs.push(`<radialGradient id="planet" cx=".3" cy=".42" r=".85" fx=".2" fy=".4"><stop offset="0" stop-color="#cfc9b6"/><stop offset=".35" stop-color="#6d7488"/><stop offset=".7" stop-color="#1a2238"/><stop offset="1" stop-color="#05080f"/></radialGradient>`);
add(`<circle cx="${pl.x}" cy="${pl.y}" r="${pl.R}" fill="url(#planet)"/>`);
{ const elev = Math.asin(Math.cos(pl.ringTilt)); let lat = '';        // faint latitude lines on the disc
  pl.latitudes.forEach(phiDeg => { const ph = phiDeg * Math.PI / 180, rx = pl.R * Math.cos(ph), yc = -pl.R * Math.sin(ph) * Math.cos(elev), pts = [];
    for (let k = 0; k <= 20; k++) { const t = Math.PI * k / 20, x = rx * Math.cos(t), y = yc + rx * Math.sin(elev) * Math.sin(t);
      pts.push([pl.x + x * ca - y * sa, pl.y + x * sa + y * ca]); }
    lat += `<path d="${smooth(pts)}"/>`; });
  add(`<g fill="none" stroke="#dfe5f2" stroke-opacity=".2" stroke-width=".5">${lat}</g>`); }
add(`<g clip-path="url(#rf)" stroke="${P.ivory}" stroke-width=".7">${rFront}</g>`);

// mountain ridges (stacked, far -> near)
const MT = C.mountains, mr = stream('mountains');
function makeRidge(L) {
  const T = [];
  for (let k = 0; k < L.N; k++) { const w = L.w0 * Math.pow(MT.g, k), a = L.A * Math.pow(MT.g, -k * MT.beta);
    T.push({ w, a, ph: mr() * TAU, b: 0.55 * a, nu: 1.31 * w, ps: mr() * TAU, rho: k < 2 ? L.ridged : 0 }); }
  return x => { let y = L.c + L.V * Math.exp(-Math.pow((x - MT.valleyX) / MT.valleySigma, 2));
    for (const t of T) { const s = Math.sin(t.w * x + t.ph);
      y += t.a * ((1 - t.rho) * s + t.rho * (Math.abs(s) - 2 / Math.PI)) + t.b * Math.cos(t.nu * x + t.ps); }
    return y; };
}
const ridges = MT.layers.map(L => makeRidge(L));
MT.layers.forEach((L, i) => {
  const y = ridges[i], z = L.z, pts = [], zc = Math.pow(z, .8);
  for (let x = -6; x <= W + 6; x += MT.step) pts.push([x, y(x)]);
  const top = pts.map(p => `${f(p[0])} ${f(p[1])}`).join('L');
  const ft = L.foreground ? P.foreground : mixHex(P.mtnNearTop, P.mtnFarTop, zc), fb = L.foreground ? P.foreground : mixHex(P.mtnNearBot, P.mtnFarBot, zc);
  const ro = lerp(0.55, 0.30, z), rc = mixHex(P.ivory, P.silver, z), sw = lerp(1.0, 0.5, z);
  defs.push(`<linearGradient id="mf${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ft}"/><stop offset="1" stop-color="${fb}"/></linearGradient>` +
            `<linearGradient id="mr${i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${rc}" stop-opacity="${f(ro * .45 * 100) / 100}"/><stop offset=".5" stop-color="${i < 3 ? P.gold : rc}" stop-opacity="${Math.min(1, ro * 1.6)}"/><stop offset="1" stop-color="${rc}" stop-opacity="${f(ro * .45 * 100) / 100}"/></linearGradient>`);
  add(`<path d="M${top}L${W + 6} ${H + 10}L-6 ${H + 10}Z" fill="url(#mf${i})" stroke="url(#mr${i})" stroke-width="${sw}"/>`);
  let cont = '';                                             // contour hatching under the ridge
  for (let j = 1; j <= L.contours; j++) { const q = [];
    for (let x = -6; x <= W + 6; x += MT.step) q.push(`${f(x)} ${f(y(x - j * 9) + j * L.cstep)}`);
    cont += `<path d="M${q.join('L')}" stroke-opacity="${f(0.34 * (1 - j / (L.contours + 1)) * (1 - 0.5 * z) * 100) / 100}"/>`; }
  if (cont) add(`<g fill="none" stroke="${P.teal}" stroke-width=".5">${cont}</g>`);
});
const ground = ridges[ridges.length - 1];

// trees up front (branchy recursive ones + simple pine silhouettes)
const T = C.trees, tr2 = stream('trees');
let treeSvg = '';
T.list.forEach(t => {
  const seg = {};
  (function rec(x, y, ang, l, d) {                          // recurse: step forward, then branch left/right
    if (d === 0) return;
    const x2 = x + l * Math.cos(ang), y2 = y + l * Math.sin(ang);
    (seg[d] = seg[d] || []).push(`M${f(x)} ${f(y)}L${f(x2)} ${f(y2)}`);
    for (const s of [-1, 1]) rec(x2, y2, ang + s * T.spread * (1 + T.jitter * (tr2() - .5) * 2), l * T.shrink * (1 + .12 * (tr2() - .5)), d - 1);
    if (d > 2 && tr2() < T.third) rec(x2, y2, ang + T.jitter * (tr2() - .5), l * T.shrink * .9, d - 1);
  })(t.x, ground(t.x) + 3, -Math.PI / 2 + (tr2() - .5) * .15, t.len, t.depth);
  Object.keys(seg).forEach(d => treeSvg += `<path d="${seg[d].join('')}" stroke-width="${f(T.w0 * Math.pow(T.wShrink, t.depth - d) * 10) / 10}"/>`);
});
add(`<g fill="none" stroke="${P.foreground}" stroke-linecap="round">${treeSvg}</g>`);
const CF = C.conifers, cr = stream('conifers');
let conif = '';
CF.xs.forEach(x => {
  const h = CF.hMin + (CF.hMax - CF.hMin) * cr(), bw = h * 0.34, yb = ground(x) + 4, n = CF.tiers, L = [];
  for (let i = 0; i < n; i++) { const yy = yb - h + (i + 1) * h / n, hw = bw * (i + 1) / n; L.push([x - hw, yy]); if (i < n - 1) L.push([x - hw * .5, yy]); }
  const Rr = L.map(p => [2 * x - p[0], p[1]]).reverse();
  conif += `<polygon points="${[[x, yb - h], ...L, [x - 2, yb + 6], [x + 2, yb + 6], ...Rr].map(p => f(p[0]) + ',' + f(p[1])).join(' ')}"/>`;
});
add(`<g fill="${P.foreground}">${conif}</g>`);
add(`<rect width="${W}" height="${H}" fill="url(#vig)"/>`);

// stitch it together and write out
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="A universe written in mathematics: a luminous pearl, ringed planet, layered ridges and constellations, all generated from equations">
<title>A Universe Written in Mathematics</title>
<defs>${defs.join('')}</defs>
${layers.join('\n')}
</svg>`;
fs.writeFileSync(outPath, svg);
console.log(`wrote ${outPath} (${(svg.length / 1024).toFixed(1)} KiB, seed ${seed})`);
