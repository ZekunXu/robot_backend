
const WebCamDB = require("../db/web_cam_url.js");



exports.getAllUrls = (req, res, next) => {


	WebCamDB.find((err, data) => {
		if (err) throw err;

		return res.status(200).json(data);

	});

}

exports.getUrlByHardwareID = (req, res, next) => {

	// POST, data: {id: id}
	var hardwareID = req.body.id;

	WebCamDB.findOne({
		hardwareID: hardwareID,
	}, (err, data) => {

		if (err) throw err;

		return res.status(200).json(data);

	});

}


exports.saveWebCam = (req, res, next) => {

	var data = req.body;

	WebCamDB(data)
		.save()
		.then((value)=>{
			res.status(200).json({message: "success"});
		}).catch((err)=>{
			res.status(400).json({message: "fail", content: err});
		});

}

exports.deleteWebCam =(req, res, next) => {

	Promise
		.resolve()
		.then( async ()=>{
			const data = req.body.hardwareID;
			const value = await WebCamDB.deleteMany({hardwareID: data});
			return value;
		}).then((value)=>{
			if(value.deletedCount == 0){
				res.status(200).json({statusCode: "connect", message: "fail to delete, no such data", deleteCount: value.deletedCount});
			}
			res.status(200).json({statusCode: "connect", message: "delete success", deleteCount: value.deletedCount});
		}).catch((err)=>{
			res.status(400).json({message: "disconnect", err: JSON.stringify(err)});
		})

}


exports.updateUrlByHardwareID = (req, res, next) => {


	Promise
		.resolve()
		.then(async () => {
			const ID = req.body.hardwareID;
			const param = req.body.param;

			const result = await WebCamDB.updateOne({hardwareID: ID}, {param: param});
			return result;
		})
		.then((value) => {
			console.log(value);
			if(value.nModified == 0){
				res.status(200).json({statusCode: "connect", message: "fail to update, no such data"});
			}
			res.status(200).json({statusCode: "connect", message: "update success"});
		})
		.catch((err) => {
			console.log("err: " + err);
			res.status(400).json({message: "disconnect", err: JSON.stringify(err)});
		})


}