const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const { sanitizeVehicleId } = require('../utils/validator');

router.get('/vehicle/:id/history', (req,res)=>{
  const id = sanitizeVehicleId(req.params.id);
  reportService.getVehicleHistory(id, 100, (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({vehicleId:id, history:rows});
  });
});

router.get('/vehicle/:id/fuel', (req,res)=>{
  const id = sanitizeVehicleId(req.params.id);
  reportService.getFuelConsumption(id, (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({vehicleId:id, fuelReport:rows});
  });
});

router.post('/batch', (req,res)=>{
  const { events } = req.body;
  if(!Array.isArray(events) || events.length===0) return res.status(400).json({error:'events array required'});
  if(events.length > 1000) return res.status(400).json({error:'max 1000 per batch'});
  reportService.batchInsert(events, (err)=>{
    if(err) return res.status(500).json({error:err.message});
    res.status(201).json({ingested: events.length});
  });
});

module.exports = router;
