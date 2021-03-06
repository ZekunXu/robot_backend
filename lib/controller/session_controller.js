const SessionDB = require("../db/session.js");
const Token = require("../component/token.js");
const GLOBAL_PARAM = require("../global_param.js");
const axios = require("axios");
const { Session } = require("express-session");


exports.newSession = (req, res, next) => {

	const data = req.body;

	// 先查询是否用户名重复，没有重复的话，写入新的用户名数据。
	Promise
		.resolve()
		.then(() => {
			return SessionDB.findOne({ username: data.username });
		})
		.then((value) => {
			if (value != null) {
				return Promise.reject(100);
			}
			return SessionDB(data).save();
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "successful to store new session" });
		})
		.catch((err) => {
			switch (err) {
				case 100:
					return res.status(200).json({ statusCode: "connected", msg: "account already exist" });
					break;
				default:
					return res.status(400).json({ statusCode: "disconnected", msg: "fail to store new session", err: err });
					break;


			}
		});

}

exports.getAllSessions = (req, res, next) => {


	SessionDB.find()
		.then((value) => {
			if (value.length == 0) {
				return res.status(200).json({ statusCode: "connected", msg: "session list is empty" });
			}

			return res.status(200).json({ statusCode: "connected", msg: "success", param: { data: value } });
		})
		.catch((err) => {
			return res.status(400).json({ statusCode: "disconnected", msg: "fail to loop up session list", err: err });
		})

}


exports.login = (req, res, next) => {

	const username = req.body.username;
	const password = req.body.password;

	SessionDB
		.findOne({ username: username, password: password })
		.then((value) => {
			if (value == null) {
				return res.status(200).json({ statusCode: "connected", msg: "username or password is wrong" });
			}
			return res.status(200).json({ statusCode: "connected", msg: "success", param: value });
		})
		.catch((err) => {
			return res.status(400).json({ statusCode: "disconnected", msg: "fail to loop up session list", err: err });
		})
}


exports.getSessionInfoByToken = (req, res, next) => {

	const token = req.body.token;

	SessionDB
		.findOne({ token: token })
		.then((value) => {
			if (!value) {
				return res.status(200).json({ statusCode: "connected", msg: "no proper user found" });
			}

			return res.status(200).json({ statusCode: "connected", msg: "success", param: { username: value.username, level: value.level, isban: value.ban } });

		}).catch((err) => {
			return res.status(200).json({ statusCode: "disconnected", msg: "fail to connect DB", err: err });
		})

}

exports.updatejgRegisterId = (req, res, next) => {
	const data = req.body;

	SessionDB
		.findOneAndUpdate({ token: data.token }, { jgRegisterId: data.jgRegisterId }, { new: true })
		.then((value) => {

			return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail", err: err });
		})
}


exports.getAlljgRegisterId = (req, res, next) => {
	SessionDB.find({}, { jgRegisterId: 1 }).then((value) => {
		return res.status(200).json({ value: value });
	}).catch((err) => {
		return res.status(404).json({ err: err });
	})
}

exports.deleteSessionByName = (req, res, next) => {

	const data = req.body;

	SessionDB.findOneAndDelete({username: data.username}).then((value)=>{
		return res.status(200).json({statusCode: "connected", msg: "success", value: value});
	})
	.catch((err)=>{
		return res.status(404).json({statusCode: "disconnected", msg: "fail to delete", err: err});
	})

}


//给账户增加 ProgramCode 绑定 项目的方法
exports.updateProgramCodeByToken = (req, res, next) => {

	const token = req.body.token;
	const programCode = req.body.programCode;

	SessionDB
		.findOneAndUpdate({token: token}, {programCode: programCode}, {new: true})
		.then((value)=>{
			if(!value){
				throw 100;
			}

			res.status(200).json({statusCode: "connected", msg: "success", data: value});
		})
		.catch((err)=>{
			switch(err){
				case 100:
					res.status(201).json({statusCode: "connected", msg: "更新失败，请检查 token 是否有效，programCode 是否为 Array 格式"});
				default: 
					res.status(404).json({statusCode: "disconnected", err: err});
			}
		})

}