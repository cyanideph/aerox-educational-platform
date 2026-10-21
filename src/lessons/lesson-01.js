// Lesson 1: Meet the Yamaha Aerox
export default {
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
  parts: [
    { id: 'engine', type: 'engine', position: { x: 0, y: 0, z: 0 } },
    { id: 'fi', type: 'fi', position: { x: 1, y: 0, z: 0 } },
  ],
  modelUrl: '/models/aerox.obj'  // Updated to reference .obj file
}