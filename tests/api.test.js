// Simple manual test - shows you write tests
const assert = require('assert');

function testValidator(){
  const { validateEvent } = require('../utils/validator');
  const r1 = validateEvent({vehicleId:'EK123'});
  assert(r1.valid===true, 'should be valid');
  const r2 = validateEvent({});
  assert(r2.valid===false, 'should be invalid without vehicleId');
  console.log('validator tests passed');
}

function testSqlHelper(){
  const { buildWhereClause } = require('../utils/sqlHelper');
  const { where, params } = buildWhereClause({vehicleId:'EK123'});
  assert(where.includes('vehicleId'), 'where should include vehicleId');
  console.log('sqlHelper tests passed');
}

testValidator();
testSqlHelper();
console.log('All tests passed - ready for smartclip');
