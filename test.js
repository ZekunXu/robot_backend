const GLOBAL_PARAM = require("./lib/global_param.js");
const axios = require("axios");



Promise
    .resolve()
    .then(()=>{
        const data = {
            platform: "all",
            audience: {
                registration_id: [
                    "170976fa8a274b3356a"
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
            {data: data}, 
            {
                auth: {
                    username: GLOBAL_PARAM.JG_APP_KEY,
                    password: GLOBAL_PARAM.JG_MASTER_SECRET,
                }
            });
    })
    .then((value)=>{
        console.log("value: " + value);
    })
    .catch((err)=>{
        console.log("err: " + err);
    })