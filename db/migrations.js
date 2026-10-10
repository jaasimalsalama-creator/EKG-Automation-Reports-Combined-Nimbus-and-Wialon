// Migrations - shows production mindset
const migrations = [
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    lat REAL, lon REAL, speed REAL, fuel REAL,
    eventType TEXT DEFAULT 'gps',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_events_vehicle ON events(vehicleId)`,
  `CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp)`,
  `CREATE INDEX IF NOT EXISTS idx_events_type ON events(eventType)`,
  `CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY,
    keyHash TEXT UNIQUE NOT NULL,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastUsed DATETIME
  )`,
  `CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY,
    vehicleId TEXT,
    type TEXT,
    value REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

function runMigrations(db, cb){
  let i=0;
  function next(){
    if(i>=migrations.length) return cb(null);
    db.run(migrations[i], (err)=>{
      if(err) return cb(err);
      console.log(`Migration ${i+1}/${migrations.length} OK`);
      i++; next();
    });
  }
  next();
}

module.exports = { migrations, runMigrations };
