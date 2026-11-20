/* ================= drawing the picture; optional ink outlines ================= */
// Normally the park is drawn straight to the screen. With "Comic-Linien" switched on in the park office it is drawn into
// a texture together with its depth; a second pass copies it to the screen and inks every pixel where the depth jumps,
// so people, rides and trees get a dark outline. Thought bubbles and markers live in their own little scene and are
// always drawn last, on top.
const LINE = { rt: null, ok: true, auto: true, on: false, ss: 1, t: 1 };
const lineScene = new T.Scene(), lineCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const lineMat = new T.ShaderMaterial({
  uniforms: { tColor: { value: null }, tDepth: { value: null }, px: { value: new T.Vector2() }, A: { value: 1 }, B: { value: 1 }, ink: { value: new T.Color(0x1b1838) } },
  vertexShader: 'varying vec2 vUv;\nvoid main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  // depth d = A - B / z, so w = A - d is proportional to 1 / z: it changes evenly across any flat surface and its second
  // difference is zero there. Where it is not, relative to the nearest sample, there is an edge.
  fragmentShader: [
    'uniform sampler2D tColor; uniform highp sampler2D tDepth; uniform vec2 px; uniform highp float A; uniform highp float B; uniform vec3 ink;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec4 c = texture2D(tColor, vUv);',
    '  highp float w0 = A - texture2D(tDepth, vUv).x;',
    '  highp float w1 = A - texture2D(tDepth, vUv + vec2(px.x, 0.0)).x;',
    '  highp float w2 = A - texture2D(tDepth, vUv - vec2(px.x, 0.0)).x;',
    '  highp float w3 = A - texture2D(tDepth, vUv + vec2(0.0, px.y)).x;',
    '  highp float w4 = A - texture2D(tDepth, vUv - vec2(0.0, px.y)).x;',
    '  highp float wm = max(w0, max(max(w1, w2), max(w3, w4)));',
    '  highp float e = (abs(w1 + w2 - 2.0 * w0) + abs(w3 + w4 - 2.0 * w0)) / wm;',
    '  float k = smoothstep(0.007, 0.017, e) * (1.0 - smoothstep(80.0, 160.0, B / wm));',
    '  gl_FragColor = vec4(mix(c.rgb, c.rgb * 0.16 + ink * 0.42, k * 0.92), 1.0);',
    '}'].join('\n'),
  depthTest: false, depthWrite: false,
});
lineScene.add(new T.Mesh(new T.PlaneGeometry(2, 2), lineMat));
(function () {
  const cap = renderer.capabilities;
  LINE.ok = cap.precision === 'highp' && (cap.isWebGL2 || !!renderer.extensions.get('WEBGL_depth_texture'));
  if (!LINE.ok) return;
  LINE.rt = new T.WebGLRenderTarget(4, 4, { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat, stencilBuffer: false });
  LINE.rt.texture.generateMipmaps = false;
  LINE.rt.depthTexture = new T.DepthTexture(4, 4, T.UnsignedIntType);
  lineMat.uniforms.tColor.value = LINE.rt.texture; lineMat.uniforms.tDepth.value = LINE.rt.depthTexture;
})();
// w, h: size of the picture in device pixels. Screens with few pixels get a larger texture, which smooths the edges.
function lineSize(w, h, pr) {
  if (!LINE.rt) return;
  LINE.ss = pr >= 1.75 ? 1 : pr >= 1.3 ? 1.34 : 1.6; LINE.t = pr * LINE.ss >= 2.6 ? 2 : 1;
  const rw = Math.max(4, Math.round(w * LINE.ss)), rh = Math.max(4, Math.round(h * LINE.ss));
  if (LINE.rt.width !== rw || LINE.rt.height !== rh) LINE.rt.setSize(rw, rh);
}
function drawInked(sc, cm) {
  const u = lineMat.uniforms, rt = LINE.rt;
  renderer.setRenderTarget(rt); renderer.render(sc, cm); renderer.setRenderTarget(null);
  u.px.value.set(LINE.t / rt.width, LINE.t / rt.height); u.A.value = cm.far / (cm.far - cm.near); u.B.value = cm.far * cm.near / (cm.far - cm.near);
  renderer.render(lineScene, lineCam);
}
function renderScene() {
  LINE.on = LINE.ok && LINE.auto && S.outline === true;
  if (LINE.on) drawInked(scene, camera); else renderer.render(scene, camera);
  renderer.autoClear = false; renderer.render(overlay, camera); renderer.autoClear = true;
}
/* ----- keeping the game smooth on slow devices ----- */
// When the picture stutters for a while, the resolution goes down a step; as a last resort the outlines are dropped.
const GFX = { pr: Math.min(window.devicePixelRatio || 1, 2), avg: 0.016, t: -5, fixed: !!window.RUMMEL_FIXRES };
function gfxWatch(rdt) {
  if (GFX.fixed || document.hidden || S.speed > 1 || ui.modal) return;   // fast-forward strains the processor, not the graphics
  GFX.avg += (rdt - GFX.avg) * 0.05; GFX.t += rdt;
  if (GFX.t < 3) return;
  GFX.t = 0;
  if (GFX.avg < 0.055) return;
  if (GFX.pr > 1) { GFX.pr = Math.max(1, GFX.pr - 0.5); renderer.setPixelRatio(GFX.pr); resize(); }
  else if (LINE.auto && LINE.ok) LINE.auto = false;
  else GFX.fixed = true;
  GFX.avg = 0.016; GFX.t = -2;
}
