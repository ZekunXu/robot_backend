const axios = require("axios");
const querystring = require("querystring"); // 使用 querystring.stringify 可以让 axios 处理 x-www-form-urlencoded format
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const GLOBAL_PARAM = require('../global_param.js');
const download = require("download");
const moment = require('moment');

/**
 * 用来定时循环获取萤石账户的告警消息。
 * 1. 遍历yingshiDB，获取accessToken.
 * 2. 根据 token，获取账户下所有的历史消息的最近20条。
 * 3. 遍历消息。将消息按照我们的格式存到数据库中。
 * 4. 将最新的 alarm_id 存到 yingshiDB 中，下一次遍历的时候首先比对。
 */

async function gogogo(access_token, latestAlarmID) {

    await Promise
        .resolve()
        .then(async ()=>{

            let dataForm = {
                accessToken: access_token,
                status: 2,
                alarmType: -1,
                pageSize: 21,
                endTime: Date.now()
            };

            return axios.post(
                "https://open.ys7.com/api/lapp/alarm/list",
                querystring.stringify(dataForm)
            ); 
        })
        .then(async (value)=>{

            if(value.data.data.length == 0 ) {
                throw 100;
            }

            let msgList = value.data.data;

            for(let i=0 ; i<msgList.length ; i++) {
                if(msgList[i].alarmId == latestAlarmID){ //如果数据库里存储的最新 alarmID 和这个相符, 则结束这个循环
                    break;
                }
                
                /**
                 * 我们在这里更新具体的消息信息。
                 * 首先，我们根据消息类型，将消息转换为 imgMsg 能够接受的信息，然后传给数据库。
                 */

                const filename = moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 100000) + ".png";

                await download(msgList[i].alarmPicUrl, './assets/yingshiImg', {filename: filename});

                let imgMsgInfo = {
                    imgType: "personReport",
                    url: "/assets/yingshiImg/" + filename,
                    reportHardwareId: msgList[i].deviceSerial
                }

                // 最后，将数据发送到 imgMsgDB 数据库中
                await axios.post(
                    'http://localhost:3000/api/imgMsgDB/insert',
                    imgMsgInfo,
                    {
                        headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
                    }
                );

            }

            //我们需要将数据库中的 latestAlarmID 更新为最新的.
            //方法就是取第一个 id，更新过去
            if(latestAlarmID == " " || msgList[0].alarmId != latestAlarmID){

                await axios.post(
                    "http://localhost:3000/api/YingshiSessionDB/updateMany",
                    {
                        accessToken: access_token,
                        data: {
                            latestAlarmID: msgList[0].alarmId
                        }
                    },
                    {
                        headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
                    }
                );

            }
        })
        .catch((err)=>{

        })
}


async function getYingshiMsg () {

    const yingshiSessionList = await axios.post(
        "http://localhost:3000/api/YingshiSessionDB/find",
        {},
        {
            headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
        }
    );

    for(let i=0 ; i<yingshiSessionList.data.length ; i++) {

        await gogogo(
            yingshiSessionList.data[i].accessToken,
            yingshiSessionList.data[i].latestAlarmID ? yingshiSessionList.data[i].latestAlarmID : " "
            );
    }

}

exports.setInterval = setInterval(getYingshiMsg, 60000);  //每一分钟执行一次