// Lesson 9: Instrument Cluster
export default {
  id: 'lesson-09',
  title: '9. Instrument Cluster',
  code: `// Instrument cluster: LCD display, speedometer, tachometer, fuel gauge
// Multi-function dashboard with digital and analog elements

const dashboard = {
  speed: 0,           // Speed km/h
  rpm: 0,           // Engine RPM
  fuelLevel: 100,   // Fuel level percentage
  gear: 'N',        // Current gear
  temperature: 85,  // Engine temperature °C
  clock: Date.now()   // System clock
}

// Dashboard update function
function updateDashboard(speed, rpm, fuel, gear, temp) {
  dashboard.speed = speed
  dashboard.rpm = rpm
  dashboard.fuelLevel = Math.max(0, Math.min(100, fuel))
  dashboard.gear = gear
  dashboard.temperature = temp
  
  // Convert speed to RPM via gear ratio (simplified)
  if (rpm > 0) {
    dashboard.rpm = rpm
  }
  
  // Update gear indicator
  const gearMap = { N: 'N', 1: '1', 2: '2', 3: '3' }
  dashboard.gear = gearMap[gear] || 'N'
  
  // Temperature warning
  const tempWarning = dashboard.temperature > 100
  
  // Output to display
  console.log(`=== YAMAHA AEROX DASHBOARD ===`)
  console.log(`Speed: ${dashboard.speed} km/h`)
  console.log(`RPM: ${dashboard.rpm} RPM`)
  console.log(`Gear: ${dashboard.gear}`)
  console.log(`Fuel: ${dashboard.fuelLevel}%`)
  console.log(`Temp: ${dashboard.temperature}°C ${tempWarning ? '⚠️' : ''}`)
  console.log(`==============================`)
}

// Simulate ride instrumentation
updateDashboard(0, 0, 100, 'N', 85)
updateDashboard(40, 3000, 85, '1', 90)
updateDashboard(60, 5000, 75, '2', 95)
updateDashboard(80, 8000, 60, '3', 105)
updateDashboard(100, 10000, 40, '3', 110)
console.log('Instrument cluster simulation complete')`,
  params: { speed: 60, rpm: 5000, fuel: 70, gear: '2', temp: 92 },
  callouts: [
    { id: 'speedo', text: 'Speedometer' },
    { id: 'tacho', text: 'Tachometer' },
    { id: 'fuel', text: 'Fuel gauge' },
  ],
  sim: 'builtin',
  defaultParams: { speed: 60, rpm: 5000, fuel: 70, gear: '2', temp: 92 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'cluster', type: 'display', position: { x: 0, y: 1.5, z: 0 } },
    { id: 'needle', type: 'needle', position: { x: 0, y: 0, z: 0 } },
    { id: 'warning', type: 'led', position: { x: 1, y: 1.5, z: 0 } },
  ]
}