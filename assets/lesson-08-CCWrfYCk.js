const o={id:"lesson-08",title:"8. Suspension System",code:`// Suspension: front telescopic fork, rear swingarm with mono-shock
// Yamaha Aerox front: 41mm telescopic fork, rear: monoshock with preload adjustment

const suspension = {
  forkCompression: 0,       // Front fork compression 0-100%
  shockPreload: 0,          // Rear shock preload 0-100%
  rebound: 0,               // Rebound damping 0-100%
  rideHeight: 0,            // Rider height effect
  groundClearance: 0        // Ground clearance mm
}

// Suspension function - simulates fork and shock behavior
function updateSuspension(forkLoad, riderWeight, bump) {
  // Fork compression based on front wheel load
  suspension.forkCompression = Math.max(0, Math.min(100, forkLoad))
  
  // Shock preload based on rider weight (70-90kg typical)
  const weightFactor = Math.max(0, Math.min(1, (riderWeight - 60) / 30))
  suspension.shockPreload = Math.max(0, Math.min(100, weightFactor * 100))
  
  // Rebound damping - how fast suspension returns
  suspension.rebound = Math.max(0, Math.min(100, bump * 50))
  
  // Calculate ride height based on rider position
  const riderHeight = riderWeight / 80  // Normalize
  suspension.rideHeight = Math.max(100, 120 + riderHeight * 10)
  
  // Ground clearance - affected by suspension compression
  // Higher fork compression = lower ground clearance
  suspension.groundClearance = Math.max(80, 150 - suspension.forkCompression * 0.7)
  
  // Output suspension status
  const forkStatus = suspension.forkCompression > 70 ? 'COMPRESSED' : 'EXTENDED'
  console.log(\`Fork Compression: \${suspension.forkCompression}% [\${forkStatus}]\`)
  console.log(\`Shock Preload: \${suspension.shockPreload}%\`)
  console.log(\`Rebound: \${suspension.rebound}%\`)
  console.log(\`Ground Clearance: \${suspension.groundClearance.toFixed(1)} mm\`)
  console.log(\`Ride Height: \${suspension.rideHeight.toFixed(1)} mm\`)
}

// Simulate various riding conditions
updateSuspension(30, 75, 20)   // Light load, medium rider
updateSuspension(80, 90, 80)   // Heavy load, heavy rider, rough terrain
updateSuspension(50, 85, 50)   // Moderate conditions
updateSuspension(100, 90, 100) // Maximum compression, heavy rider
console.log('Suspension system simulation complete')`,params:{riderWeight:75,forkLoad:50,bump:40},callouts:[{id:"fork",text:"Telescopic fork"},{id:"shock",text:"Monoshock"},{id:"clearance",text:"Ground clearance"}],sim:"builtin",defaultParams:{rpm:4e3,throttle:45},modelUrl:"/models/aerox.obj",parts:[{id:"fork",type:"fork",position:{x:-1.5,y:0,z:0}},{id:"shock",type:"shock",position:{x:1.5,y:0,z:0}},{id:"wheel",type:"wheel",position:{x:0,y:-.3,z:0}}]};export{o as default};
