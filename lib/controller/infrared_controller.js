const InfraredDB = require("../db/infrared.js");
const InfraredInfoDB = require("../db/infrared_info.js");



exports.saveInfraredMsg = (req, res, next) => {

	const data = {hardwareID: req.body.id};

	InfraredDB(data)
		.save()
		.then((value) => {
			return res.status(200).json({statusCode: "connected", msg: "success to store"});
		})
		.catch((err)=>{
			return res.status(400).json({statusCode: "disconnected", msg: "fail to store"});
		})
}


exports.getCountById = (req, res, next) => {

	const id = req.body.id;

	InfraredDB
		.countDocuments({hardwareID: id})
		.then((value) => {
			return res.status(200).json({statusCode: "connected", msg: "success", count: value});
		})
		.catch((err) => {
			return res.satus(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
		});
}

exports.getLatestMsg = (req, res, next) => {
	InfraredDB
		.findOne({})
		.sort({'_id': -1})
		.then((value)=>{

			var data = [{
				msg: value.location + "的红外报警有人通过",
				timestamp: value.createTime,
				location: value.location
			}]

			return res.status(200).json({statusCode: "connected", msg: "success", data: data});
		})
		.catch((err)=>{
			return res.satus(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
		})
}

exports.getMsgByCount = (req, res, next) => {

	const data = req.body;

	InfraredDB
		.find()
		.sort({'_id': -1})
		.limit(data.count)
		.then((value)=>{
			return res.status(200).json({statusCode: "connected", msg: "success", data: value});
		})
		.catch((err)=>{
			return res.satus(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
		})
}


exports.saveInfraredHardwareInfo = (req, res, next) => {
	const data = req.body;

	InfraredInfoDB(data)
		.save()
		.then((value)=>{
			return res.status(200).json({statusCode: "connected", msg: "success", param: value});
		})
		.catch((err)=>{
			return res.status(404).json({statusCode: "disconnected", msg: "fail to store new data.", err: err});
		})
}