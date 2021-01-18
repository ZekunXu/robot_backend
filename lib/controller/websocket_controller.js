const WebsocketCamDB = require("../db/websocket_data.js");


exports.getOfflineMessage = (req, res, next) => {
	var data = req.body.function;

	WebsocketCamDB
		.findOne({function: data})
		.then((value)=>{
			return res.status(200).json({data: value});
		})
		.catch((err)=>{
			return res.status(404).json({msg: "fail", err: err});
		})
}