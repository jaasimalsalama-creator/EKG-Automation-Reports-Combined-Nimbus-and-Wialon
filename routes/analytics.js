const express = require('express');
const router = express.Router();
const analytics = require('../services/analytics');
const { reportCache, withCache } = require('../utils/cache');

router.get('/top-vehicles', (req,res)=>{
  const limit=parseInt(req.query.limit)||10;
  withCache(reportCache, `top_${limit}`, (cb)=>analytics.getTopVehiclesByMileage(limit,cb), (err,data)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({topVehicles:data});
  });
});

router.get('/hourly', (req,res)=>{
  analytics.getHourlyDistribution((err,data)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({hourly:data});
  });
});

router.get('/idle', (req,res)=>{
  const mins=parseInt(req.query.minutes)||60;
  analytics.getIdleVehicles(mins,(err,data)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({idleVehicles:data});
  });
});

router.get('/fuel-anomaly', (req,res)=>{
  analytics.getFuelAnomaly((err,data)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({anomalies:data});
  });
});

module.exports = router;
