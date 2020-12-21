
const WebCamDB = require("../db/web_cam_url.js");



exports.getAllUrls = (req, res, next) => {


	WebCamDB.find((err, data) => {
		if (err) throw err;

		return res.status(200).json(params);

	});

}