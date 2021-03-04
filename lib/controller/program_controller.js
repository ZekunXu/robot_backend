const ProgramDB = require("../db/program.js");
const RobotInfoDB = require("../db/robot.js")


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

/**
 * {
 *   programName: String, 
 *   programCode: String
 * }
 */

exports.updateProgramNameByCode = (req, res, next) => {
    const data = req.body;

    ProgramDB
        .findOneAndUpdate({programCode: data.programCode}, {programName: data.programName}, {new: true})
        .then((value)=>{
            if(!value){
                return res.status(201).json({statusCode: "connected", msg: "no such program code"});
            }
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
        })
}

/**
 * 请求格式
 * {
 *   hardwareID: String
 * }
 * 
 * 回复格式
 * {
 *   statusCode: String, 
 *   msg: String, 
 *   data: {
 *         programName: String
 *       }
 * }
 */

exports.getprogramNameByHardwareId = (req, res, next) => {

    Promise
        .resolve()
        .then(()=>{
            return RobotInfoDB.findOne({hardwareID: req.body.hardwareID});
        })
        .then((value)=>{
            if(!value){
                throw "100";
            }

            return ProgramDB.findOne({programCode: value.programCode});
        })
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: {programName: value.programName}});
        })
        .catch((err)=>{
            switch(err){
                case "100":
                    return res.status(201).json({statusCode: "connected", msg: "invalid hardwareID"});
                default:
                    return res.status(404).json({statusCode: "disconnected", msg: "fail to connect tto server", err: err});
            }
        })

}