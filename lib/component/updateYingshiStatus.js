const axios = require("axios");
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

            const data1 = {
                appKey: "2a4f0a62fbba4ed2889bd4c12de91859",
                appSecret: "b5b70d7804648e5553326d46fd9c5469",
            }

            return axios.post(
                "https://open.ys7.com/api/lapp/token/get", querystring.stringify(data1)
            );
        })
        .then((value) => {

            const data2 = {
                accessToken: value.data.data.accessToken
            }

            return axios.post(
                "https://open.ys7.com/api/lapp/device/list",
                querystring.stringify(data2)
            )
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
                        throw err;
                    }
                    console.log("更新了" + doc.hardwareID);
                })
            }
        })
        .catch((err) => {
            console.log("err: " + err);
        })
}

exports.setInterval = setInterval(intervalFunc, 12000);