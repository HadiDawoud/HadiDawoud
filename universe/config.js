// Scene knobs only - no drawing math in here.
// Canvas is 1600x400; angles are radians.
module.exports = {
  seed: 314159,                       // change this to reshuffle the random bits
  width: 1600,
  height: 400,

  palette: {
    skyTop: '#02030a', skyMid: '#06102a', skyLow: '#0e2147',
    ivory: '#efe8d6', silver: '#aeb9cc', gold: '#c8a45e', teal: '#58b0aa',
    // mountain colors at near / far depth
    mtnNearTop: '#0b1326', mtnNearBot: '#02040b',
    mtnFarTop:  '#233b61', mtnFarBot:  '#0c1a38',
    foreground: '#010207',
  },

  center: { x: 800, y: 166 },         // where the pearl sits

  // pearl in the middle
  pearl: {
    haloR: 250, coreR: 5.5, ringR: 10,
    // wavy shells - keep n as an integer so they close cleanly
    waves: [
      { r0: 30,  a: 3.0, n: 5,  phi: 0.0, op: 0.70, c: 'ivory' },
      { r0: 42,  a: 4.5, n: 8,  phi: 0.6, op: 0.62, c: 'gold'  },
      { r0: 55,  a: 6.0, n: 6,  phi: 1.9, op: 0.55, c: 'ivory' },
      { r0: 68,  a: 7.0, n: 11, phi: 0.3, op: 0.48, c: 'teal'  },
      { r0: 80,  a: 9.0, n: 7,  phi: 2.7, op: 0.42, c: 'ivory' },
      { r0: 92,  a: 8.0, n: 13, phi: 1.2, op: 0.36, c: 'gold'  },
      { r0: 104, a: 10,  n: 9,  phi: 0.9, op: 0.30, c: 'ivory' },
      { r0: 118, a: 7.0, n: 15, phi: 2.2, op: 0.24, c: 'teal'  },
      { r0: 132, a: 6.0, n: 10, phi: 0.1, op: 0.18, c: 'ivory' },
    ],
    // nested circles fading outward
    circles: { count: 38, R0: 16, Rmax: 215, p: 1.35, op0: 0.9, lambda: 70, period: 7, width: 0.55 },
    // little lens-flare crosses
    flares: [ { m: 4, R: 74, q: 0.055, phi: 0 }, { m: 4, R: 40, q: 0.07, phi: Math.PI / 4 } ],
  },

  // orbits - pearl is at a focus
  // a = size, e = how oval, tilt = how flat, alpha = spin on screen
  orbits: [
    { a: 300, e: 0.55, tilt: 1.25, alpha: -0.12,        w: 0.8, op: 0.55, c: 'ivory', dots: [0.9, 4.1] },
    { a: 430, e: 0.60, tilt: 1.35, alpha:  0.06,        w: 0.7, op: 0.45, c: 'gold',  dots: [2.2] },
    { a: 520, e: 0.70, tilt: 1.42, alpha: Math.PI-0.05, w: 0.7, op: 0.42, c: 'silver',dots: [0.5, 3.6] },
    { a: 210, e: 0.35, tilt: 0.95, alpha:  0.50,        w: 0.6, op: 0.40, c: 'teal',  dots: [5.2] },
    { a: 340, e: 0.60, tilt: 1.10, alpha: -0.55,        w: 0.6, op: 0.35, c: 'ivory', dots: [1.6] },
  ],

  // ringed planet off to the right
  planet: {
    x: 1240, y: 188, R: 54,
    ringTilt: 1.30, ringAlpha: -0.20,
    rings: { count: 30, inner: 1.38, outer: 2.40, gapAt: 0.56, gapW: 0.03, freq: 3.2, phase: 0.8 },
    latitudes: [-60, -40, -20, 0, 20, 40, 60],
  },

  // mountains - z goes from 1 (far) to 0 (near)
  mountains: {
    g: 1.68, beta: 1.0, step: 6, valleyX: 800, valleySigma: 230,
    layers: [
      { z: 1.00, c: 236, A: 24, w0: 0.0042, N: 6, ridged: 0.30, V: 26, contours: 0, cstep: 0 },
      { z: 0.83, c: 252, A: 34, w0: 0.0058, N: 5, ridged: 0.80, V: 20, contours: 2, cstep: 7 },
      { z: 0.66, c: 268, A: 38, w0: 0.0072, N: 5, ridged: 0.85, V: 14, contours: 3, cstep: 6 },
      { z: 0.48, c: 290, A: 32, w0: 0.0095, N: 5, ridged: 0.80, V: 10, contours: 3, cstep: 5 },
      { z: 0.30, c: 312, A: 26, w0: 0.0110, N: 4, ridged: 0.65, V: 6,  contours: 3, cstep: 5 },
      { z: 0.14, c: 332, A: 20, w0: 0.0135, N: 4, ridged: 0.45, V: 0,  contours: 2, cstep: 4 },
      { z: 0.00, c: 354, A: 14, w0: 0.0155, N: 4, ridged: 0.00, V: 0,  contours: 0, cstep: 0, foreground: true },
    ],
  },

  // the glowing arcs across the sky
  trails: {
    strands: 7, eps: 0.14, samples: 40,
    open: [   // strands meet at the ends
      { a0: 800, c0: 96,  ax: [800],  bx: [0, 40],  cy: [], dy: [-50, 30, -12],  op: 0.6, c: 'ivory' },
      { a0: 800, c0: 232, ax: [820],  bx: [0, -30], cy: [], dy: [-26, -22, 8],  op: 0.65, c: 'gold'  },
      { a0: 800, c0: 132, ax: [-720], bx: [0, 24],  cy: [], dy: [30, -18, 7],   op: 0.45, c: 'teal'  },
    ],
    loop: { a0: 800, c0: 162, ax: [330, 0, 40, 0, 0], bx: [0, 0, 0, 0, -22],
            cy: [0, 0, 0, 0, 10], dy: [78, 0, 16, 0, 0], op: 0.22, samples: 140 },
  },

  // background drift particles
  field: { omega: 0.015, particles: 46, h: 2.4, steps: 54, region: [20, 15, 1580, 235],
           clearCenter: 95, op: 0.34 },

  // stars + constellation anchors
  stars: { count: 260, yBias: 1.25, maxY: 0.70, rMin: 0.35, rMax: 1.5, clearR: 120 },
  constellations: [
    { m: 4, q: 0.32, anchors: [[230,52],[330,96],[418,66],[480,128],[575,98],[612,160]] },
    { m: 5, q: 0.42, anchors: [[1330,44],[1412,92],[1488,58],[1540,112]] },
  ],

  // trees along the front edge
  trees: { list: [ { x: 92, len: 38, depth: 7 }, { x: 214, len: 28, depth: 6 },
                   { x: 1392, len: 34, depth: 7 }, { x: 1512, len: 42, depth: 7 } ],
           spread: 0.42, shrink: 0.74, jitter: 0.35, third: 0.30, w0: 3.2, wShrink: 0.64 },
  conifers: { xs: [38, 150, 290, 352, 1262, 1334, 1452, 1562], hMin: 26, hMax: 58, tiers: 4 },
};
