const EnvironmentDB = require("../db/environment.js");


/**
 * {
 *  area: String
 * }
 */

exports.saveEnvironmentArea = (req, res, next) => {

    var data = req.body;

    EnvironmentDB(data)
        .save()
        .then((value) => {
            return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
        })
        .catch((err) => {
            return res.status(404).json({ statusCode: "disconnected", msg: "fail to save data", err: err });
        })

}


/**
 * 
 * @param {
 *          area: String, 
 *          temperature: {
 *                          temperature: Number,
 *                          timestamp: String, 
 *                          reportHardwareId: String
 *                       }
 *        } req 
 */
exports.updateTemperature = (req, res, next) => {
    const data = req.body;

    Promise
        .resolve()
        .then(()=>{
            return EnvironmentDB.findOneAndUpdate({area: data.area}, {temperature: data.temperature}, {new: true});
        })
        .then((value)=>{
            if(!value){
                return res.status(200).json({statusCode: "connected", msg: "no data found"});
            }
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({ statusCode: "disconnected", msg: "fail to update data", err: err });
        })
}

/**
 * 
 * @param {
 *          area: String, 
 *          humidity: {
 *                      humidity: Number,
 *                      timestamp: String, 
 *                      reportHardwareId: String
 *                    }
 *        } req 
 */
exports.updateHumidity = (req, res, next) => {
    const data = req.body;

    EnvironmentDB
        .findOneAndUpdate({area: data.area}, {humidity: data.humidity}, {new: true})
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({ statusCode: "disconnected", msg: "fail to update data", err: err });
        })
}