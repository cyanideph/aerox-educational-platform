// Lesson 4: Fuel Injection System
export default {
  id: 'lesson-04',
  title: '4. Fuel Injection System',
  code: `// Fuel injection: throttle body, injectors, MAP sensor, O2 sensor
// Programmed FI (Fuel Injection) for 2-stroke engine

const fiSystem = {
  throttlePosition: 0,
  injectorPulse: 0,
  mapSensor: 0,    // Manifold Absolute Pressure
  o2Sensor: 0,    // Oxygen sensor
  airFuelRatio: 14.7  // Stoichiometric ratio
}

// Fuel injection control function
function updateFuelInjection(throttle, rpm) {
  electrical.rpm = rpm
  electrical.throttle = throttle
  
  // Convert throttle percentage to milliliters per stroke
  const throttlePct = Math.max(0, Math.min(100, throttle))
  electrical.throttlePosition = throttlePct
  
  // injector pulse width = f(throttle, RPM)
  // Larger pulses at high RPM, larger throttle
  const basePulse = 1.0 + (throttlePct / 100) * 2.0
  const rpmFactor = Math.max(0.5, rpm / 5000)
  electrical.injectorPulse = basePulse * rpmFactor
  
  // MAP sensor reading (simulated)
  electrical.mapSensor = Math.max(50, 100 + throttlePct * 0.5)
  
  // O2 sensor feedback (lean/rich)
  const afr = 14.7 + (Math.random() - 0.5) * 1.0
  electrical.o2Sensor = afr
  electrical.airFuelRatio = afr
  
  // Output diagnostic data
  console.log(`Throttle: ${throttlePct}%, RPM: ${rpm}`)
  console.log(`Injector Pulse: ${electrical.injectorPulse.toFixed(2)}ms, AFR: ${afr.toFixed(1)}`)
}

// Simulate various operating conditions
updateFuelInjection(20, 2000)
updateFuelInjection(50, 8000)
updateFuelInjection(80, 3000)
console.log('Fuel injection system simulation complete')`,
  params: { rpm: 6000, throttle: 45 },
  callouts: [
    { id: 'throttle', text: 'Throttle grip' },
    { id: 'injector', text: 'Fuel injectors' },
    { id: 'afr', text: 'Air/Fuel Ratio' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 6000, throttle: 45 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'throttle', type: 'throttle', position: { x: -1, y: 0, z: 0 } },
    { id: 'injector', type: 'injector', position: { x: 0, y: 0, z: 0 } },
    { id: 'sensor', type: 'sensor', position: { x: 1, y: 0, z: 0 } },
  ]
}