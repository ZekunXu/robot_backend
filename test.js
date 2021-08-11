const SessionDB = require('./lib/db/session');


const result = SessionDB.find({}, { jgRegisterId: 1 , level: {$lte: 1}, programCode: {$in: ["IFS"]}});

console.log(result);