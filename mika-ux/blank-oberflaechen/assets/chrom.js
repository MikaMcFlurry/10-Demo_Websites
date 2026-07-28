/* Die Chromfläche der Eröffnungsszene. Rohes WebGL 1, keine Abhängigkeit.
 *
 * Verfahren: Der Schriftzug wird in ein 2D-Canvas gezeichnet und per
 * Separierbarem Box-Blur (3 Durchläufe ≈ Gauß) zu einem Höhenfeld
 * weichgezeichnet. Der Fragment-Shader liest daraus Normalen und spiegelt
 * ein prozedurales Studio-Environment: Softbox-Bänder, Horizontlinie und
 * genau ein roter Streifen — das Signal existiert hier nur als Reflexion.
 *
 * Vertrag (MXL-040/045): Canvas ist Hintergrund und Beweis, nie Navigation.
 * Poster = Ladezustand und Fallback. Eine Bewegungslogik (Environment-
 * Rotation aus Zeiger + Drift), anhaltbar per Taste. Reduced Motion rendert
 * genau ein stehendes Bild. Pausiert außerhalb des Viewports und bei
 * verborgenem Tab. */
(() => {
  'use strict';

  const buehne = document.querySelector('[data-buehne]');
  if (!buehne) return;
  const canvas = buehne.querySelector('canvas');
  const statusEl = buehne.querySelector('[data-flaeche-status]');
  const pauseTaste = buehne.querySelector('[data-bewegung]');
  const reduziert = window.matchMedia('(prefers-reduced-motion: reduce)');

  const WORT = 'BLANK';
  const DPR_MAX = 1.5;

  function meldeStatus(text) {
    if (statusEl) statusEl.textContent = 'Fläche: ' + text;
  }

  let gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
      || canvas.getContext('experimental-webgl');
  } catch (fehler) { gl = null; }

  if (!gl) {
    meldeStatus('Poster, ohne WebGL');
    if (pauseTaste) pauseTaste.hidden = true;
    return;
  }

  /* ---------- Shader ---------- */

  const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  const FRAGMENT = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec2 uRes;
uniform float uAngle;
uniform float uZeit;
varying vec2 vUv;

float hoehe(vec2 uv) {
  vec4 t = texture2D(uTex, uv);
  return t.r + t.a / 255.0; /* 16 Bit aus zwei Kanälen */
}

/* Periodisches Band im Azimut: weiche Softbox bei Mitte c, Schärfe s. */
float band(float az, float c, float s) {
  return pow(max(cos(az - c), 0.0), s);
}

vec3 environment(vec3 d) {
  float az = atan(d.x, d.z) + uAngle;
  float el = d.y;

  /* Studio: dunkler Boden, helle Decke, scharfe Horizontlinie —
     der klassische Chromhimmel. */
  float grund = mix(0.015, 0.78, smoothstep(-0.55, 0.85, el));
  float horizont = exp(-el * el * 300.0) * 0.4;

  /* Softboxen (hell) und Absorber (dunkel) im Wechsel. */
  float boxen = 0.0;
  boxen += band(az,  0.6, 26.0) * 0.9;
  boxen += band(az,  2.9, 60.0) * 0.7;
  boxen += band(az, -2.1, 14.0) * 0.4;
  boxen *= smoothstep(-0.55, 0.25, el);

  float w = grund + horizont + boxen;
  w -= band(az, 1.75, 22.0) * 0.4;
  w -= band(az, -2.9, 16.0) * 0.3;
  w = max(w, 0.0);
  vec3 farbe = vec3(w);

  /* Der eine rote Streifen: Signal #ff342e, nur als Reflexion. */
  float rot = band(az, -1.05, 150.0) * smoothstep(-0.75, 0.05, el);
  farbe += vec3(1.0, 0.205, 0.18) * rot * 1.5;

  return farbe;
}

void main() {
  float hC = hoehe(vUv);
  float hx = hoehe(vUv + vec2(uTexel.x, 0.0)) - hoehe(vUv - vec2(uTexel.x, 0.0));
  float hy = hoehe(vUv + vec2(0.0, uTexel.y)) - hoehe(vUv - vec2(0.0, uTexel.y));

  float staerke = 5.2;
  vec3 n = normalize(vec3(-hx * staerke, -hy * staerke, 1.0));

  /* Perspektivischer Blick: so wandert der Horizont über flache Flächen,
     statt sie in einem einzigen Environment-Wert absaufen zu lassen. */
  vec2 persp = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec3 blick = normalize(vec3(persp * 0.8, -1.0));
  vec3 r = reflect(blick, n);

  vec3 chrom = environment(r);
  chrom = pow(chrom, vec3(1.9)) * 1.25;          /* Kontrast: flüssiges Metall */
  float kante = pow(clamp(1.0 - n.z, 0.0, 1.0), 2.4);
  chrom += vec3(kante) * 0.55;                    /* Fresnel-Kante */

  /* Hintergrund: Nacht-Canvas mit sehr leiser Mitte. */
  vec2 p = vUv - 0.5;
  float vign = 1.0 - dot(p, p) * 0.9;
  vec3 nacht = vec3(0.039, 0.043, 0.039) * vign;

  float maske = smoothstep(0.06, 0.32, hC);
  vec3 farbe = mix(nacht, chrom, maske);

  /* Dither gegen Banding im Dunkeln. */
  float rausch = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  farbe += (rausch - 0.5) / 255.0 * 2.0;

  gl_FragColor = vec4(farbe, 1.0);
}`;

  function baueShader(typ, quelle) {
    const s = gl.createShader(typ);
    gl.shaderSource(s, quelle);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || 'Shader-Fehler');
    }
    return s;
  }

  let programm;
  try {
    programm = gl.createProgram();
    gl.attachShader(programm, baueShader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(programm, baueShader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(programm);
    if (!gl.getProgramParameter(programm, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(programm) || 'Link-Fehler');
    }
  } catch (fehler) {
    meldeStatus('Poster, ohne WebGL');
    if (pauseTaste) pauseTaste.hidden = true;
    return;
  }
  gl.useProgram(programm);

  const ecken = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ecken);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(programm, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uni = {
    tex: gl.getUniformLocation(programm, 'uTex'),
    texel: gl.getUniformLocation(programm, 'uTexel'),
    res: gl.getUniformLocation(programm, 'uRes'),
    angle: gl.getUniformLocation(programm, 'uAngle'),
    zeit: gl.getUniformLocation(programm, 'uZeit'),
  };

  const textur = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textur);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uni.tex, 0);

  /* ---------- Höhenfeld aus dem Schriftzug ---------- */

  /* Separierbarer Box-Blur, 3 Durchläufe je Achse ≈ Gauß. Läuft einmal je
     Layout, nicht je Frame. */
  function boxBlur(kanal, breite, hoehe, radius) {
    const tmp = new Float32Array(kanal.length);
    const fenster = radius * 2 + 1;
    for (let durchlauf = 0; durchlauf < 3; durchlauf++) {
      /* horizontal */
      for (let y = 0; y < hoehe; y++) {
        const zeile = y * breite;
        let summe = 0;
        for (let x = -radius; x <= radius; x++) {
          summe += kanal[zeile + Math.min(breite - 1, Math.max(0, x))];
        }
        for (let x = 0; x < breite; x++) {
          tmp[zeile + x] = summe / fenster;
          const raus = zeile + Math.max(0, x - radius);
          const rein = zeile + Math.min(breite - 1, x + radius + 1);
          summe += kanal[rein] - kanal[raus];
        }
      }
      /* vertikal */
      for (let x = 0; x < breite; x++) {
        let summe = 0;
        for (let y = -radius; y <= radius; y++) {
          summe += tmp[Math.min(hoehe - 1, Math.max(0, y)) * breite + x];
        }
        for (let y = 0; y < hoehe; y++) {
          kanal[y * breite + x] = summe / fenster;
          const raus = Math.max(0, y - radius) * breite + x;
          const rein = Math.min(hoehe - 1, y + radius + 1) * breite + x;
          summe += tmp[rein] - tmp[raus];
        }
      }
    }
  }

  let texBreite = 0;
  let texHoehe = 0;

  function baueHoehenfeld(cssBreite, cssHoehe) {
    /* Textur unabhängig von der Render-Auflösung, gedeckelt für den Blur. */
    const skala = Math.min(1, 1280 / cssBreite);
    texBreite = Math.max(320, Math.round(cssBreite * skala));
    texHoehe = Math.max(320, Math.round(cssHoehe * skala));

    const flach = document.createElement('canvas');
    flach.width = texBreite;
    flach.height = texHoehe;
    const ctx = flach.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, texBreite, texHoehe);

    /* Schriftgröße so, dass das Wort ~86 % der Breite füllt; horizontale
       Streckung 1.18 ersetzt die wdth-Achse, die Canvas-Text nicht kennt. */
    const streckung = 1.18;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let groesse = texHoehe * 0.6;
    ctx.font = '850 ' + groesse + 'px Archivo, "Helvetica Neue", Arial, sans-serif';
    const messung = ctx.measureText(WORT).width * streckung;
    const ziel = texBreite * 0.86;
    groesse = groesse * (ziel / messung);
    /* Hochformat: Größe an der Höhe deckeln, damit nichts überläuft. */
    groesse = Math.min(groesse, texHoehe * 0.42);
    ctx.font = '850 ' + groesse + 'px Archivo, "Helvetica Neue", Arial, sans-serif';

    ctx.save();
    ctx.translate(texBreite / 2, texHoehe / 2);
    ctx.scale(streckung, 1);
    ctx.fillStyle = '#fff';
    ctx.fillText(WORT, 0, groesse * 0.02);
    ctx.restore();

    const bild = ctx.getImageData(0, 0, texBreite, texHoehe);
    const kanal = new Float32Array(texBreite * texHoehe);
    for (let i = 0; i < kanal.length; i++) kanal[i] = bild.data[i * 4] / 255;

    const radius = Math.max(2, Math.round(groesse * 0.034));
    boxBlur(kanal, texBreite, texHoehe, radius);

    /* 16 Bit in zwei Kanälen (LUMINANCE_ALPHA): 8 Bit Höhe reichen nicht,
       die Quantisierung wird in den Normalen als Rauschen sichtbar.
       Zeilen beim Packen vertikal gespiegelt (Canvas oben-nach-unten,
       WebGL-UV unten-nach-oben). */
    const bytes = new Uint8Array(kanal.length * 2);
    for (let y = 0; y < texHoehe; y++) {
      const quelle = (texHoehe - 1 - y) * texBreite;
      const zielZeile = y * texBreite;
      for (let x = 0; x < texBreite; x++) {
        const wert = Math.max(0, Math.min(65535, Math.round(kanal[quelle + x] * 65535)));
        const ziel = (zielZeile + x) * 2;
        bytes[ziel] = wert >> 8;
        bytes[ziel + 1] = wert & 255;
      }
    }
    gl.bindTexture(gl.TEXTURE_2D, textur);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, texBreite, texHoehe, 0,
      gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, bytes);
    gl.uniform2f(uni.texel, 1 / texBreite, 1 / texHoehe);
  }

  /* ---------- Zustand und Schleife ---------- */

  let winkelZiel = 0.35;
  let winkel = 0.35;
  let drift = 0;
  let angehalten = false;
  let sichtbar = true;
  let laeuft = false;
  let rafId = 0;
  let start = performance.now();

  function zeichne(jetzt) {
    rafId = 0;
    const t = (jetzt - start) / 1000;
    if (!reduziert.matches && !angehalten) drift = t * 0.05;
    winkel += (winkelZiel + drift - winkel) * 0.045;
    gl.uniform1f(uni.angle, winkel);
    gl.uniform1f(uni.zeit, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!buehne.classList.contains('ist-live')) {
      buehne.classList.add('ist-live');
    }
    if (laeuft) rafId = requestAnimationFrame(zeichne);
  }

  function einzelbild() {
    if (!rafId) rafId = requestAnimationFrame((jetzt) => { laeuft = false; zeichne(jetzt); });
  }

  function steuereSchleife() {
    const soll = sichtbar && !document.hidden && !angehalten && !reduziert.matches;
    if (soll && !laeuft) {
      laeuft = true;
      meldeStatus('gerechnet, WebGL');
      if (!rafId) rafId = requestAnimationFrame(zeichne);
    } else if (!soll && laeuft) {
      laeuft = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (reduziert.matches) meldeStatus('gerechnet, Standbild');
      else if (angehalten) meldeStatus('gerechnet, angehalten');
    }
  }

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    const b = buehne.clientWidth;
    const h = buehne.clientHeight;
    canvas.width = Math.round(b * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uni.res, canvas.width, canvas.height);
    baueHoehenfeld(b, h);
    if (!laeuft) einzelbild();
  }

  /* Zeiger dreht das Environment — die eine Bewegungslogik der Szene. */
  buehne.addEventListener('pointermove', (ereignis) => {
    if (reduziert.matches || angehalten) return;
    const anteil = ereignis.clientX / Math.max(1, buehne.clientWidth) - 0.5;
    winkelZiel = 0.35 + anteil * 1.15;
  });

  if (pauseTaste) {
    pauseTaste.addEventListener('click', () => {
      angehalten = !angehalten;
      pauseTaste.setAttribute('aria-pressed', String(angehalten));
      pauseTaste.textContent = angehalten ? 'Bewegung fortsetzen' : 'Bewegung anhalten';
      steuereSchleife();
    });
    if (reduziert.matches) pauseTaste.hidden = true;
  }

  const beobachter = new IntersectionObserver((eintraege) => {
    sichtbar = eintraege[0]?.isIntersecting ?? true;
    steuereSchleife();
  }, { threshold: 0.05 });
  beobachter.observe(buehne);

  document.addEventListener('visibilitychange', steuereSchleife);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 180);
  });

  reduziert.addEventListener?.('change', () => {
    steuereSchleife();
    if (reduziert.matches) einzelbild();
  });

  canvas.addEventListener('webglcontextlost', (ereignis) => {
    ereignis.preventDefault();
    laeuft = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    buehne.classList.remove('ist-live');
    meldeStatus('Poster, WebGL unterbrochen');
  });

  /* Start: erst die Schrift, dann das Feld — das Poster ist der Ladezustand. */
  const schriftBereit = (document.fonts && document.fonts.load)
    ? Promise.all([
        document.fonts.load('850 100px Archivo'),
        document.fonts.ready,
      ]).catch(() => null)
    : Promise.resolve(null);

  schriftBereit.then(() => {
    layout();
    if (reduziert.matches) {
      meldeStatus('gerechnet, Standbild');
      einzelbild();
    } else {
      steuereSchleife();
    }
  });
})();
