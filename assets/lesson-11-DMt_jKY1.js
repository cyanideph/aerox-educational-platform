const t={id:"lesson-11",title:"11. Build a Project - Diagnostic Case Study",code:`// Capstone project: Complete diagnostic system for Yamaha Aerox
// Integrates all systems: engine, electrical, fuel, cooling, brakes

// Complete Aerox diagnostic dashboard
const diagnostic = {
  systemStatus: 'INIT',     // INIT, RUNNING, FAULT, SHUTDOWN
  engineRpm: 0,
  throttlePosition: 0,
  batteryVoltage: 12.6,
  coolantTemp: 85,
  fuelLevel: 100,
  absActive: false,
  errorCodes: [],
  timestamp: Date.now()
}

// Engine diagnostics function
function runDiagnostics(sensors) {
  // Update diagnostic state
  diagnostic.timestamp = Date.now()
  
  // Extract sensor values
  const { rpm, throttle, voltage, temp, fuel, abs } = sensors
  
  diagnostic.engineRpm = rpm || 0
  diagnostic.throttlePosition = throttle || 0
  diagnostic.batteryVoltage = voltage || 12.6
  diagnostic.coolantTemp = temp || 85
  diagnostic.fuelLevel = fuel || 100
  diagnostic.absActive = abs || false
  
  // Check for error conditions
  diagnostic.errorCodes = []
  
  // Battery voltage check
  if (diagnostic.batteryVoltage < 10) {
    diagnostic.errorCodes.push('BAT_LOW - Battery voltage too low')
  }
  if (diagnostic.batteryVoltage > 15) {
    diagnostic.errorCodes.push('BAT_HIGH - Battery overvoltage')
  }
  
  // Coolant temperature check
  if (diagnostic.coolantTemp > 110) {
    diagnostic.errorCodes.push('ENG_OVERHEAT - Engine overheating')
  }
  if (diagnostic.coolantTemp < 60) {
    diagnostic.errorCodes.push('ENG_COLD - Engine below operating temperature')
  }
  
  // RPM range check
  if (diagnostic.engineRpm > 10000) {
    diagnostic.errorCodes.push('RPM_OVERRED - Engine over-revving')
  }
  
  // ABS status
  diagnostic.absActive = !!(abs && abs.active)
  
  // System status determination
  if (diagnostic.errorCodes.length > 0) {
    diagnostic.systemStatus = 'FAULT'
  } else if (diagnostic.engineRpm > 0) {
    diagnostic.systemStatus = 'RUNNING'
  } else {
    diagnostic.systemStatus = 'INIT'
  }
  
  // Output comprehensive diagnostic report
  console.log('=== YAMAHA AEROX DIAGNOSTIC SYSTEM ===')
  console.log(\`Status: \${diagnostic.systemStatus}\`)
  console.log(\`RPM: \${diagnostic.engineRpm} \${diagnostic.engineRpm > 0 ? '🟢' : '⚪'}\`)
  console.log(\`Throttle: \${(diagnostic.throttlePosition * 100).toFixed(0)}%\`)
  console.log(\`Battery: \${diagnostic.batteryVoltage.toFixed(1)}V \${diagnostic.batteryVoltage < 12 ? '🔋' : '⚡'}\`)
  console.log(\`Coolant: \${diagnostic.coolantTemp}°C \${diagnostic.coolantTemp > 100 ? '🔥' : '❄️'}\`)
  console.log(\`Fuel: \${diagnostic.fuelLevel.toFixed(1)}%\`)
  console.log(\`ABS: \${diagnostic.absActive ? 'ACTIVE' : 'INACTIVE'}\`)
  
  if (diagnostic.errorCodes.length > 0) {
    console.log(\`ERRORS [\${diagnostic.errorCodes.length}]:\`)
    diagnostic.errorCodes.forEach((code, i) => {
      console.log(\`  \${i + 1}. \${code}\`)
    })
  } else {
    console.log('No errors detected - Systems nominal')
  }
  
  console.log('========================================')
  return diagnostic
}

// Complete diagnostic case study - simulate a ride with issues
console.log('Starting Yamaha Aerox Diagnostic Case Study...
')

// Normal start
let diag = runDiagnostics({ rpm: 1000, throttle: 0.2, voltage: 12.6, temp: 85, fuel: 90, abs: false })
console.log('1. Normal startup: All systems nominal
')

// Riding conditions
diag = runDiagnostics({ rpm: 4000, throttle: 0.5, voltage: 12.8, temp: 92, fuel: 75, abs: false })
console.log('2. Cruising at 4000 RPM: All systems nominal
')

// Overheating scenario
diag = runDiagnostics({ rpm: 7000, throttle: 0.8, voltage: 12.7, temp: 115, fuel: 50, abs: false })
console.log('3. Highway riding - engine overheating detected:
')
diag = runDiagnostics({ rpm: 7000, throttle: 0.8, voltage: 12.7, temp: 115, fuel: 50, abs: false })

// Low battery scenario
diag = runDiagnostics({ rpm: 2000, throttle: 0.3, voltage: 10.5, temp: 88, fuel: 30, abs: true })
console.log('4. Low battery voltage with ABS active:
')
diag = runDiagnostics({ rpm: 2000, throttle: 0.3, voltage: 10.5, temp: 88, fuel: 30, abs: true })

// Summary
console.log('=== DIAGNOSTIC CASE STUDY SUMMARY ===')
console.log(\`Total scenarios tested: 4\`)
console.log(\`Faults detected: \${diag.errorCodes.length}\`)
console.log(\`Final system status: \${diag.systemStatus}\`)
console.log('Case study complete - All systems analyzed')
console.log('==========================================')`,params:{rpm:5e3,throttle:.6,voltage:12.6,temp:90,fuel:60,abs:!1},callouts:[{id:"capstone",text:"Integrated diagnostics"},{id:"error",text:"Fault detection"},{id:"summary",text:"Case study complete"}],sim:"builtin",defaultParams:{rpm:5e3,throttle:.6,voltage:12.6,temp:90,fuel:60,abs:!1},modelUrl:"/models/aerox.obj",parts:[{id:"sensor-array",type:"sensor",position:{x:-1,y:0,z:0}},{id:"diagnostics",type:"display",position:{x:1,y:0,z:0}},{id:"report",type:"led",position:{x:0,y:-1,z:0}}]};export{t as default};
