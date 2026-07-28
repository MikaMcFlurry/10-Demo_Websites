/* WOLKENKAMM — Werkstatt für Marmorpapier (fiktive Demonstration)
 *
 * ENTWURFSVERTRAG
 * THESIS: Die erste Bildschirmseite ist ein wirklich gerechnetes Marmorierbad —
 *   jeder Besuch schöpft einen nummerierten Bogen, den es kein zweites Mal gibt.
 *   Verweigert wird das Kategorie-Übliche: Foto-Hero, Claim, zwei Knöpfe.
 * OWN-WORLD: Warmes Papier #F7F5EF, Tusche #11130F, Graugrün, rationiertes
 *   Krapp-Rosa #f9d9f7; Pflanzenfarben im Bad (Indigo, Krapp, Reseda, Grünspan,
 *   Ruß); Lexend Exa monumental, Familjen Grotesk als Text, Fragment Mono als
 *   Marginalie; Plakatplatte mit Papierrand, Hairlines, 16px-Radius.
 * STORY: Verstehen in einem Viewport: Hier wird marmoriert, jedes Blatt ist ein
 *   Unikat — und diese Website marmoriert wirklich, nachvollziehbar im Browser.
 *   Danach: selbst schöpfen (Marmorierbad), Muster lesen (Musterbuch).
 * FIRST VIEWPORT: Plakat: gerechnetes Bad als Fläche, darüber „KEIN / BOGEN /
 *   ZWEIMAL“, Marginalien in Mono (Bogennummer, Arbeitsschritte), unten die
 *   Aktionen „Neu schöpfen“ und „Zum Marmorierbad“.
 * FORM: Kinetic print poster (MXL-022) unter dem Interaktionsvertrag von
 *   MXL-040: Canvas nie einzige Navigation, Fallback-Poster, stiller Textpfad
 *   (Werkstattzettel), kein Scroll-Jacking, Reduced Motion ersetzt Choreografie
 *   durch den fertigen Bogen.
 *
 * TECHNIK — Mathematisches Marmorieren, ohne Abhängigkeit:
 *   Tropfen und Züge sind exakt invertierbare Abbildungen der Badebene
 *   (Verdrängungsmodell nach A. Jaffer, „Mathematical Marbling“). Gerendert
 *   wird rückwärts: für jedes Pixel werden die Arbeitsschritte in umgekehrter
 *   Reihenfolge zurückgerechnet, bis ein Tropfen trifft — per WebGL-Fragment-
 *   Shader, mit identischer Mathematik als 2D-Canvas-Fallback.
 */
