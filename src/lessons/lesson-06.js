// Lesson 6: Transmission System
export default {
  id: 'lesson-06',
  title: '6. Transmission System',
  code: `// Transmission: CVT (Continuously Variable Transmission) or gear selection
// Yamaha Aerox uses V-Matic CVT with belt and variator pulleys

const transmission = {
  gear: 'N',          // Neutral, 1st, 2nd, 3rd (CVT ratio)
  ratio: 1.0,         // Current gear ratio
  speed: 0,           // Vehicle speed km/h
  engineRpm: 0,       // Engine RPM
  throttle: 0         // Throttle position %
}

// CVT ratio function - infinite variability between min and max
function updateTransmission(throttle, engineRpm) {
  transmission.engineRpm = engineRpm
  transmission.throttle = throttle
  
  // Calculate V-Matic CVT ratio
  // Low throttle/low RPM = high ratio (low speed, high torque)
  // High throttle/high RPM = low ratio (high speed, low torque)
  const t = Math.max(0, Math.min(100, throttle)) / 100
  const r = Math.max(0, Math.min(100, engineRpm)) / 100
  
  // CVT ratio: 0.8 (highest gear) to 3.5 (lowest gear)
  // Inverse relationship with throttle and RPM
  const minRatio = 0.8
  const maxRatio = 3.5
  const ratioRange = maxRatio - minRatio
  
  // Ratio decreases as throttle/RPM increase
  transmission.ratio = maxRatio - (t * 0.6 + r * 0.4) * ratioRange
  
  // Calculate speed from ratio and RPM
  // speed = (engineRpm * ratio * wheelCircumference) / (60 * gearFactor)
  const wheelCircumference = 2.0 * Math.PI * 0.3  // 0.3m radius wheel
  transmission.speed = (engineRpm * transmission.ratio * wheelCircumference) / 60
  
  // Gear indicator (simplified CVT - no discrete gears)
  if (transmission.ratio > 3.0) {
    transmission.gear = 'Eco'
  } else if (transmission.ratio > 2.0) {
    transmission.gear = '1st'
  } else if (transmission.ratio > 1.5) {
    transmission.gear = '2nd'
  } else {
    transmission.gear = '3rd'
  }
  
  // Output
  console.log(`Throttle: ${throttle}%, Engine RPM: ${engineRpm}`)
  console.log(`CVT Ratio: ${transmission.ratio.toFixed(2)}, Speed: ${transmission.speed.toFixed(1)} km/h`)
  console.log(`Gear: ${transmission.gear}`)
}

// Simulate acceleration from stop
for (let r = 1000; r <= 8000; r += 2000) {
  updateTransmission(10, r)
}
updateTransmission(100, 6000)
console.log('Transmission system simulation complete')`,
  params: { rpm: 5000, throttle: 60 },
  callouts: [
    { id: 'cvt', text: 'V-Matic CVT' },
    { id: 'ratio', text: 'Gear ratio' },
    { id: 'speed', text: 'Vehicle speed' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 5000, throttle: 60 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'pulley', type: 'pulley', position: { x: -1, y: 0, z: 0 } },
    { id: 'belt', type: 'belt', position: { x: 0, y: 0, z: 0 } },
    { id: 'output', type: 'gear', position: { x: 1, y: 0, z: 0 } },
  ]
}