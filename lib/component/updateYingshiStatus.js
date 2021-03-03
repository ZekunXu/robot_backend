const axios = require("axios");
const YingshiCamDB = require("../db/yingshi_cam.js");
const RobotInfoDB = require("../db/robot.js");
const querystring = require("querystring"); // 使用 querystring.stringify 可以让 axios 处理 x-www-form-urlencoded format
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


/// 此文档用来循环获取账号下萤石摄像头的在线状态。
/// 对于大白机器人来说，它的在线/离线状态将暂时由所带的萤石摄像头来管理。
/// 1. 通过接口获取 token，


async function intervalFunc() {

    Promise
        .resolve()
        .then(() => {

            const appKey = "2a4f0a62fbba4ed2889bd4c12de91859";

            return YingshiCamDB.findOne({appKey: appKey});

        })
        .then(async function (value) {

            var accessToken;

            if(!value){
                throw "100";
            }

            if(!value.accessToken || (value.expireTime - Date.now() < 0)){

                console.log("-------------"+111);

                const dataForm = {
                    appKey: value.appKey,
                    appSecret: value.appSecret
                }

                const res = await axios.post("https://open.ys7.com/api/lapp/token/get", querystring.stringify(dataForm));

                await YingshiCamDB.findOneAndUpdate({appKey: value.appKey}, {accessToken: res.data.data.accessToken, expireTime: res.data.data.expireTime}, {new: true}, (err, value)=>{
                    if(err){
                        throw "101";
                    }

                    accessToken = value.accessToken;
                })

            }else{
                accessToken = value.accessToken
            }

            return axios.post(
                "https://open.ys7.com/api/lapp/device/list",
                querystring.stringify({accessToken: accessToken})
            );
        })
        .then(async function (value){

            var deviceList = value.data.data;

            for (var i = 0; i < deviceList.length; i++) {

                await RobotInfoDB.findOneAndUpdate({ hardwareID: deviceList[i].deviceSerial }, {
                    status: {
                        status: deviceList[i].status == 0 ? "offline" : "online", timestamp: Date.now()
                    }
                }, {new: true}, (err, doc)=>{
                    if(err){
                        throw "102";
                    }
                })
            }
        })
        .catch((err) => {
            switch(err){
                case "100":
                    console.log("没有符合的appKey");
                    break;
                case "101":
                    console.log("accessToken 或者 expireTime 更新失败");
                    break;
                case "102":
                    console.log("摄像头最新状态获取和数据库更新失败。")
                default:
                    console.log("err: " + err);
                    break;
            }
        })
}

exports.setInterval = setInterval(intervalFunc, 12000);