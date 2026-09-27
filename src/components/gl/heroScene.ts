import { Mesh, Program, Renderer, Transform, Triangle } from 'ogl'

const NOISE = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
`

const RAMP = /* glsl */ `
  const vec3 PLUM = vec3(0.16, 0.05, 0.09);
  const vec3 FLARE = vec3(0.94, 0.27, 0.48);
  const vec3 EMBER = vec3(1.0, 0.416, 0.169);
  const vec3 GOLD = vec3(1.0, 0.71, 0.28);
  const vec3 CREAM = vec3(0.96, 0.925, 0.875);
  vec3 ramp(float t) {
    vec3 c = mix(vec3(0.02, 0.015, 0.012), PLUM, smoothstep(0.0, 0.28, t));
    c = mix(c, FLARE, smoothstep(0.26, 0.55, t));
    c = mix(c, EMBER, smoothstep(0.5, 0.74, t));
    c = mix(c, GOLD, smoothstep(0.72, 0.88, t));
    return mix(c, CREAM, smoothstep(0.86, 1.0, t));
  }
`

const fieldVertex = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fieldFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uVel;
  uniform float uFade;
  varying vec2 vUv;
  ${NOISE}
  ${RAMP}
  void main() {
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = vUv * aspect * 2.0;
    float t = uTime * (0.035 + uVel * 0.08);
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    float n = fbm(p + 2.4 * q + vec2(t * 1.5, -t));

    float side = smoothstep(0.3, 1.05, vUv.x);
    float glow = exp(-distance(vUv * aspect, uMouse * aspect) * 3.2) * uHover * 0.55;
    // The trace and metadata labels sit in the lower strip; keep the field dim enough there for 4.5:1.
    float shelf = mix(0.18, 1.0, smoothstep(0.1, 0.42, vUv.y));

    float i = pow(n, 2.1) * 1.9 * (side + glow) * shelf * (1.0 + uVel * 1.5);
    float alpha = clamp(i, 0.0, 1.0) * 0.5 * uFade;
    gl_FragColor = vec4(ramp(0.2 + i * 0.75) * alpha, alpha);
  }
`

type Options = {
  container: HTMLElement
  root: HTMLElement
}

/** Mounts the ember field behind the hero. Returns a disposer. */
export function createHeroScene({ container, root }: Options) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const renderer = new Renderer({
    dpr,
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
  })
  const { gl } = renderer
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.className = 'absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000'
  container.appendChild(canvas)

  const scene = new Transform()
  const field = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: fieldVertex,
      fragment: fieldFragment,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.7, 0.5] },
        uHover: { value: 0 },
        uVel: { value: 0 },
        uFade: { value: 0 },
      },
    }),
  })
  field.setParent(scene)
  const fu = field.program.uniforms

  let size = { w: 1, h: 1 }
  const measure = () => {
    const c = container.getBoundingClientRect()
    size = { w: c.width, h: c.height }
    renderer.setSize(size.w, size.h)
    fu.uRes.value = [size.w, size.h]
  }
  measure()
  const resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(container)

  const pointer = { x: -1, y: -1, inside: false }
  const onMove = (e: PointerEvent) => {
    const c = container.getBoundingClientRect()
    pointer.x = e.clientX - c.left
    pointer.y = e.clientY - c.top
    pointer.inside = true
  }
  const onLeave = () => (pointer.inside = false)
  root.addEventListener('pointermove', onMove)
  root.addEventListener('pointerleave', onLeave)

  const state = { hover: 0, vel: 0, lastY: window.scrollY }

  let frame = 0
  let running = false
  let start = performance.now()
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const dy = window.scrollY - state.lastY
    state.lastY = window.scrollY
    state.vel += (Math.min(Math.abs(dy) / 40, 1) - state.vel) * 0.1
    state.hover += ((pointer.inside ? 1 : 0) - state.hover) * 0.06

    fu.uTime.value = (now - start) / 1000
    fu.uVel.value = state.vel
    fu.uHover.value = state.hover
    fu.uMouse.value = [pointer.x / size.w, 1 - pointer.y / size.h]
    fu.uFade.value = Math.min(1, fu.uFade.value + 0.012)
    renderer.render({ scene })
  }

  const play = () => {
    if (running) return
    running = true
    state.lastY = window.scrollY
    frame = requestAnimationFrame(tick)
  }
  const pause = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  let visible = true
  const intersection = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible && !document.hidden) play()
    else pause()
  })
  intersection.observe(root)
  const onVisibility = () => (document.hidden || !visible ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)

  start = performance.now()
  play()
  requestAnimationFrame(() => (canvas.style.opacity = '1'))

  return () => {
    pause()
    resizeObserver.disconnect()
    intersection.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    root.removeEventListener('pointermove', onMove)
    root.removeEventListener('pointerleave', onLeave)
    canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
