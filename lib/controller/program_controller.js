const ProgramDB = require("../db/program.js");


/**
 * 
 * {
 *   programName: String, 
 *   programCode: String, IFS/QZSQ
 *   GPSLocation: {
 *                  longitude: double, 
 *                  latitude: double, 
 *                  altitude: double,
 *                }
 * }
 */

exports.saveProgramInfo = (req, res, next) => {

    ProgramDB(req.body)
    .save()
    .then((value)=>{
        return res.status(200).json({statusCode: "connected", msg: "success", data: value});
    })
    .catch((err)=>{
        return res.status(404).json({statusCode: "disconnected", err: err});
    })

}

exports.getAllProgramInfo = (req, res, next) => {

    ProgramDB
        .find()
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", err: err});
        })
}