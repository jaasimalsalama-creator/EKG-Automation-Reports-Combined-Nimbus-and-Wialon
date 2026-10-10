const db = require('../db');
const { dailyReportSQL, fleetHealthSQL } = require('../utils/sqlHelper');

function getDailyReport(callback){
  db.all(dailyReportSQL(), [], callback);
}

function getFleetHealth(callback){
  db.get(fleetHealthSQL(), [], callback);
}

function getVehicleHistory(vehicleId, limit=100, callback){
  db.all(`SELECT * FROM events WHERE vehicleId=? ORDER BY timestamp DESC LIMIT?`,
    [vehicleId, limit], callback);
}

function getFuelConsumption(vehicleId, callback){
  db.all(`
    SELECT DATE(timestamp) as day, SUM(fuel) as fuelUsed, COUNT(*) as trips
    FROM events WHERE vehicleId=? GROUP BY DATE(timestamp) ORDER BY day DESC LIMIT 30
  `, [vehicleId], callback);
}

function batchInsert(events, callback){
  const stmt = db.prepare(`INSERT INTO events (vehicleId,lat,lon,speed,fuel,eventType) VALUES (?,?,?,?,?,?)`);
  db.serialize(()=>{
    db.run('BEGIN TRANSACTION');
    events.forEach(e=>{
      stmt.run([e.vehicleId,e.lat,e.lon,e.speed,e.fuel,e.eventType||'gps']);
    });
    db.run('COMMIT', callback);
  });
  stmt.finalize();
}

module.exports = { getDailyReport, getFleetHealth, getVehicleHistory, getFuelConsumption, batchInsert };
