async function withRetry(fn, retries=3, delay=500){
  let lastErr;
  for(let i=0;i<retries;i++){
    try{ return await fn(); }
    catch(e){ lastErr=e; await new Promise(r=>setTimeout(r, delay*(i+1))); }
  }
  throw lastErr;
}

function bulkInsertWithRetry(db, events, cb){
  let attempt=0;
  function tryInsert(){
    attempt++;
    const stmt=db.prepare(`INSERT INTO events (vehicleId,lat,lon,speed,fuel) VALUES (?,?,?,?,?)`);
    db.serialize(()=>{
      db.run('BEGIN');
      try{
        events.forEach(e=> stmt.run([e.vehicleId,e.lat,e.lon,e.speed,e.fuel]));
        db.run('COMMIT', cb);
      }catch(e){
        db.run('ROLLBACK');
        if(attempt<3) setTimeout(tryInsert, 500*attempt);
        else cb(e);
      }
    });
  }
  tryInsert();
}

module.exports = { withRetry, bulkInsertWithRetry };
