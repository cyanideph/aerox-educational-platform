// Yahoo Aerox Educational Platform - Main Entry Point
// Vite + Three.js + Vanilla JS educational web app
// 10 interactive lessons on two-stroke engineering
// Creator: cY

import { Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight, DirectionalLight, Group, Mesh, BoxGeometry, MeshStandardMaterial, PlaneLoader, GridHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// Dragoon removed - using OrbitControls only
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/themes/prism-tomorrow.css'

// ============================================================
// Core Application State (mirrors Arduino pattern: L, z, B, G, V, W)
// ============================================================

/**
 * L - Main app state
 *  - lesson: current lesson ID
 *  - running: whether code is executing
 *  - saved: saved parameter values
 */
const L = {
  lesson: 'lesson-01',
  running: false,
  saved: {},
}

/**
 * z - Progress tracking
 *  - done: Set of completed lesson IDs
 *  - setActive: activate a lesson
 *  - complete: mark lesson complete
 *  - paintDone: render progress UI
 */
const z = {
  done: new Set(),
  setActive(id) { L.lesson = id; },
  complete(id) { 
    this.done.add(id)
    localStorage.setItem('aerox:done', JSON.stringify([...this.done]))
    this.paintDone()
  },
  paintDone() {
    // Render progress bars UI
    const total = 11 // total lessons
    const completed = this.done.size
    const percentage = Math.round((completed / total) * 100)
    // Update UI
    const bar = document.getElementById('progress-bar')
    if (bar) bar.style.width = `${percentage}%`
  },
}

/**
 * B - Code card component
 */
const B = {
  setLesson(lessonData) { /* load lesson into code editor */ },
  paint() { /* render code editor UI */ },
  setState(state) { /* update code card state */ },
  toggleExpanded() { /* expand/collapse code */ },
}

/**
 * G - UI controls
 */
const G = {
  se: { /* rig/leaders/tags */ },
  xe: { /* viewbar */ },
  we: { /* minimap */ },
}

/**
 * V - Three.js Board Stage (mirrors Arduino BoardStage)
 */
const V = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  parts: new Map(), // lesson part IDs → Three.js objects
  currentLesson: null,

  init(container) {
    this.scene = new Scene()
    this.scene.background = new Color(0x1a1a2e)
    
    this.camera = new PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100)
    this.camera.position.set(0, 2, 4)
    
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)
    
    // Lights
    const ambient = new AmbientLight(0xffffff, 0.6)
    this.scene.add(ambient)
    const dirLight = new DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 5)
    this.scene.add(dirLight)
    
    // Ground grid
    const grid = new GridHelper(10, 10)
    this.scene.add(grid)
    
    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = container.clientWidth / container.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(container.clientWidth, container.clientHeight)
    })
    
    // Load lesson default
    this.setLesson('lesson-01')
  },

  async setLesson(lessonId) {
    L.lesson = lessonId
    // Load lesson JSON data
    const lesson = await import(`./lessons/${lessonId}.js`)
    const data = lesson.default
    
    this.currentLesson = data
    this.parts.clear()
    
    // Load 3D model for this lesson
    if (data.modelUrl) {
      this.loadModel(data.modelUrl)
    }
    
    // Build parts for this lesson
    if (data.parts && data.parts.length) {
      data.parts.forEach(partDef => this.buildPart(partDef))
    }
    
    // Update camera to home view
    this.controls.reset()
    
    // Update code editor
    B.setLesson(data)
    
    // Update lesson title UI
    const titleEl = document.getElementById('lesson-title')
    if (titleEl) titleEl.textContent = data.title
    
    // Update callouts
    this.updateCallouts(data.callouts)
  },

  loadModel(url) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/jsm/libs/draco/') // self-hosted Draco decoder
    
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    
    gltfLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new MeshStandardMaterial({
              color: child.material.color,
              metalness: child.material.metalness,
              roughness: child.material.roughness,
            })
          }
        })
        this.scene.add(model)
        // Fit camera to model
        const box = new THREE.Box3().setFromObject(model)
        const center = new THREE.Vector3()
        box.getCenter(center)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        this.camera.position.set(center.x, center.y + maxDim * 1.5, center.z + maxDim * 2)
        this.controls.target.set(center.x, center.y, center.z)
        this.controls.update()
      },
      (xhr) => {
        console.log(`Loading model: ${xhr.loaded / xhr.total * 100}%`)
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )
  },

  buildPart(partDef) {
    // Each lesson defines parts (LED, button, pot, etc.)
    // Part def: { id, type, position, params, onBuild }
    const part = {}
    
    // Create appropriate Three.js object based on type
    let mesh
    switch (partDef.type) {
      case 'led':
        const geometry = new THREE.SphereGeometry(0.1, 16, 16)
        const material = new MeshStandardMaterial({ color: partDef.color || 0xff0000 })
        mesh = new THREE.Mesh(geometry, material)
        break
      case 'button':
        const btnGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32)
        const btnMat = new MeshStandardMaterial({ color: partDef.color || 0x00ff00 })
        mesh = new THREE.Mesh(btnGeo, btnMat)
        break
      case 'pot':
        const potGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 32)
        const potMat = new MeshStandardMaterial({ color: partDef.color || 0x00aaff })
        mesh = new THREE.Mesh(potGeo, potMat)
        break
      default:
        const boxGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const boxMat = new MeshStandardMaterial({ color: partDef.color || 0x888888 })
        mesh = new THREE.Mesh(boxGeo, boxMat)
    }
    
    if (mesh) {
      mesh.position.set(partDef.position.x || 0, partDef.position.y || 0, partDef.position.z || 0)
      this.scene.add(mesh)
      this.parts.set(partDef.id, { mesh, type: partDef.type, params: {} })
    }
  },

  updateParams(lessonId, params) {
    // Update parameter values and re-run simulation
    const lesson = this.currentLesson
    if (!lesson) return
    
    // Apply params to lesson
    lesson.params = { ...lesson.defaultParams, ...params }
    localStorage.setItem('aerox:values', JSON.stringify(lesson.params))
    
    // Update 3D part visuals
    this.parts.forEach((part, id) => {
      if (lesson.params[id]) {
        part.params = lesson.params[id]
        // Update visual based on param
        this.updatePartVisual(part, lesson.params[id])
      }
    })
    
    // Run simulation
    this.runSimulation(lesson)
  },

  updatePartVisual(part, value) {
    // Update 3D part appearance based on parameter value
    // e.g., LED brightness based on sensor value, pot rotation, etc.
    if (part.type === 'led') {
      const intensity = Math.min(1, value / 1023)
      part.mesh.material.emissiveIntensity = intensity
      part.mesh.material.color.setHSL(0, 0, intensity)
    }
  },

  runSimulation(lesson) {
    // Execute the lesson's code with current params
    // This is the "Ba()" interpreter from Arduino, adapted for Aerox diagnostics
    const code = lesson.code
    const params = lesson.params || {}
    
    // Replace {{placeholder}} patterns with actual values
    let executableCode = code
    for (const [key, value] of Object.entries(params)) {
      executableCode = executableCode.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    }
    
    // Simple Arduino-style code execution
    // In a real implementation, this would use a proper interpreter
    try {
      // Execute in sandbox with restricted globals
      const sandbox = {
        console,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        Math,
        parseInt,
        parseFloat,
        parseFloat,
      }
      
      // Wrap in IIFE to prevent polluting global scope
      const wrapped = `(function() { ${executableCode} })()`
      
      // Use Function constructor with sandbox
      const fn = new Function('console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Math', 'parseInt', 'parseFloat', ...Object.keys(sandbox), wrapped)
      fn(...Object.values(sandbox))
      
    } catch (e) {
      console.error('Simulation error:', e)
      B.log(`Error: ${e.message}`)
    }
  },
  
  // Serial monitor output
  log(message) {
    B.log(message)
  },
  
  // Raycaster-based part picking
  pickPart(x, y) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    mouse.x = (x / window.innerWidth) * 2 - 1
    mouse.y = - (y / window.innerHeight) * 2 + 1
    
    raycaster.setFromCamera(mouse, this.camera)
    
    const intersects = raycaster.intersectObjects(
      Array.from(this.parts.values()).map(p => p.mesh)
    )
    
    if (intersects.length > 0) {
      const part = this.parts.get(intersects[0].object.userData.id)
      if (part) {
        // Show inspector panel with parameter controls
        W.open(part)
        return part
      }
    }
    
    W.close()
    return null
  },
}

