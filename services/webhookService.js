const https = require('https');

function sendWebhook(url, payload, cb){
  const data = JSON.stringify({timestamp: new Date().toISOString(),...payload});
  const req = https.request(url, {method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}, (res)=>{
    let body=''; res.on('data',d=>body+=d); res.on('end',()=>cb(null,{status:res.statusCode, body}));
  });
  req.on('error', cb);
  req.write(data); req.end();
}

function triggerAlerts(event){
  const alerts=[];
  if(event.speed > 120) alerts.push({type:'overspeed', vehicleId:event.vehicleId, value:event.speed});
  if(event.fuel < 5) alerts.push({type:'low_fuel', vehicleId:event.vehicleId, value:event.fuel});
  return alerts;
}

function batchNotify(alerts, webhookUrl){
  if(!alerts.length ||!webhookUrl) return;
  alerts.forEach(a=> sendWebhook(webhookUrl, a, (err,res)=>{ if(err) console.error('webhook failed', err.message); }));
}

module.exports = { sendWebhook, triggerAlerts, batchNotify };
