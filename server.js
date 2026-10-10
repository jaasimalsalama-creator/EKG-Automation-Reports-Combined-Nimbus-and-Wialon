const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
app.use(cors()); app.use(express.json());
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run(`CREATE TABLE events (id INTEGER PRIMARY KEY, vehicleId TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, lat REAL, lon REAL, speed REAL, fuel REAL)`);
});
app.post('/api/events', (req,res)=>{
  const {vehicleId,lat,lon,speed,fuel}=req.body;
  if(!vehicleId) return res.status(400).json({error:'vehicleId required'});
  db.run(`INSERT INTO events (vehicleId,lat,lon,speed,fuel) VALUES (?,?,?,?,?)`,[vehicleId,lat,lon,speed,fuel],function(err){
    if(err) return res.status(500).json({error:err.message});
    res.status(201).json({id:this.lastID,status:'ingested'});
  });
});
app.get('/api/events',(req,res)=>{
  const {vehicleId,page=1,limit=50}=req.query;
  let q=`SELECT * FROM events`; let p=[];
  if(vehicleId){q+=` WHERE vehicleId=?`; p.push(vehicleId);}
  q+=` ORDER BY timestamp DESC LIMIT ? OFFSET ?`; p.push(parseInt(limit),(page-1)*limit);
  db.all(q,p,(e,rows)=>res.json({page,limit,data:rows}));
});
app.get('/api/reports/daily',(req,res)=>{
  db.all(`SELECT vehicleId, COUNT(*) as events, AVG(speed) as avgSpeed FROM events GROUP BY vehicleId`,[],(e,rows)=>res.json({report:rows}));
});
app.listen(PORT,()=>console.log('API running'));
