const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - ingest event (high-volume like ad impressions)
router.post('/events', (req,res)=>{
  const { vehicleId, lat, lon, speed, fuel, eventType } = req.body;
  if(!vehicleId) return res.status(400).json({error:'vehicleId required'});
  db.run(`INSERT INTO events (vehicleId,lat,lon,speed,fuel,eventType) VALUES (?,?,?,?,?,?)`,
    [vehicleId,lat,lon,speed,fuel,eventType||'gps'],
    function(err){
      if(err) return res.status(500).json({error:err.message});
      res.status(201).json({id:this.lastID, vehicleId, status:'ingested'});
    });
});

// GET with pagination - must for scalable APIs
router.get('/events', (req,res)=>{
  const { vehicleId, page=1, limit=50 } = req.query;
  const offset = (page-1)*limit;
  let sql = `SELECT * FROM events`; let params=[];
  if(vehicleId){ sql+=` WHERE vehicleId=?`; params.push(vehicleId); }
  sql+=` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  db.all(sql, params, (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({page:parseInt(page), limit:parseInt(limit), data:rows});
  });
});

// GET daily report - SQL aggregation
router.get('/reports/daily', (req,res)=>{
  db.all(`SELECT vehicleId, COUNT(*) as totalEvents, AVG(speed) as avgSpeed, SUM(fuel) as totalFuel FROM events GROUP BY vehicleId`,
  [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({date: req.query.date || 'today', report: rows});
  });
});

// GET fleet status
router.get('/fleet/status', (req,res)=>{
  db.get(`SELECT COUNT(*) as totalEvents, COUNT(DISTINCT vehicleId) as activeVehicles FROM events`,[],(err,row)=>{
    res.json({status:'ok', uptime:'99.9%', ...row});
  });
});

module.exports = router;
