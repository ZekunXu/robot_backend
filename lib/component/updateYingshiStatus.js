const axios = require("axios");
const YingshiCamDB = require("../db/yingshi_cam.js");
const RobotInfoDB = require("../db/robot.js");
const querystring = require("querystring"); // 使用 querystring.stringify 可以让 axios 处理 x-www-form-urlencoded format
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const DeviceDB = require('../db/device.js');
const GLOBAL_PARAM = require('../global_param.js');


/// 此文档用来循环获取账号下萤石摄像头的在线状态。
/// 对于大白机器人来说，它的在线/离线状态将暂时由所带的萤石摄像头来管理。
/// 1. 通过接口获取 token，


async function intervalFunc() {

    Promise
        .resolve()
        .then(() => {

            /**
             * 1. 从数据库找到对应的项目信息。
             */
            const appKey = "2dc504a81688468691d38e81dbefad56";

            return YingshiCamDB.findOne({appKey: appKey});

        })
        .then(async function (value) {

            /**
             * 获取当前项目的 accessToken。
             * 如果数据库里没有 accessToken，或者 token 已经过期，则先获取信息的 token 和日期，存下来。
             */

            var accessToken;

            if(!value){
                throw "100";
            }

            if(!value.accessToken || !value.expireTime || (value.expireTime - Date.now() < 0)){

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

            // 访问萤石设备列表 api，获取萤石账户下的设备列表。
            return axios.post(
                "https://open.ys7.com/api/lapp/device/list",
                querystring.stringify({accessToken: accessToken})
            );
        })
        .then(async function (value){

            // 我们将萤石设备的在线状态，更新到 DeviceDB里。
            // 这里我们需要做一个判断，如果和之前的状态不同，我们就通知 service 处理状态变更。
            // 如果状态相同，就继续

            var deviceList = value.data.data;

            for (var i = 0; i < deviceList.length; i++) {

                await DeviceDB.findOne({ hardwareID: deviceList[i].deviceSerial })
                              .then(async function (value) {

                                let status = deviceList[i].status == 0 ? "offline" : "online";


                                if(value._doc.status.status != status){

                                    const num = await axios.post(
                                        "http://localhost:3000/api/deviceDB/updateMany", 
                                        {
                                            hardwareID: value._doc.hardwareID,
                                            data: {
                                                status: {
                                                    status: status,
                                                    timestamp: Date.now()
                                                }
                                            }
                                        },
                                        {
                                            headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
                                        }
                                    );
                                }

                              })
                              .catch((err)=>{
                                  console.log(`err ${err}`)
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