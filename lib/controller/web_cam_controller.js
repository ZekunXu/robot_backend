
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