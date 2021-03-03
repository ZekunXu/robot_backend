const mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var HardwareMsgSchema = Schema({});

var HardwareMsgDB = mongoose.model('hardwareMsg', HardwareMsgSchema);


exports.getAllMsg = (req, res, next) => {
    HardwareMsgDB
        .find()
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
        })
}