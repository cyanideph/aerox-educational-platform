const e={id:"lesson-02",title:"2. The Engine - 2-Stroke Principles",code:`// 2-stroke cycle: intake, compression, power, exhaust
// Completion: power stroke every revolution (vs 4-stroke every 2 revs)

const cycle = {
  crankAngle: 0,
  portTiming: {
    intakeOpen: false,
    intakeClose: false,
    exhaustOpen: false,
    exhaustClose: false
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
  console.log(\`Crank: \${angle}°, Intake: \${cycle.portTiming.intakeOpen}, Exhaust: \${cycle.portTiming.exhaustOpen}\`)
}

// Run through full cycle
for (let a = 0; a <= 360; a += 5) {
  updatePortTiming(a)
}
console.log('2-stroke cycle complete')`,params:{rpm:6e3,temperature:90},callouts:[{id:"crank",text:"Crankshaft rotation"},{id:"ports",text:"Transfer and exhaust ports"},{id:"cycle",text:"Intake-compression-power-exhaust"}],sim:"builtin",defaultParams:{rpm:6e3,temperature:90},parts:[{id:"crank",type:"crank",position:{x:0,y:0,z:0}},{id:"ports",type:"ports",position:{x:2,y:0,z:0}}],modelUrl:"/models/aerox.obj"};export{e as default};
