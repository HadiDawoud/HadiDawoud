// equations.js — renders the key equations as ONE tight row on a white background.
// The SVG canvas is cropped to the content, so GitHub scales the row to the full README
// column width (the biggest possible text for a single line).
//   cd universe && npm i mathjax-full   (one-time)   then:   node equations.js ../assets/equations.svg
//   add --compact to drop the field definition F=(...) for ~20% larger text
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
const K = 10, GAP = 28, PAD_X = 14, PAD_Y = 12, INK = '#1f2328';   // K = px per ex; layout is scale-free

const EQS = [
  String.raw`r(\theta)=r_0+a\sin(n\theta+\phi)`,
  String.raw`y(x)=c+\sum_{k}a_k\sin(\omega_kx+\phi_k)`,
  String.raw`x(t)=a_0+\sum_{k}[a_k\cos kt+b_k\sin kt]`,
  COMPACT ? String.raw`\dot{\mathbf p}=\hat{\mathbf F}(\mathbf p)`
          : String.raw`\dot{\mathbf p}=\hat{\mathbf F}(\mathbf p),\ \mathbf F=(-\sin\omega y,\sin\omega x)`,
];

const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: 'none' }) });
const eq = EQS.map(tex => {
  const s = adaptor.innerHTML(doc.convert(tex, { display: false })).replace(/currentColor/g, INK);
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