// ============================================================
// Part Inspector (mirrors Arduino W object)
// ============================================================

const W = {
  open(part) {
    // Show inspector panel with parameter sliders
    const panel = document.getElementById('inspector-panel')
    if (!panel) return
    
    panel.innerHTML = `
      <h3>${part.type.toUpperCase()}: ${part.mesh.position.x.toFixed(1)}</h3>
      ${this.renderParamControls(part)}
    `
    panel.classList.add('open')
    
    // Add event listeners to sliders
    this.attachSliderListeners(part)
  },
  
  renderParamControls(part) {
    const params = V.currentLesson?.params || {}
    const controls = []
    
    for (const [key, defaultVal] of Object.entries(part.defaultParams || {})) {
      const val = params[key] || defaultVal
      controls.push(`
        <div class="param-group">
          <label>${key}: <span class="param-value" data-key="${key}">${val}</span></label>
          <input type="range" min="0" max="1023" value="${val}" 
                 class="param-slider" data-key="${key}">
        </div>`
      )
    }
    
    return controls.join('')
  },
  
  attachSliderListeners(part) {
    const sliders = document.querySelectorAll('.param-slider')
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const key = e.target.dataset.key
        const value = parseInt(e.target.value)
        
        // Update parameter in lesson state
        if (!V.currentLesson.params) V.currentLesson.params = {}
        V.currentLesson.params[key] = value
        
        // Update visual display
        const valueSpan = document.querySelector(`.param-value[data-key="${key}"]`)
        if (valueSpan) valueSpan.textContent = value
        
        // Update 3D part visual
        V.updatePartVisual(part, value)
        
        // Re-run simulation
        V.runSimulation(V.currentLesson)
      })
    })
  },
  
  close() {
    const panel = document.getElementById('inspector-panel')
    if (panel) panel.classList.remove('open')
  },
}

