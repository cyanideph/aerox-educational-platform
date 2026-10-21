const e={id:"lesson-07",title:"7. Braking System",code:`// Braking system: front disc, rear disc, linked braking, ABS
// Yamaha Aerox features Combined Braking System (CBS) and optional ABS

const braking = {
  frontBrake: 0,      // Front brake pressure 0-100%
  rearBrake: 0,       // Rear brake pressure 0-100%
  brakePressure: 0,   // Combined pressure
  absActive: false,   // Anti-lock braking system status
  brakeTemp: 0        // Brake disc temperature °C
}

// Braking function with CBS and ABS simulation
function applyBrake(frontPct, rearPct, speed) {
  braking.frontBrake = Math.max(0, Math.min(100, frontPct))
  braking.rearBrake = Math.max(0, Math.min(100, rearPct))
  braking.brakePressure = (frontPct + rearPct) / 2
  
  // CBS: Linked braking - rear engages when front is applied
  const cbsRatio = 0.3  // 30% of front pressure goes to rear
  braking.rearBrake = Math.min(100, braking.rearBrake + braking.frontBrake * cbsRatio)
  
  // ABS simulation - modulates pressure to prevent lock-up
  const lockThreshold = 85  // Maximum brake pressure before ABS activates
  if (braking.brakePressure > lockThreshold && speed > 10) {
    braking.absActive = true
    // Modulate: reduce pressure then restore
    braking.brakePressure = lockThreshold - (braking.brakePressure - lockThreshold) * 0.5
    console.log('ABS ACTIVATED - modulating brake pressure')
  } else {
    braking.absActive = false
  }
  
  // Brake temperature increases with braking pressure and speed
  braking.brakeTemp = Math.max(0, braking.brakeTemp + braking.brakePressure * 0.1 - 0.01)
  
  // Output diagnostic data
  const absStatus = braking.absActive ? 'ABS ON' : 'ABS OFF'
  console.log(\`Front: \${braking.frontBrake}%, Rear: \${braking.rearBrake}%\`)
  console.log(\`Combined: \${braking.brakePressure.toFixed(1)}%, ABS: \${absStatus}\`)
  console.log(\`Brake Temp: \${braking.brakeTemp.toFixed(1)}°C\`)
}

// Simulate braking from different speeds
applyBrake(80, 50, 30)   // Light braking at low speed
applyBrake(100, 80, 50)  // Hard braking at moderate speed
applyBrake(100, 100, 80) // Emergency braking at high speed
console.log('Braking system simulation complete')`,params:{speed:40,frontBrake:70,rearBrake:30},callouts:[{id:"front",text:"Front disc brake"},{id:"rear",text:"Rear disc brake"},{id:"abs",text:"Anti-lock system"}],sim:"builtin",defaultParams:{speed:40,frontBrake:70,rearBrake:30},modelUrl:"/models/aerox.obj",parts:[{id:"front-disc",type:"brake",position:{x:-1.2,y:0,z:0}},{id:"rear-disc",type:"brake",position:{x:1.2,y:0,z:0}},{id:"calipers",type:"caliper",position:{x:0,y:-.5,z:0}}]};export{e as default};
