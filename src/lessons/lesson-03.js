// Lesson 3: Electrical System
export default {
  id: 'lesson-03',
  title: '3. The Electrical System',
  code: `// Electrical system: battery, alternator, starter, ECU sensors
// 12V system with 3-phase alternator charging

const electrical = {
  batteryVoltage: 12.6,
  alternatorOutput: 0,
  rpm: 0,
  batteryHealth: 100
}

// System initialization
function initElectrical() {
  console.log('Initializing Yamaha Aerox electrical system')
  console.log('Battery voltage: 12.6V (full charge)')
  console.log('Alternator: 3-phase AC generation')
  console.log('ECU monitors: voltage, current, temperature')
}

// Charging function - simulate alternator output based on RPM
function updateCharging(rpm) {
  electrical.rpm = rpm
  // Alternator only charges above 1000 RPM
  if (rpm > 1000) {
    const output = Math.min(15, (rpm - 1000) / 100 * 3)
    electrical.alternatorOutput = output
    electrical.batteryVoltage = Math.min(14.5, 12.6 + output * 0.3)
  }
  console.log(`RPM: ${rpm}, Alt Output: ${electrical.alternatorOutput.toFixed(1)}V, Battery: ${electrical.batteryVoltage.toFixed(1)}V`)
}

// Simulate driving cycle
for (let r = 800; r <= 6000; r += 500) {
  updateCharging(r)
}
console.log('Electrical system simulation complete')`,
  params: { rpm: 3000, batteryHealth: 85 },
  callouts: [
    { id: 'battery', text: '12V battery' },
    { id: 'alternator', text: '3-phase alternator' },
    { id: 'ecu', text: 'Engine Control Unit' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 3000, batteryHealth: 85 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'battery', type: 'battery', position: { x: -1, y: 0, z: 0 } },
    { id: 'alt', type: 'alternator', position: { x: 1, y: 0, z: 0 } },
    { id: 'ecu', type: 'ecu', position: { x: 2, y: 0, z: 0 } },
  ]
}