// ============================================================
// Code Editor Component (mirrors Arduino B object + {{placeholder}})
// ============================================================

const codeMirrorContainer = document.createElement('div')
codeMirrorContainer.className = 'editor-container'

// Syntax-highlighted code display (pre element, mirrored from textarea)
const codeDisplay = document.createElement('pre')
codeDisplay.className = 'language-javascript'
codeDisplay.setAttribute('data-language', 'javascript')

// User code textarea
const codeTextarea = document.createElement('textarea')
codeTextarea.id = 'aerox-code'
codeTextarea.spellcheck = false
codeTextarea.autocorrect = 'off'
codeTextarea.autocapitalize = 'off'
codeTextarea.translate = 'no'
codeTextarea.rows = 15

// Serial monitor output
const serialOutput = document.createElement('div')
serialOutput.id = 'serial-monitor'
serialOutput.className = 'serial-output'
serialOutput.textContent = 'Serial Monitor Ready'

// Run/Stop controls
const controlsDiv = document.createElement('div')
controlsDiv.className = 'controls'
controlsDiv.innerHTML = `
  <button id="run-btn" class="btn primary">Run</button>
  <button id="stop-btn" class="btn secondary" style="display:none;">Stop</button>
`

// Code editor event handling
let highlightedCode = ''

// Mirror textarea to code display with syntax highlighting
codeTextarea.addEventListener('input', (e) => {
  const userCode = e.target.value
  
  // Apply {{placeholder}} substitution with current lesson params
  let substitutedCode = userCode
  if (window.currentLessonParams) {
    for (const [key, value] of Object.entries(window.currentLessonParams)) {
      substitutedCode = substitutedCode.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    }
  }
  
  // Display substituted code with syntax highlighting
  codeDisplay.textContent = Prism.hightext(substitutedCode)
  
  // Update run button state
  const runBtn = document.getElementById('run-btn')
  const stopBtn = document.getElementById('stop-btn')
  if (substitutedCode.trim()) {
    runBtn.style.display = 'inline-block'
    stopBtn.style.display = 'none'
  }
})

// Run button
document.getElementById('run-btn').addEventListener('click', () => {
  const code = codeDisplay.textContent || ''
  V.runSimulation({ code, params: window.currentLessonParams || {} })
  
  // UI state change
  document.getElementById('run-btn').style.display = 'none'
  document.getElementById('stop-btn').style.display = 'inline-block'
  
  // Add "Running..." to serial monitor
  V.log('Running...')
})

// Stop button
document.getElementById('stop-btn').addEventListener('click', () => {
  V.running = false
  document.getElementById('run-btn').style.display = 'inline-block'
  document.getElementById('stop-btn').style.display = 'none'
  V.log('Stopped')
})

// Serial monitor log method (used by V.log)
B.log = (message) => {
  const line = document.createElement('div')
  line.textContent = message
  serialOutput.appendChild(line)
  
  // Keep max 40 lines
  while (serialOutput.children.length > 40) {
    serialOutput.removeChild(serialOutput.firstChild)
  }
  
  // Persist scroll position preference
  const settings = JSON.parse(localStorage.getItem('aerox:settings') || '{}')
  if (!settings.autoScroll) return
  
  serialOutput.scrollTop = serialOutput.scrollHeight
}

// ============================================================
// Lesson Data (11 lessons structured like Arduino)
// ============================================================

