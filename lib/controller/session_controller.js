const SessionDB = require("../db/session.js");
const Token = require("../component/token.js");
const GLOBAL_PARAM = require("../global_param.js");
const axios = require("axios");


exports.newSession = (req, res, next) => {

	const data = req.body;

	// 先查询是否用户名重复，没有重复的话，写入新的用户名数据。
	Promise
		.resolve()
		.then(()=>{
			return SessionDB.findOne({username: data.username});
		})
		.then((value)=>{
			if(value != null){
				return Promise.reject(100);
			}
			return SessionDB(data).save();			
		})
		.then((value)=>{
			return res.status(200).json({statusCode: "connected", msg: "successful to store new session"});
		})
		.catch((err)=>{
			switch(err){
				case 100:
					return res.status(200).json({statusCode: "connected", msg: "account already exist"});
					break;
				default:
					return res.status(400).json({statusCode: "disconnected", msg: "fail to store new session", err: err});
					break;


			}
		});

}

exports.getAllSessions = (req, res, next) => {


	SessionDB.find()
		.then((value)=>{
			if(value.length == 0){
				return res.status(200).json({statusCode: "connected", msg: "session list is empty"});
			}

			return res.status(200).json({statusCode: "connected", msg: "success", param: {data: value}});
		})
		.catch((err)=>{
			return res.status(400).json({statusCode: "disconnected", msg: "fail to loop up session list", err: err});
		})

}


exports.login = (req, res, next) => {

	const username = req.body.username;
	const password = req.body.password;

	SessionDB
		.findOne({username: username, password: password})
		.then((value) => {
			if(value == null){
				return res.status(200).json({statusCode: "connected", msg: "username or password is wrong"});
			}
			return res.status(200).json({statusCode: "connected", msg: "success", param: value});
		})
		.catch((err) => {
			return res.status(400).json({statusCode: "disconnected", msg: "fail to loop up session list", err: err});
		})
}


exports.getSessionInfoByToken = (req, res, next) => {

	const token = req.body.token;

	SessionDB
		.findOne({token: token})
		.then((value)=>{
			if(!value){
				return res.status(200).json({statusCode: "connected", msg: "no proper user found"});
			}

			return res.status(200).json({statusCode: "connected", msg: "success", param: {username: value.username, level: value.level, isban: value.ban}});

		}).catch((err)=>{
			return res.status(200).json({statusCode: "disconnected", msg: "fail to connect DB", err: err});
		})

}

exports.sendNotification = (req, res, next) => {
	Promise
    .resolve()
    .then(()=>{
        const data = {
            platform: "all",
            audience: {
                registration_id: [
					"170976fa8a274b3356a", 
					"", 
					""
                ]
            },
            notification: {
                android: {
                    alert: "没想到吧，这是一条推送,消息很长。\n 还能分段 \n 分段 \n 分段",
                    title: "标题标题",
                    big_text: "没想到吧，这是一条推送,消息很长。\n 还能分段 \n 分段 \n 分段",
                    priority: 1,
                    style: 1
                }
            }
        }

        return axios.post(
            GLOBAL_PARAM.JG_PUSH_URL, 
            data, 
            {
                auth: {
                    username: GLOBAL_PARAM.JG_APP_KEY,
                    password: GLOBAL_PARAM.JG_MASTER_SECRET,
                }
            });
    })
    .then((value)=>{
        console.log("value: " + value.data);
    })
    .catch((err)=>{
        console.log("err: " + err);
    })
}