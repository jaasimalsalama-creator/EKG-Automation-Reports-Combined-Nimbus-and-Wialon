const express = require('express');
const router = express.Router();
const db = require('../db');
const { toCSV } = require('../services/csvExport');

router.get('/csv/events', (req,res)=>{
  db.all(`SELECT * FROM events ORDER BY timestamp DESC LIMIT 1000`, [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    const csv = toCSV(rows);
    res.header('Content-Type','text/csv');
    res.header('Content-Disposition','attachment; filename=events.csv');
    res.send(csv);
  });
});

router.get('/csv/report', (req,res)=>{
  db.all(`SELECT vehicleId, COUNT(*) as events, AVG(speed) as avgSpeed FROM events GROUP BY vehicleId`, [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.header('Content-Type','text/csv');
    res.header('Content-Disposition','attachment; filename=report.csv');
    res.send(toCSV(rows));
  });
});

module.exports = router;