// Lesson 01: Meet the Aerox
const lesson01 = {
  id: 'lesson-01',
  title: '1. Meet the Yamaha Aerox',
  code: `// Initialize Aerox system
const system = {
  rpm: 0,
  temperature: 25,
  throttle: 0
}

// Display initial status
function setup() {
  console.log('Yamaha Aerox 155cc two-stroke engine system')
  console.log('Engine displacement: 155cc')
  console.log('Cooling: Liquid-cooled')
  console.log('Fuel injection: Programmed FI')
}

// Main loop
function loop() {
  // Update engine parameters
  system.rpm = Math.max(0, system.rpm + (Math.random() - 0.5) * 100)
  system.throttle = Math.max(0, Math.min(1, system.throttle + (Math.random() - 0.5) * 0.1))
  
  // Log status
  console.log(`RPM: ${system.rpm.toFixed(0)}, Temp: ${system.temperature}C, Throttle: ${(system.throttle * 100).toFixed(0)}%`)
  
  // Schedule next loop
  setTimeout(loop, 100)
}

setup()
loop()`,
  params: { rpm: 3000, temperature: 85, throttle: 0.5 },
  callouts: [
    { id: 'engine', text: '155cc liquid-cooled two-stroke engine' },
    { id: 'fi', text: 'Programmed fuel injection' },
    { id: 'cooling', text: 'Liquid cooling circuit' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 3000, temperature: 85, throttle: 0.5 },
}

// Lesson 02: The Engine - 2-Stroke Principles
const lesson02 = {
  id: 'lesson-02',
  title: '2. The Engine - 2-Stroke Principles',
  code: `// 2-stroke cycle: intake, compression, power, exhaust
// Completion: power stroke every revolution (vs 4-stroke every 2 revs)

const cycle = {
  crankAngle: 0,
  portTiming: {
    intakeOpen: 0,
    intakeClose: 0,
    exhaustOpen: 0,
    exhaustClose: 0
  }
}

// Port timing diagram function
function updatePortTiming(angle) {
  cycle.crankAngle = angle
  
  // Transfer port opens near TDC of compression stroke
  if (angle > 0 && angle < 90) {
    cycle.portTiming.intakeOpen = true
  } else {
    cycle.portTiming.intakeOpen = false
  }
  
  // Export port opens during exhaust stroke
  if (angle > 180 && angle < 360) {
    cycle.portTiming.exhaustOpen = true
  } else {
    cycle.portTiming.exhaustOpen = false
  }
  
  // Intake port closes at BDC
  if (angle > 90 && angle < 180) {
    cycle.portTiming.intakeClose = true
  } else {
    cycle.portTiming.intakeClose = false
  }
  
  // Output crank angle and port status
  console.log(`Crank: ${angle}°, Intake: ${cycle.portTiming.intakeOpen}, Exhaust: ${cycle.portTiming.exhaustOpen}`)
}

// Run through full cycle
for (let a = 0; a <= 360; a += 5) {
  updatePortTiming(a)
}
console.log('2-stroke cycle complete')`,
  params: { rpm: 6000, temperature: 90 },
  callouts: [
    { id: 'crank', text: 'Crankshaft rotation' },
    { id: 'ports', text: 'Transfer and exhaust ports' },
    { id: 'cycle', text: 'Intake-compression-power-exhaust' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 6000, temperature: 90 },
}

// ... more lessons (03-11) would follow the same pattern

// Export lessons for the app to use
const LESSONS = [lesson01, lesson02] // ... plus lessons 03-11

// ============================================================
// Application Initialization
// ============================================================

// Restore progress from localStorage
const storedDone = JSON.parse(localStorage.getItem('aerox:done') || '[]')
storedDone.forEach(id => z.done.add(id))
z.paintDone()

// Restore settings
const storedSettings = JSON.parse(localStorage.getItem('aerox:settings') || '{}')
const storedValues = JSON.parse(localStorage.getItem('aerox:values') || '{}')

// Initialize Three.js board
const boardContainer = document.getElementById('board-container')
if (boardContainer) {
  V.init(boardContainer)
}

// Load first lesson
const initialLesson = LESSONS.find(l => !z.done.has(l.id)) || LESSONS[0]
if (initialLesson) {
  V.setLesson(initialLesson.id)
  // Apply saved parameter values
  if (Object.keys(storedValues).length > 0) {
    V.updateParams(initialLesson.id, storedValues)
  }
}

// Lesson navigator controls
document.querySelectorAll('.lesson-nav .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lessonId = btn.dataset.lesson
    V.setLesson(lessonId)
    // Apply saved params for this lesson
    if (storedValues[lessonId]) {
      V.updateParams(lessonId, storedValues[lessonId])
    }
  })
})

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  // R key - reset view
  if (e.key === 'r' || e.key === 'R') {
    V.controls.reset()
  }
  // Escape - close inspector
  if (e.key === 'Escape') {
    W.close()
  }
  // Arrow keys - navigate lessons
  if (e.key === 'ArrowRight') {
    // Next lesson
  }
  if (e.key === 'ArrowLeft') {
    // Previous lesson
  }
})

console.log('Yamaha Aerox Educational Platform initialized')