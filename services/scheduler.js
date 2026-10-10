function everyMinutes(minutes, fn){
  const ms = minutes*60*1000;
  fn(); // run first time
  return setInterval(fn, ms);
}

function dailyReportJob(db){
  return ()=>{
    const date = new Date().toISOString().slice(0,10);
    console.log(`[CRON] Generating daily report for ${date}`);
    db.all(`SELECT COUNT(*) as total FROM events WHERE DATE(timestamp)=?`,[date],(err,row)=>{
      if(!err) console.log(`[CRON] ${date}: ${row.total} events`);
    });
  };
}

function cleanupOldData(db, days=30){
  return ()=>{
    db.run(`DELETE FROM events WHERE timestamp < datetime('now', '-${days} days')`, function(err){
      if(!err) console.log(`[CLEANUP] Deleted ${this.changes} old rows`);
    });
  };
}

module.exports = { everyMinutes, dailyReportJob, cleanupOldData };
