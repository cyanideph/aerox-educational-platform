// Lesson 5: Cooling System
export default {
  id: 'lesson-05',
  title: '5. Cooling System',
  code: `// Cooling system: liquid radiator, water pump, thermostat, temperature sensors
// Liquid-cooled 2-stroke: maintains optimal engine temperature

const cooling = {
  temperature: 85,      // Engine temperature °C
  radiatorFlow: 0,      // Coolant flow rate
  thermostatPos: 0,     // Thermostat opening percentage
  fanSpeed: 0,          // Radiator fan RPM
  overheat: false
}

// Cooling system function
function updateCooling(engineTemp, rpm) {
  cooling.rpm = rpm
  cooling.temperature = engineTemp
  
  // Radiator flow increases with RPM and temperature
  const tempDelta = engineTemp - 85  // Difference from optimal
  const rpmFactor = Math.max(0.5, rpm / 6000)
  
  // Coolant flow proportional to temp difference and RPM
  cooling.radiatorFlow = Math.max(0, tempDelta * rpmFactor * 0.5)
  
  // Thermostat opens at 80°C, fully open at 95°C
  if (engineTemp > 80) {
    cooling.thermostatPos = Math.min(100, (engineTemp - 80) * 2.5)
  } else {
    cooling.thermostatPos = 0
  }
  
  // Fan activates above 90°C
  if (engineTemp > 90) {
    cooling.fanSpeed = Math.min(3000, (engineTemp - 90) * 200)
    cooling.overheat = engineTemp > 105
  } else {
    cooling.fanSpeed = 0
    cooling.overheat = false
  }
  
  // Output status
  console.log(`Engine Temp: ${engineTemp}°C`)
  console.log(`Radiator Flow: ${cooling.radiatorFlow.toFixed(1)}, Thermostat: ${cooling.thermostatPos.toFixed(0)}%, Fan: ${cooling.fanSpeed.toFixed(0)} RPM`)
  if (cooling.overheat) {
    console.log('WARNING: Engine overheating!')
  }
}

// Simulate driving conditions
updateCooling(75, 1000)
updateCooling(95, 5000)
updateCooling(110, 8000)
updateCooling(120, 3000)
console.log('Cooling system simulation complete')`,
  params: { rpm: 4000, engineTemp: 92 },
  callouts: [
    { id: 'radiator', text: 'Radiator' },
    { id: 'thermostat', text: 'Thermostat' },
    { id: 'temp', text: 'Engine temperature' },
  ],
  sim: 'builtin',
  defaultParams: { rpm: 4000, engineTemp: 92 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'radiator', type: 'radiator', position: { x: -1.5, y: 0, z: 0 } },
    { id: 'water-pump', type: 'water-pump', position: { x: 1.5, y: 0, z: 0 } },
    { id: 'temp-sensor', type: 'sensor', position: { x: 0, y: 0.5, z: 0 } },
  ]
}