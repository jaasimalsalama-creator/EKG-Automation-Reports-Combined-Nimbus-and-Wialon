const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    lat REAL, lon REAL, speed REAL, fuel REAL, eventType TEXT
  )`);
  db.run(`CREATE INDEX idx_vehicle ON events(vehicleId)`);
  console.log('DB ready');
});

module.exports = db;
