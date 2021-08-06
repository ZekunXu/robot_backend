const SessionDB = require("../db/session.js");
const Token = require("../component/token.js");
const GLOBAL_PARAM = require("../global_param.js");
const axios = require("axios");
const { Session } = require("express-session");
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.newSession = async (req, res, next) => {

	let data = req.body;

	// 先查询是否用户名重复，没有重复的话，写入新的用户名数据。
	Promise
		.resolve()
		.then(() => {
			//查询账户名是否有重复
			return SessionDB.findOne({ username: data.username });
		})
		.then((value) => {
			//如果账户已经存在，则报错，直接返回。
			if (value != null) {
				return Promise.reject(100);
			}

			//如果不存在，则我们需要先将 password 进行 encode，
			return bcrypt.hash(data.password, saltRounds);
		})
		.then((pwd_encode)=>{
			data.password = pwd_encode;

			return SessionDB(data).save();
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "successful to store new session" });
		})
		.catch((err) => {
			switch (err) {
				case 100:
					return res.status(201).json({ statusCode: "connected", msg: "account already exist" });
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
	let session;

	SessionDB
		.findOne({ username: username})
		.then((value) => {

			if (value == null) {
				return res.status(201).json({ statusCode: "connected", msg: "用户名不存在或错误" });
			}

			session = value;

			return bcrypt.compare(password, session._doc.password);
		})
		.then((result)=>{
			if (!result) return res.status(201).json({statusCode: "connected", msg: "密码错误", param: null});

			return res.status(200).json({ statusCode: "connected", msg: "success", param: session });
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