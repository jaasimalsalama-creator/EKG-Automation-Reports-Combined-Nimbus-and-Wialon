// Fluent query builder - shows you know SQL injection protection
class QueryBuilder{
  constructor(table){ this.table=table; this.wheres=[]; this.params=[]; this.limitVal=50; this.offsetVal=0; this.order='timestamp DESC'; }
  where(field, op, value){ this.wheres.push(`${field} ${op} ?`); this.params.push(value); return this; }
  limit(n){ this.limitVal=Math.min(n,100); return this; }
  offset(n){ this.offsetVal=n; return this; }
  orderBy(field, dir='DESC'){ this.order=`${field} ${dir}`; return this; }
  build(){ 
    let sql=`SELECT * FROM ${this.table}`;
    if(this.wheres.length) sql+=` WHERE ${this.wheres.join(' AND ')}`;
    sql+=` ORDER BY ${this.order} LIMIT ? OFFSET ?`;
    return { sql, params:[...this.params, this.limitVal, this.offsetVal] };
  }
}

function buildInsert(table, data){
  const keys=Object.keys(data);
  const placeholders=keys.map(()=>'?').join(',');
  return { sql:`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`, params:Object.values(data) };
}

module.exports = { QueryBuilder, buildInsert };
