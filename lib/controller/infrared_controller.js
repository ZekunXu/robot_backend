const InfraredDB = require("../db/infrared.js");



exports.saveInfraredMsg = (req, res, next) => {

	const data = {hardwareID: req.body.id};

	InfraredDB(data)
		.save()
		.then((value) => {
			return res.status(200).json({statusCode: "connected", msg: "success to store"});
		})
		.catch((err)=>{
			console.log(err);
			return res.status(400).json({statusCode: "disconnected", msg: "fail to store"});
		})
}