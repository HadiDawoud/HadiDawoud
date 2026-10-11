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
const K = 10, PAD_X = 4, PAD_Y = 4, INK = '#1f2328';   // K = px per ex; layout is scale-free

// One MathJax convert = identical size/weight for every glyph (incl. \sum and ṗ=F̂(p))
const parts = [
  String.raw`r(\theta)=r_0+a\sin(n\theta+\phi)`,
  String.raw`y(x)=c+\sum_{k}a_k\sin(\omega_kx+\phi_k)`,
  String.raw`x(t)=a_0+\sum_{k}[a_k\cos kt+b_k\sin kt]`,
  COMPACT ? String.raw`\dot{p}=\hat{F}(p)`
          : String.raw`\dot{p}=\hat{F}(p),\ F=(-\sin\omega y,\sin\omega x)`,
];
const TEX = parts.join(String.raw`\quad`);

const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: 'none' }) });
let s = adaptor.innerHTML(doc.convert(TEX, { display: false })).replace(/currentColor/g, INK);
const w = parseFloat(/width="([\d.]+)ex"/.exec(s)[1]) * K;
const h = parseFloat(/height="([\d.]+)ex"/.exec(s)[1]) * K;
const W = Math.round(w + 2 * PAD_X);
const H = Math.round(h + 2 * PAD_Y);
s = s.replace(/<svg [^>]*?viewBox="([^"]+)"[^>]*>/, (_, vb) =>
  `<svg x="${PAD_X}" y="${PAD_Y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="${vb}" overflow="visible">`);
fs.writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Key equations: polar wave, ridge sum, Fourier trail, vector field"><title>Key equations of the banner</title><rect width="${W}" height="${H}" fill="#ffffff"/>${s}</svg>`);
console.log(`wrote ${out}  canvas ${W}x${H}  (at 880px README width: ${(880 / W * K * 2).toFixed(1)}px font, was ~${(880 / 1600 * 10.94 * 2).toFixed(1)}px)`);