(() => {
  'use strict';

  /* ── Zufall (deterministisch je Saat) ──────────────────────────────── */

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── Farben der Werkstatt (identisch mit den Mustern im CSS) ───────── */

  const GRUND = [0.925, 0.902, 0.831];            // Kleistergrund  #ECE6D4
  const FARBEN = [
    { name: 'Indigo',    hex: '#2E4076', rgb: [0.180, 0.251, 0.463] },
    { name: 'Krapprosa', hex: '#D2799F', rgb: [0.824, 0.475, 0.624] },
    { name: 'Reseda',    hex: '#D9B94A', rgb: [0.851, 0.725, 0.290] },
    { name: 'Grünspan',  hex: '#587F63', rgb: [0.345, 0.498, 0.388] },
    { name: 'Ruß',       hex: '#23241F', rgb: [0.137, 0.141, 0.122] }
  ];

  /* ── Arbeitsschritte (Ops) ─────────────────────────────────────────────
   * Koordinaten: y ∈ [0,1], x ∈ [0,aspect]. Alle Schritte sind exakt
   * invertierbar; „str“ ist die animierbare Stärke (0..1).
   *   tropfen: {k:0, x,y, r, c}                Farbtropfen, verdrängt das Bad
   *   kamm:    {k:1, x,y, th, al, la, s}       Zug in Richtung th; Zinken ‖ th,
   *                                            Abstand s (0 = einzelner Stift)
   *   schnecke:{k:2, x,y, ph, la}              Drehung um Zentrum, klingt ab
   *   welle:   {k:3, th, am, T, ph}            Scherwelle quer zur Richtung
   */

  const T_TROPFEN = 0, T_KAMM = 1, T_SCHNECKE = 2, T_WELLE = 3;

  function invers(q, op, str) {
    // Wendet den inversen Schritt auf den Punkt q = [x,y] an.
    // Rückgabe: Palettenindex (>= 0) wenn ein Tropfen trifft, sonst -1.
    if (op.k === T_TROPFEN) {
      const dx = q[0] - op.x, dy = q[1] - op.y;
      const d2 = dx * dx + dy * dy;
      const r = op.r * str;
      if (d2 <= r * r) return op.c;
      const f = Math.sqrt(1 - (r * r) / d2);
      q[0] = op.x + dx * f; q[1] = op.y + dy * f;
      return -1;
    }
    if (op.k === T_KAMM) {
      const mx = Math.cos(op.th), my = Math.sin(op.th);
      let d = -(q[0] - op.x) * my + (q[1] - op.y) * mx;   // Abstand quer zum Zug
      if (op.s > 0) {
        d = d - op.s * Math.round(d / op.s);              // nächster Zinken
      }
      const v = (op.al * str) * op.la / (op.la + Math.abs(d));
      q[0] -= mx * v; q[1] -= my * v;
      return -1;
    }
    if (op.k === T_SCHNECKE) {
      const dx = q[0] - op.x, dy = q[1] - op.y;
      const rho = Math.sqrt(dx * dx + dy * dy);
      const a = -(op.ph * str) * op.la / (op.la + rho);
      const c = Math.cos(a), s = Math.sin(a);
      q[0] = op.x + dx * c - dy * s; q[1] = op.y + dx * s + dy * c;
      return -1;
    }
    // Welle
    const mx = Math.cos(op.th), my = Math.sin(op.th);
    const l = q[0] * mx + q[1] * my;
    const v = (op.am * str) * Math.sin((Math.PI * 2 * l) / op.T + op.ph);
    q[0] -= -my * v; q[1] -= mx * v;
    return -1;
  }

  /* ── WebGL-Renderer ────────────────────────────────────────────────── */

  const VSH = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x,1.0-p.y);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}';

  function fragQuelle(MAX) {
    return `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform float uAspekt;
uniform int uAnzahl;
uniform vec4 uA[${MAX}];
uniform vec4 uB[${MAX}];
uniform vec3 uPal[6];
vec3 farbe(float w){
  if(w<0.5)return uPal[0];
  if(w<1.5)return uPal[1];
  if(w<2.5)return uPal[2];
  if(w<3.5)return uPal[3];
  if(w<4.5)return uPal[4];
  return uPal[5];
}
void main(){
  vec2 q=vec2(v.x*uAspekt,v.y);
  vec3 col=uPal[0]*0.0;
  bool hit=false;
  for(int i=${MAX - 1};i>=0;i--){
    if(i>=uAnzahl)continue;
    vec4 A=uA[i];vec4 B=uB[i];
    float k=B.z;
    if(k<0.5){
      vec2 d=q-A.xy;float d2=dot(d,d);float r=A.z;
      if(d2<=r*r){col=farbe(B.w);hit=true;break;}
      q=A.xy+d*sqrt(1.0-(r*r)/d2);
    } else if(k<1.5){
      vec2 m=vec2(cos(A.z),sin(A.z));
      float d=-(q.x-A.x)*m.y+(q.y-A.y)*m.x;
      if(B.y>0.0){d=d-B.y*floor(d/B.y+0.5);}
      float w=A.w*B.x/(B.x+abs(d));
      q-=m*w;
    } else if(k<2.5){
      vec2 d=q-A.xy;float rho=length(d);
      float a=-A.z*A.w/(A.w+rho);
      float c=cos(a);float s=sin(a);
      q=A.xy+vec2(d.x*c-d.y*s,d.x*s+d.y*c);
    } else {
      vec2 m=vec2(cos(A.x),sin(A.x));
      float l=dot(q,m);
      float w=A.y*sin(6.2831853*l/A.z+A.w);
      q-=vec2(-m.y,m.x)*w;
    }
  }
  if(!hit){col=uPal[0];}
  float g=fract(sin(dot(v,vec2(12.9898,78.233)))*43758.5453);
  col*= (0.985+0.03*g);
  gl_FragColor=vec4(col,1.0);
}`;
  }

  function glRenderer(canvas) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) return null;
    const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || hp.precision === 0) return null;
    const maxVec = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    const MAX = Math.min(128, Math.floor((maxVec - 16) / 2));
    if (MAX < 48) return null;

    function shader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        return null;
      }
      return s;
    }
    const vs = shader(gl.VERTEX_SHADER, VSH);
    const fs = shader(gl.FRAGMENT_SHADER, fragQuelle(MAX));
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 2, 0, 0, 2]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      aspekt: gl.getUniformLocation(prog, 'uAspekt'),
      anzahl: gl.getUniformLocation(prog, 'uAnzahl'),
      a: gl.getUniformLocation(prog, 'uA'),
      b: gl.getUniformLocation(prog, 'uB'),
      pal: gl.getUniformLocation(prog, 'uPal')
    };
    const pal = new Float32Array(18);
    pal.set(GRUND, 0);
    FARBEN.forEach((f, i) => pal.set(f.rgb, 3 + i * 3));
    gl.uniform3fv(U.pal, pal);

    const A = new Float32Array(MAX * 4), B = new Float32Array(MAX * 4);

    return {
      art: 'webgl', MAX,
      male(ops, aspekt) {
        const n = Math.min(ops.length, MAX);
        for (let i = 0; i < n; i++) {
          const o = ops[i], s = o.str == null ? 1 : o.str, j = i * 4;
          if (o.k === T_TROPFEN) {
            A[j] = o.x; A[j + 1] = o.y; A[j + 2] = o.r * s; A[j + 3] = 0;
            B[j] = 0; B[j + 1] = 0; B[j + 2] = 0; B[j + 3] = o.c;
          } else if (o.k === T_KAMM) {
            A[j] = o.x; A[j + 1] = o.y; A[j + 2] = o.th; A[j + 3] = o.al * s;
            B[j] = o.la; B[j + 1] = o.s; B[j + 2] = 1; B[j + 3] = 0;
          } else if (o.k === T_SCHNECKE) {
            A[j] = o.x; A[j + 1] = o.y; A[j + 2] = o.ph * s; A[j + 3] = o.la;
            B[j] = 0; B[j + 1] = 0; B[j + 2] = 2; B[j + 3] = 0;
          } else {
            A[j] = o.th; A[j + 1] = o.am * s; A[j + 2] = o.T; A[j + 3] = o.ph;
            B[j] = 0; B[j + 1] = 0; B[j + 2] = 3; B[j + 3] = 0;
          }
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(U.aspekt, aspekt);
        gl.uniform1i(U.anzahl, n);
        gl.uniform4fv(U.a, A);
        gl.uniform4fv(U.b, B);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  }

  /* ── 2D-Fallback: identische Mathematik, Pixel für Pixel ───────────── */

  function pixelFarbe(x, y, ops) {
    const q = [x, y];
    for (let i = ops.length - 1; i >= 0; i--) {
      const o = ops[i];
      const treffer = invers(q, o, o.str == null ? 1 : o.str);
      // Palettenindex wie im Shader: 0 = Gallwasser/Grund, 1..5 = FARBEN.
      if (treffer === 0) return GRUND;
      if (treffer > 0) return FARBEN[treffer - 1].rgb;
    }
    return GRUND;
  }

  function zeichne2d(ctx, w, h, ops, aspekt) {
    const bild = ctx.createImageData(w, h);
    const d = bild.data;
    let p = 0;
    for (let py = 0; py < h; py++) {
      const y = (py + 0.5) / h;
      for (let px = 0; px < w; px++) {
        const rgb = pixelFarbe(((px + 0.5) / w) * aspekt, y, ops);
        d[p] = rgb[0] * 255; d[p + 1] = rgb[1] * 255; d[p + 2] = rgb[2] * 255; d[p + 3] = 255;
        p += 4;
      }
    }
    ctx.putImageData(bild, 0, 0);
  }

  function canvasRenderer(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return {
      art: 'canvas2d', MAX: 160,
      male(ops, aspekt) { zeichne2d(ctx, canvas.width, canvas.height, ops, aspekt); }
    };
  }

  /* ── Rezepte: aus einer Saat wird eine Schrittfolge ────────────────── */

  function streuen(ops, zettel, R, aspekt, c, n, rMin, rMax, klein) {
    // Gestreut wird wie mit dem Besen: gleichmäßig über die ganze Wanne.
    // Dafür ein verwürfeltes Raster mit Zitterversatz statt reinem Zufall.
    const spalten = Math.max(2, Math.round(Math.sqrt(n * aspekt)));
    const zeilen = Math.max(2, Math.ceil(n / spalten));
    const zellen = [];
    for (let z = 0; z < zeilen; z++) for (let s = 0; s < spalten; s++) zellen.push([s, z]);
    for (let i = zellen.length - 1; i > 0; i--) {
      const j = Math.floor(R() * (i + 1));
      [zellen[i], zellen[j]] = [zellen[j], zellen[i]];
    }
    for (let i = 0; i < n; i++) {
      const [sx, sz] = zellen[i % zellen.length];
      ops.push({
        k: T_TROPFEN,
        x: ((sx + 0.15 + R() * 0.7) / spalten) * aspekt,
        y: (sz + 0.15 + R() * 0.7) / zeilen,
        r: rMin + R() * (rMax - rMin),
        c
      });
    }
    if (zettel) {
      zettel.push(c === 0
        ? `Gallwasser gestreut, ${n} Tropfen — öffnet die Adern`
        : `${FARBEN[c - 1].name} gestreut, ${n} Tropfen${klein ? ' (fein)' : ''}`);
    }
  }

  function kamm(ops, zettel, richtung, al, la, s, versatz) {
    // richtung: 0 = quer (nach rechts), 1 = längs (nach unten)
    const th = richtung === 0 ? 0 : Math.PI / 2;
    ops.push({ k: T_KAMM, x: versatz.x, y: versatz.y, th, al, la, s });
    if (zettel) {
      const name = s === 0 ? 'Stift' : `Kamm, Teilung ${Math.round(s * 500)} mm`;
      zettel.push(`${name} ${richtung === 0 ? 'quer' : 'längs'} gezogen`);
    }
  }

  function farbwahl(R, n) {
    const idx = [1, 2, 3, 4, 5];
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(R() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const wahl = idx.slice(0, n);
    if (!wahl.includes(1) && !wahl.includes(5)) wahl[0] = 1; // Tiefe sichern
    return wahl;
  }

  function grundstreuung(ops, zettel, R, aspekt, dichte) {
    // Vier Farben nacheinander, von großen Flatschen zu feinen Sprenkeln.
    // Die Summe der Flächen liegt bewusst über der Wannenfläche, weil jede
    // Verdrängung Farbe über den Rand hinausschiebt.
    const fak = (aspekt / 1.4) * (dichte || 1);
    const [c1, c2, c3, c4] = farbwahl(R, 4);
    streuen(ops, zettel, R, aspekt, c1, Math.round((11 + R() * 3) * fak), 0.13, 0.19);
    streuen(ops, zettel, R, aspekt, c2, Math.round((12 + R() * 3) * fak), 0.09, 0.14);
    streuen(ops, zettel, R, aspekt, c3, Math.round((15 + R() * 4) * fak), 0.055, 0.09, true);
    streuen(ops, zettel, R, aspekt, c4, Math.round((16 + R() * 4) * fak), 0.035, 0.06, true);
  }

  const REZEPTE = {
    stein(R, aspekt, zettel) {
      const ops = [];
      grundstreuung(ops, zettel, R, aspekt, 1);
      streuen(ops, zettel, R, aspekt, 0, Math.round(16 * (aspekt / 1.4)), 0.02, 0.045);
      return ops;
    },
    gelgit(R, aspekt, zettel) {
      const ops = [];
      grundstreuung(ops, zettel, R, aspekt, 0.92);
      kamm(ops, zettel, 0, 0.28 + R() * 0.08, 0.16, 0.11, { x: 0, y: R() * 0.05 });
      kamm(ops, zettel, 1, 0.26 + R() * 0.08, 0.16, 0.11, { x: R() * 0.05, y: 0 });
      return ops;
    },
    nonpareille(R, aspekt, zettel) {
      const ops = this.gelgit(R, aspekt, zettel);
      kamm(ops, zettel, 1, 0.28 + R() * 0.06, 0.05, 0.032, { x: R() * 0.02, y: 0 });
      return ops;
    },
    wellen(R, aspekt, zettel) {
      const ops = this.nonpareille(R, aspekt, zettel);
      ops.push({ k: T_WELLE, th: Math.PI / 2 + (R() - 0.5) * 0.2, am: 0.035 + R() * 0.02, T: 0.22 + R() * 0.1, ph: R() * 6.28 });
      if (zettel) zettel.push('Wellenzug über die volle Breite');
      return ops;
    },
    schnecke(R, aspekt, zettel) {
      const ops = this.nonpareille(R, aspekt, zettel);
      const spalten = Math.max(2, Math.round(aspekt / 0.55));
      for (let z = 0; z < 2; z++) {
        for (let sp = 0; sp < spalten; sp++) {
          ops.push({
            k: T_SCHNECKE,
            x: ((sp + 0.5) / spalten) * aspekt + (R() - 0.5) * 0.08,
            y: (z + 0.5) / 2 + (R() - 0.5) * 0.08,
            ph: (R() < 0.5 ? -1 : 1) * (2.2 + R() * 1.2),
            la: 0.12 + R() * 0.06
          });
        }
      }
      if (zettel) zettel.push(`Schneckenzüge gesetzt, ${spalten * 2} Wirbel`);
      return ops;
    },
    bouquet(R, aspekt, zettel) {
      const ops = this.nonpareille(R, aspekt, zettel);
      ops.push({ k: T_WELLE, th: 0, am: 0.016 + R() * 0.008, T: 0.10 + R() * 0.03, ph: R() * 6.28 });
      if (zettel) zettel.push('Bukettzug: feiner Bogenwurf gegen die Kammrichtung');
      return ops;
    }
  };

  const HERO_ARTEN = [
    ['stein', 'Steinmarmor'], ['gelgit', 'Gel-Git'], ['nonpareille', 'Nonpareille'],
    ['wellen', 'Wellenkamm'], ['schnecke', 'Schneckenmarmor'], ['bouquet', 'Bukett']
  ];

  /* ── Bogen: Saat, Rezept, Beschriftung ─────────────────────────────── */

  function neueSaat() {
    if (window.crypto && crypto.getRandomValues) {
      const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0];
    }
    return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
  }

  function schoepfeBogen(saat, aspekt, art) {
    const R = mulberry32(saat);
    const wahl = art || HERO_ARTEN[Math.floor(R() * HERO_ARTEN.length)][0];
    const zettel = [];
    const ops = REZEPTE[wahl](R, aspekt, zettel);
    const tropfen = ops.filter((o) => o.k === T_TROPFEN && o.c > 0).length;
    const zuege = ops.filter((o) => o.k !== T_TROPFEN).length;
    const name = (HERO_ARTEN.find(([k]) => k === wahl) || [wahl, wahl])[1];
    const farbnamen = [...new Set(ops.filter((o) => o.k === T_TROPFEN && o.c > 0).map((o) => FARBEN[o.c - 1].name))];
    return { saat, art: wahl, name, ops, zettel, tropfen, zuege, farbnamen };
  }

  function bogenNummer(saat) {
    return String(1000 + (saat % 9000));
  }

  /* ── Gemeinsames ───────────────────────────────────────────────────── */

  const rmAbfrage = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const ruhig = () => rmAbfrage.matches;

  function passeAuf(canvas, maxBreite) {
    // Interne Auflösung an Darstellung und Gerät anpassen.
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = Math.min(Math.round(r.width * dpr), maxBreite);
    const h = Math.round(b * (r.height / Math.max(r.width, 1)));
    if (canvas.width !== b || canvas.height !== h) { canvas.width = b; canvas.height = Math.max(h, 2); }
    return r.width / Math.max(r.height, 1);
  }

  /* ── Hero-Plakat ───────────────────────────────────────────────────── */

  function heroStart() {
    const buehne = document.querySelector('[data-hero]');
    if (!buehne) return;
    const canvas = buehne.querySelector('canvas');
    const nummerEl = document.querySelector('[data-bogen-nummer]');
    const zeileEl = document.querySelector('[data-bogen-zeile]');
    const neuKnopf = document.querySelector('[data-neu]');

    let renderer = glRenderer(canvas);
    if (!renderer) renderer = canvasRenderer(canvas);
    if (!renderer) { buehne.classList.add('plakat--ruht'); return; }
    const istGl = renderer.art === 'webgl';
    buehne.classList.add('plakat--lebt');
    if (neuKnopf) neuKnopf.hidden = false;

    let aspekt = passeAuf(canvas, istGl ? 2400 : 460);
    let bogen = null;
    let laufend = 0;           // rAF-Handle der Choreografie
    let lahm = false;          // Gerät hat die Choreografie nicht geschafft
    const fluechtig = [];      // Zeigerspuren (Stift durchs Bad), klingen ab

    function beschrifte(fertig) {
      if (nummerEl) nummerEl.textContent = 'Bogen Nr. ' + bogenNummer(bogen.saat);
      if (zeileEl) {
        zeileEl.textContent = fertig
          ? `${bogen.name} · ${bogen.tropfen} Tropfen · ${bogen.zuege} Züge · ${bogen.farbnamen.join(', ')}`
          : 'Das Bad wird angesetzt …';
      }
      canvas.setAttribute('aria-label',
        `Frisch marmorierter Bogen Nr. ${bogenNummer(bogen.saat)}: ${bogen.name} aus ${bogen.farbnamen.join(', ')} — bei jedem Besuch neu gerechnet.`);
    }

    function maleJetzt() {
      const alle = fluechtig.length ? bogen.ops.concat(fluechtig) : bogen.ops;
      renderer.male(alle, aspekt);
    }

    function choreografie() {
      // Tropfen prasseln nacheinander ein, Züge ziehen sich in Ruhe durch.
      cancelAnimationFrame(laufend);
      const ops = bogen.ops;
      ops.forEach((o) => { o.str = 0; });
      const start = performance.now();
      let vorher = start, traege = 0, bilder = 0;
      const zeiten = [];
      let t = 380;
      for (const o of ops) {
        if (o.k === T_TROPFEN) { zeiten.push(t); t += 15 + 18 * Math.random(); }
        else { t += 300; zeiten.push(t); t += 620; }
      }
      const ende = t + 400;
      function schritt(jetzt) {
        const zeit = jetzt - start;
        bilder += 1;
        if (bilder > 2) {
          // Aufwärmphase (Shader-Übersetzung) nicht mitzählen.
          if (jetzt - vorher > 240) { traege += 1; } else if (traege > 0) { traege -= 1; }
        }
        vorher = jetzt;
        if (traege >= 3) {
          // Gerät kommt dauerhaft nicht nach (z. B. Software-Rendering):
          // hart beenden, der fertige Bogen ist der Ersatz — und künftig
          // wird ohne Choreografie und ohne Zeigerspur gearbeitet.
          lahm = true;
          fluechtig.length = 0;
          ops.forEach((o) => { o.str = 1; });
          maleJetzt(); beschrifte(true); return;
        }
        for (let i = 0; i < ops.length; i++) {
          const o = ops[i], d = zeit - zeiten[i];
          const dauer = o.k === T_TROPFEN ? 210 : 640;
          o.str = d <= 0 ? 0 : d >= dauer ? 1 : 1 - Math.pow(1 - d / dauer, 3);
        }
        maleJetzt();
        if (zeit < ende) { laufend = requestAnimationFrame(schritt); }
        else { ops.forEach((o) => { o.str = 1; }); maleJetzt(); beschrifte(true); }
      }
      laufend = requestAnimationFrame(schritt);
    }

    function schoepfe() {
      bogen = schoepfeBogen(neueSaat(), aspekt);
      beschrifte(false);
      if (ruhig() || !istGl || lahm) {
        bogen.ops.forEach((o) => { o.str = 1; });
        maleJetzt(); beschrifte(true);
      } else {
        choreografie();
      }
    }

    /* Zeigerspur: ein Stift, der durchs Bad fährt und wieder verklingt.
       Nur mit WebGL — der 2D-Weg bleibt ein ruhendes Bad. */
    let spurLauf = 0;
    function spurTick() {
      let aktiv = false;
      for (const f of fluechtig) { f.ph *= 0.90; if (Math.abs(f.ph) > 0.02) aktiv = true; }
      while (fluechtig.length && Math.abs(fluechtig[0].ph) <= 0.02) fluechtig.shift();
      maleJetzt();
      spurLauf = aktiv ? requestAnimationFrame(spurTick) : 0;
    }
    if (istGl) {
      let letzte = null;
      canvas.addEventListener('pointermove', (e) => {
        if (ruhig() || lahm || !bogen) return;
        const r = canvas.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * aspekt;
        const y = (e.clientY - r.top) / r.height;
        if (letzte) {
          const dx = x - letzte[0], dy = y - letzte[1];
          const weg = Math.hypot(dx, dy);
          if (weg > 0.012) {
            fluechtig.push({ k: T_SCHNECKE, x, y, ph: Math.max(-1.4, Math.min(1.4, (dx + dy) * 14)), la: 0.045 });
            if (fluechtig.length > 14) fluechtig.shift();
            letzte = [x, y];
            if (!spurLauf) spurLauf = requestAnimationFrame(spurTick);
          }
        } else { letzte = [x, y]; }
      });
      canvas.addEventListener('pointerleave', () => { letzte = null; });
    }

    if (neuKnopf) {
      neuKnopf.addEventListener('click', () => { schoepfe(); });
    }

    let resizeT = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        const alt = aspekt;
        aspekt = passeAuf(canvas, istGl ? 2400 : 460);
        if (Math.abs(alt - aspekt) / alt > 0.12 && bogen) {
          bogen = schoepfeBogen(bogen.saat, aspekt);
          bogen.ops.forEach((o) => { o.str = 1; });
        }
        maleJetzt(); beschrifte(true);
      }, 180);
    });

    schoepfe();
  }

  /* ── Ruhende Musterkacheln (2D, einmal gerechnet) ──────────────────── */

  function musterStart() {
    const kacheln = document.querySelectorAll('[data-muster]');
    if (!kacheln.length) return;
    const arbeit = [];
    kacheln.forEach((canvas) => {
      const art = canvas.getAttribute('data-muster');
      const saat = parseInt(canvas.getAttribute('data-saat') || '7', 10);
      const stufe = canvas.hasAttribute('data-stufe') ? parseInt(canvas.getAttribute('data-stufe'), 10) : -1;
      arbeit.push({ canvas, art, saat, stufe });
    });
    let i = 0;
    function naechste() {
      if (i >= arbeit.length) return;
      const { canvas, art, saat, stufe } = arbeit[i++];
      const aspekt = passeAuf(canvas, 380);
      const R = mulberry32(saat);
      const zettel = [];
      let ops = REZEPTE[art] ? REZEPTE[art](R, aspekt, zettel) : REZEPTE.stein(R, aspekt, zettel);
      if (stufe >= 0) {
        // Stufen des Verfahrens: 0 = leeres Bad, 1 = gestreut, 2..n = Züge
        if (stufe === 0) ops = [];
        else if (stufe === 1) ops = ops.filter((o) => o.k === T_TROPFEN);
      }
      ops.forEach((o) => { o.str = 1; });
      const ctx = canvas.getContext('2d');
      if (ctx) zeichne2d(ctx, canvas.width, canvas.height, ops, aspekt);
      const liste = canvas.closest('[data-muster-halter]')?.querySelector('[data-muster-zettel]');
      if (liste && !liste.childElementCount) {
        zettel.forEach((z) => {
          const li = document.createElement('li'); li.textContent = z; liste.appendChild(li);
        });
      }
      if ('requestIdleCallback' in window) requestIdleCallback(naechste, { timeout: 400 });
      else setTimeout(naechste, 30);
    }
    naechste();
  }

  /* ── Marmorierbad (Werkzeug auf bad.html) ──────────────────────────── */

  function badStart() {
    const wurzel = document.querySelector('[data-bad]');
    if (!wurzel) return;
    wurzel.hidden = false;
    const hinweisOhne = document.querySelector('[data-bad-ohne]');
    if (hinweisOhne) hinweisOhne.hidden = true;

    const canvas = wurzel.querySelector('canvas');
    let renderer = glRenderer(canvas);
    if (!renderer) renderer = canvasRenderer(canvas);
    if (!renderer) {
      wurzel.hidden = true;
      if (hinweisOhne) { hinweisOhne.hidden = false; }
      return;
    }
    const istGl = renderer.art === 'webgl';
    const ASPEKT = 7 / 5;                       // Bogen 70 × 50 quer
    canvas.width = istGl ? Math.min(1680, Math.round(840 * Math.min(window.devicePixelRatio || 1, 2))) : 448;
    canvas.height = Math.round(canvas.width / ASPEKT);

    const meldung = wurzel.querySelector('[data-meldung]');
    const zettelEl = wurzel.querySelector('[data-zettel]');
    const zaehler = wurzel.querySelector('[data-zaehler]');
    const GRENZE = Math.min(renderer.MAX - 2, 120);

    let ops = [];
    let gruppen = [];                            // { anzahl, text }
    let farbe = 1;
    const R = mulberry32(neueSaat());

    function male() { renderer.male(ops, ASPEKT); aktualisiere(); }

    function aktualisiere() {
      const tropfen = ops.filter((o) => o.k === T_TROPFEN && o.c > 0).length;
      const zuege = ops.filter((o) => o.k !== T_TROPFEN).length;
      if (zaehler) zaehler.textContent = `${tropfen} Tropfen · ${zuege} Züge · ${GRENZE - ops.length} Schritte frei`;
      const voll = ops.length >= GRENZE - 12;
      wurzel.querySelectorAll('[data-op]').forEach((k) => {
        const bedarf = k.getAttribute('data-op') === 'streuen' ? 12 : 1;
        k.disabled = ops.length + bedarf > GRENZE;
      });
      canvas.setAttribute('aria-label',
        ops.length === 0
          ? 'Leeres Marmorierbad, der Kleistergrund ist angesetzt.'
          : `Marmorierbad mit ${tropfen} Tropfen und ${zuege} Zügen. Der Werkstattzettel führt jeden Schritt auf.`);
      if (voll && ops.length < GRENZE && meldung && !meldung.textContent.includes('trägt')) {
        sage('Das Bad trägt nicht mehr viel — bald abziehen oder abräumen.');
      }
    }

    function sage(text) { if (meldung) meldung.textContent = text; }

    function notiere(anzahl, text) {
      gruppen.push({ anzahl, text });
      if (zettelEl) {
        const li = document.createElement('li');
        li.textContent = text;
        zettelEl.appendChild(li);
        zettelEl.parentElement.scrollTop = zettelEl.parentElement.scrollHeight;
      }
    }

    function tropfenBei(x, y) {
      if (ops.length + 1 > GRENZE) { sage('Das Bad ist voll. Bogen abnehmen oder abräumen.'); return; }
      const r = 0.05 + R() * 0.07;
      ops.push({ k: T_TROPFEN, x, y, r, c: farbe });
      notiere(1, `${FARBEN[farbe - 1].name}, ein Tropfen`);
      sage(`${FARBEN[farbe - 1].name} getropft.`);
      male();
    }

    const AKTIONEN = {
      streuen() {
        const n = 12;
        if (ops.length + n > GRENZE) { sage('Dafür ist kein Platz mehr im Bad.'); return; }
        for (let i = 0; i < n; i++) {
          ops.push({ k: T_TROPFEN, x: R() * ASPEKT, y: R(), r: 0.06 + R() * 0.1, c: farbe });
        }
        notiere(n, `${FARBEN[farbe - 1].name} gestreut, ${n} Tropfen`);
        sage(`${FARBEN[farbe - 1].name} über das Bad gestreut.`);
        male();
      },
      tropfen() { tropfenBei(0.15 + R() * (ASPEKT - 0.3), 0.15 + R() * 0.7); },
      galle() {
        const n = 10;
        if (ops.length + n > GRENZE) { sage('Dafür ist kein Platz mehr im Bad.'); return; }
        for (let i = 0; i < n; i++) {
          ops.push({ k: T_TROPFEN, x: R() * ASPEKT, y: R(), r: 0.02 + R() * 0.035, c: 0 });
        }
        notiere(n, `Gallwasser gestreut, ${n} Tropfen — öffnet Adern`);
        sage('Gallwasser gestreut: Es drängt die Farben zu Adern auseinander.');
        male();
      },
      kammquer() {
        if (ops.length + 1 > GRENZE) { sage('Kein Platz mehr — erst abziehen.'); return; }
        kamm(ops, null, 0, 0.24 + R() * 0.1, 0.13, 0.11, { x: 0, y: R() * 0.06 });
        notiere(1, 'Kamm quer, Teilung 55 mm');
        sage('Kamm quer durchs Bad gezogen.');
        male();
      },
      kammlaengs() {
        if (ops.length + 1 > GRENZE) { sage('Kein Platz mehr — erst abziehen.'); return; }
        kamm(ops, null, 1, 0.22 + R() * 0.1, 0.13, 0.11, { x: R() * 0.06, y: 0 });
        notiere(1, 'Kamm längs, Teilung 55 mm');
        sage('Kamm längs durchs Bad gezogen.');
        male();
      },
      fein() {
        if (ops.length + 1 > GRENZE) { sage('Kein Platz mehr — erst abziehen.'); return; }
        kamm(ops, null, 1, 0.26 + R() * 0.08, 0.05, 0.032, { x: R() * 0.02, y: 0 });
        notiere(1, 'Feinkamm längs, Teilung 16 mm');
        sage('Feinkamm gezogen — Nonpareille.');
        male();
      },
      welle() {
        if (ops.length + 1 > GRENZE) { sage('Kein Platz mehr — erst abziehen.'); return; }
        ops.push({ k: T_WELLE, th: Math.PI / 2 + (R() - 0.5) * 0.25, am: 0.03 + R() * 0.02, T: 0.2 + R() * 0.12, ph: R() * 6.28 });
        notiere(1, 'Wellenzug');
        sage('Wellenzug über das Bad gelegt.');
        male();
      },
      schnecke() {
        if (ops.length + 1 > GRENZE) { sage('Kein Platz mehr — erst abziehen.'); return; }
        ops.push({
          k: T_SCHNECKE,
          x: 0.2 + R() * (ASPEKT - 0.4), y: 0.2 + R() * 0.6,
          ph: (R() < 0.5 ? -1 : 1) * (2.4 + R() * 1.6), la: 0.13 + R() * 0.08
        });
        notiere(1, 'Schneckenzug');
        sage('Schnecke ins Bad gedreht.');
        male();
      },
      zurueck() {
        const g = gruppen.pop();
        if (!g) { sage('Nichts zurückzunehmen — das Bad ist frisch.'); return; }
        ops.length = Math.max(0, ops.length - g.anzahl);
        if (zettelEl && zettelEl.lastElementChild) zettelEl.removeChild(zettelEl.lastElementChild);
        sage(`Zurückgenommen: ${g.text}.`);
        male();
      },
      abraeumen() {
        ops = []; gruppen = [];
        if (zettelEl) zettelEl.textContent = '';
        sage('Bad abgeräumt. Der Kleistergrund steht wieder blank.');
        male();
      }
    };

    wurzel.querySelectorAll('[data-op]').forEach((knopf) => {
      knopf.addEventListener('click', () => {
        const op = knopf.getAttribute('data-op');
        if (AKTIONEN[op]) AKTIONEN[op]();
      });
    });

    wurzel.querySelectorAll('input[name="farbe"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        farbe = parseInt(radio.value, 10);
        sage(`${FARBEN[farbe - 1].name} auf dem Pinsel.`);
      });
    });

    canvas.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      tropfenBei(((e.clientX - r.left) / r.width) * ASPEKT, (e.clientY - r.top) / r.height);
    });

    /* Bogen abnehmen: hochauflösend im 2D-Weg rechnen, zeilenweise,
       damit die Seite bedienbar bleibt; dann als PNG herunterladen. */
    const abnehmen = wurzel.querySelector('[data-abnehmen]');
    if (abnehmen) {
      abnehmen.addEventListener('click', () => {
        if (!ops.length) { sage('Das Bad ist leer — erst Farbe streuen.'); return; }
        abnehmen.disabled = true;
        const B = 1750, H = Math.round(B / ASPEKT);
        const ab = document.createElement('canvas');
        ab.width = B; ab.height = H;
        const ctx = ab.getContext('2d');
        const bild = ctx.createImageData(B, 1);
        let zeile = 0;
        sage('Der Bogen wird abgenommen … 0 %');
        function tick() {
          const bis = Math.min(zeile + 24, H);
          for (; zeile < bis; zeile++) {
            const d = bild.data; let p = 0;
            const y = (zeile + 0.5) / H;
            for (let px = 0; px < B; px++) {
              const rgb = pixelFarbe(((px + 0.5) / B) * ASPEKT, y, ops);
              d[p] = rgb[0] * 255; d[p + 1] = rgb[1] * 255; d[p + 2] = rgb[2] * 255; d[p + 3] = 255;
              p += 4;
            }
            ctx.putImageData(bild, 0, zeile);
          }
          if (zeile < H) {
            if (zeile % 96 === 0) sage(`Der Bogen wird abgenommen … ${Math.round((zeile / H) * 100)} %`);
            setTimeout(tick, 0);
          } else {
            const a = document.createElement('a');
            a.download = `wolkenkamm-bogen-${Date.now() % 100000}.png`;
            a.href = ab.toDataURL('image/png');
            document.body.appendChild(a); a.click(); a.remove();
            sage('Bogen abgenommen und als PNG abgelegt — ein Unikat.');
            abnehmen.disabled = false;
          }
        }
        setTimeout(tick, 0);
      });
    }

    /* Muster aus dem Musterbuch übernehmen (?muster=gelgit) */
    const wunsch = new URLSearchParams(location.search).get('muster');
    if (wunsch && REZEPTE[wunsch]) {
      const zettel = [];
      ops = REZEPTE[wunsch](R, ASPEKT, zettel);
      ops.forEach((o) => { o.str = 1; });
      zettel.forEach((z) => notiere(0, z));
      gruppen = [];  // vorgezogene Schritte sind nicht rücknehmbar
      sage('Musterfolge aus dem Musterbuch übernommen — ziehen Sie weiter.');
    }

    male();
  }

  /* ── Badrechner ────────────────────────────────────────────────────── */

  function rechnerStart() {
    const form = document.querySelector('[data-rechner]');
    if (!form) return;
    const formate = { '50x70': [50, 70], '35x50': [35, 50], '25x35': [25, 35] };
    const aus = {
      wanne: form.querySelector('[data-aus-wanne]'),
      volumen: form.querySelector('[data-aus-volumen]'),
      moos: form.querySelector('[data-aus-moos]'),
      alaun: form.querySelector('[data-aus-alaun]')
    };
    function rechne() {
      const f = formate[form.elements.format.value] || formate['50x70'];
      const tiefe = Math.min(10, Math.max(3, parseFloat(form.elements.tiefe.value) || 6));
      const b = f[0] + 4, l = f[1] + 4;             // 2 cm Griffrand je Seite
      const liter = (b * l * tiefe) / 1000;
      const moos = liter * 20;                        // 20 g Carragheen je Liter
      const boegen = 25;
      const alaun = Math.round((boegen * 0.04) * 30); // 40 ml Streichlösung à 30 g/l
      aus.wanne.textContent = `${b} × ${l} × ${tiefe} cm`;
      aus.volumen.textContent = `${liter.toFixed(1).replace('.', ',')} Liter`;
      aus.moos.textContent = `${Math.round(moos)} g Carragheen`;
      aus.alaun.textContent = `${alaun} g Alaun für ${boegen} Bögen`;
    }
    form.addEventListener('input', rechne);
    form.addEventListener('submit', (e) => e.preventDefault());
    rechne();
  }

  /* ── Kopfmenü (mobil) ──────────────────────────────────────────────── */

  function menueStart() {
    const taste = document.querySelector('[data-menuetaste]');
    const menue = document.getElementById('menue');
    if (!taste || !menue) return;
    taste.addEventListener('click', () => {
      const offen = taste.getAttribute('aria-expanded') === 'true';
      taste.setAttribute('aria-expanded', String(!offen));
      document.body.classList.toggle('menue-offen', !offen);
    });
  }

  /* ── Start ─────────────────────────────────────────────────────────── */

  function start() {
    document.body.classList.add('js');
    menueStart();
    heroStart();
    musterStart();
    badStart();
    rechnerStart();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
