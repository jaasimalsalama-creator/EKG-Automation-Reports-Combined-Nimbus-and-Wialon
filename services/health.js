const db = require('../db');

function checkDbHealth(cb){
  const start=Date.now();
  db.get(`SELECT 1 as ok`, [], (err)=>{
    const latency = Date.now()-start;
    cb(err, {db: err? 'down':'up', latency: `${latency}ms`});
  });
}

function getSystemMetrics(){
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    node: process.version
  };
}

function livenessProbe(req,res){
  res.json({status:'alive', ...getSystemMetrics()});
}

function readinessProbe(req,res){
  checkDbHealth((err, dbStatus)=>{
    if(err) return res.status(503).json({status:'not ready', db: dbStatus});
    res.json({status:'ready', db: dbStatus});
  });
}

module.exports = { checkDbHealth, getSystemMetrics, livenessProbe, readinessProbe };
