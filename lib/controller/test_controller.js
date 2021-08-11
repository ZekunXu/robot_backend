const SessionDB = require('../db/session');

exports.helloWorld = async (req, res, next) => {


    const result = await SessionDB.find({level: {$lte: 1}, programCode: {$in: ["HUIJU"]}}, { jgRegisterId: 1 });

    console.log(result);



}