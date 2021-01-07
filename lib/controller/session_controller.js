const SessionDB = require("../db/session.js");
const Token = require("../component/token.js");


exports.newSession = (req, res, next) => {

	const data = req.body;

	SessionDB(data)
		.save()
		.then((value)=>{
			res.status(200).json({statusCode: "connected", message: "successful to store new session"});
		})
		.catch((err)=>{
			res.status(400).json({statusCode: "disconnected", message: "fail to store new session", err: err});
		});

}

exports.getAllSessions = (req, res, next) => {


	SessionDB.find()
		.then((value)=>{
			if(value.length == 0){
				res.status(200).json({statusCode: "connected", message: "session list is empty"});
			}

			res.status(200).json({statusCode: "connected", message: "success", param: {data: value}});
		})
		.catch((err)=>{
			res.status(400).json({statusCode: "disconnected", message: "fail to loop up session list", err: err});
		})

}


exports.login = (req, res, next) => {

	const username = req.body.username;
	const password = req.body.password;

	SessionDB
		.findOne({username: username, password: password})
		.then((value) => {
			if(value == null){
				res.status(200).json({statusCode: "connected", message: "username or password is wrong"});
			}
			res.status(200).json({statusCode: "connected", message: "success", param: value});
		})
		.catch((err) => {
			res.status(400).json({statusCode: "disconnected", message: "fail to loop up session list", err: err});
		})
}


exports.getSessionInfoByToken = (req, res, next) => {

	const token = req.body.token;

	SessionDB
		.findOne({token: token})
		.then((value)=>{
			if(!value){
				res.status(200).json({statusCode: "connected", msg: "no proper user found"});
			}

			res.status(200).json({statusCode: "connected", msg: "success", param: {username: value.username, level: value.level, isban: value.ban}});

		}).catch((err)=>{
			res.status(200).json({statusCode: "disconnected", msg: "fail to connect DB", err: err});
		})

}