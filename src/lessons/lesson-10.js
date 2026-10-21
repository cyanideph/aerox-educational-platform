// Lesson 10: Maintenance
export default {
  id: 'lesson-10',
  title: '10. Maintenance',
  code: `// Maintenance schedule: oil change, air filter, spark plug, coolant
// Yamaha Aerox 150cc 2-stroke maintenance intervals

const maintenance = {
  lastOilChange: 0,     // Days since last oil change
  oilLife: 100,         // Oil life percentage
  airFilter: 100,       // Air filter condition %
  sparkPlug: 100,       // Spark plug condition %
  coolantLevel: 100,    // Coolant level %
  nextService: 0        // Days until next service
}

// Maintenance check function
function checkMaintenance(daysSinceOil, daysSinceService, mileage) {
  // Oil life decreases with time and usage
  // Typical 2-stroke oil change: every 3000km or 30 days
  const oilDegradation = daysSinceOil * 0.5 + mileage * 0.01
  maintenance.oilLife = Math.max(0, 100 - oilDegradation)
  maintenance.lastOilChange = daysSinceOil
  
  // Air filter check: every 5000km or when dirty
  const airFilterAge = mileage % 5000
  maintenance.airFilter = Math.max(0, 100 - airFilterAge * 0.2)
  
  // Spark plug every 10000km
  const plugAge = mileage % 10000
  maintenance.sparkPlug = Math.max(0, 100 - plugAge * 0.1)
  
  // Coolant level check
  maintenance.coolantLevel = Math.max(0, 100 - daysSinceService * 2)
  
  // Calculate next service interval
  // Service due at 10000km or 90 days, whichever comes first
  const kmUntilService = Math.max(0, 10000 - mileage)
  const daysUntilService = Math.max(0, 90 - daysSinceService)
  maintenance.nextService = Math.min(kmUntilService, daysUntilService)
  
  // Output maintenance status
  console.log('=== YAMAHA AEROX MAINTENANCE STATUS ===')
  console.log(`Oil Life: ${maintenance.oilLife.toFixed(1)}% (every ${Math.round(maintenance.nextService)} days/km)`)
  console.log(`Air Filter: ${maintenance.airFilter.toFixed(1)}%`)
  console.log(`Spark Plug: ${maintenance.sparkPlug.toFixed(1)}%`)
  console.log(`Coolant: ${maintenance.coolantLevel.toFixed(1)}%`)
  
  if (maintenance.oilLife < 20) {
    console.log('⚠️ OIL CHANGE DUE - Service immediately')
  }
  if (maintenance.airFilter < 30) {
    console.log('⚠️ AIR FILTER CLEANING DUE')
  }
  if (maintenance.sparkPlug < 40) {
    console.log('⚠️ SPARK PLUG REPLACEMENT DUE')
  }
  
  console.log('==========================================')
}

// Simulate maintenance checks
checkMaintenance(15, 5, 3500)   // 15 days, 3500km
checkMaintenance(45, 10, 8000)  // 45 days, 8000km - oil overdue
checkMaintenance(60, 20, 12000) // 60 days, 12000km - service overdue
checkMaintenance(20, 8, 5000)   // 20 days, 5000km - moderate
console.log('Maintenance system simulation complete')`,
  params: { daysSinceOil: 25, daysSinceService: 10, mileage: 4500 },
  callouts: [
    { id: 'oil', text: 'Oil change' },
    { id: 'filter', text: 'Air filter' },
    { id: 'plug', text: 'Spark plug' },
  ],
  sim: 'builtin',
  defaultParams: { daysSinceOil: 25, daysSinceService: 10, mileage: 4500 },
  parts: [
  modelUrl: '/models/aerox.obj',
    { id: 'oil-filter', type: 'tool', position: { x: -1, y: 0, z: 0 } },
    { id: 'spark-plug', type: 'tool', position: { x: 0, y: 0, z: 0 } },
    { id: 'coolant', type: 'liquid', position: { x: 1, y: 0, z: 0 } },
  ]
}