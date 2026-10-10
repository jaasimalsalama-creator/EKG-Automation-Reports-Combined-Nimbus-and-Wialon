// ETL pipeline - Extract Transform Load - core for data pipelines
const { normalizeGps, batchNormalize } = require('../utils/transform');
const { batchInsert } = require('./reportService');

async function extractFromWialonMock(){
  // mock - in prod fetch from Wialon API
  return [{id:'EK123', pos:{y:24.4,x:54.3,s:60}, sensors:{fuel:45}}, {id:'EK124', pos:{y:24.5,x:54.4,s:0}, sensors:{fuel:10}}];
}

function transformData(rawList){
  const cleaned = batchNormalize(rawList.map(r=>({
    id: r.id, lat: r.pos.y, lon: r.pos.x, speed: r.pos.s, fuel: r.sensors.fuel
  })));
  return cleaned.filter(e=> e.speed>=0 && e.fuel>=0);
}

function loadToDb(cleaned, db, cb){
  batchInsert(cleaned, cb);
}

async function runETL(db, cb){
  try{
    const raw = await extractFromWialonMock();
    const transformed = transformData(raw);
    loadToDb(transformed, db, (err)=>{
      if(err) return cb(err);
      cb(null, {ingested: transformed.length});
    });
  }catch(e){ cb(e); }
}

module.exports = { extractFromWialonMock, transformData, loadToDb, runETL };
