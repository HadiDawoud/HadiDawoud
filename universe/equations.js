// equations.js — renders the key equations as ONE tight row on a white background.
// The SVG canvas is cropped to the content, so GitHub scales the row to the full README
// column width (the biggest possible text for a single line).
//   cd universe && npm i mathjax-full   (one-time)   then:   node equations.js ../assets/equations.svg
//   Ship with --compact (drops F=(...)) so the four glyphs stay as large as possible:
//   node equations.js ../assets/equations.svg --compact
'use strict';
const fs = require('fs'), path = require('path');
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

const COMPACT = process.argv.includes('--compact');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const out = args[0] || path.join(__dirname, '..', 'assets', 'equations.svg');
// GAP/PAD shrink the canvas so GitHub's width=100% scale makes the glyphs larger
const K = 10, GAP = 8, PAD_X = 4, PAD_Y = 4, INK = '#1f2328';   // K = px per ex; layout is scale-free

const EQS = [
  String.raw`r(\theta)=r_0+a\sin(n\theta+\phi)`,
  // modest size bump only — no stroke faux-bold (that looked way too heavy)
  String.raw`y(x)=c+{\Large\sum}_{k}a_k\sin(\omega_kx+\phi_k)`,
  String.raw`x(t)=a_0+{\Large\sum}_{k}[a_k\cos kt+b_k\sin kt]`,
  // same italic math as the other equations
  COMPACT ? String.raw`\dot{p}=\hat{F}(p)`
          : String.raw`\dot{p}=\hat{F}(p),\ F=(-\sin\omega y,\sin\omega x)`,
];

const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: 'none' }) });
const eq = EQS.map(tex => {
  let s = adaptor.innerHTML(doc.convert(tex, { display: false })).replace(/currentColor/g, INK);
  // keep Σ a bit larger than body text; no extra stroke weight
  s = s.replace(/<g data-mml-node="mstyle" transform="scale\([^"]+\)">(\s*<g data-mml-node="mo">\s*<path data-c="2211")/g,
    `<g data-mml-node="mstyle" transform="scale(1.55)">$1`);
  return { s, w: parseFloat(/width="([\d.]+)ex"/.exec(s)[1]) * K, h: parseFloat(/height="([\d.]+)ex"/.exec(s)[1]) * K };
});
const W = Math.round(eq.reduce((t, e) => t + e.w, 0) + GAP * (eq.length - 1) + 2 * PAD_X);
const H = Math.round(Math.max(...eq.map(e => e.h)) + 2 * PAD_Y);
let body = '', x = PAD_X;
eq.forEach(e => {
  body += e.s.replace(/<svg [^>]*?viewBox="([^"]+)"[^>]*>/, (_, vb) =>
    `<svg x="${x.toFixed(1)}" y="${((H - e.h) / 2).toFixed(1)}" width="${e.w.toFixed(1)}" height="${e.h.toFixed(1)}" viewBox="${vb}" overflow="visible">`);
  x += e.w + GAP;
});
fs.writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Key equations: polar wave, ridge sum, Fourier trail, vector field"><title>Key equations of the banner</title><rect width="${W}" height="${H}" fill="#ffffff"/>${body}</svg>`);
console.log(`wrote ${out}  canvas ${W}x${H}  (at 880px README width: ${(880 / W * K * 2).toFixed(1)}px font, was ~${(880 / 1600 * 10.94 * 2).toFixed(1)}px)`);
