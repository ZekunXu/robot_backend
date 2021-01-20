const InfraredDB = require("../db/infrared.js");



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
		.findOne()
		.then((value)=>{
			return res.status(200).json({statusCode: "connected", msg: "success", data: value});
		})
		.catch((err)=>{
			return res.satus(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
		})
}