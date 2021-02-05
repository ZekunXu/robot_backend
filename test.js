
const axios = require("axios");
const GLOBAL_PARAM = require(("./lib/global_param.js"));

Promise
.resolve()
.then(()=>{
    const data = {
        platform: "all",
        audience: {
            registration_id: [
                "dsadsdas"
            ]
        },
        notification: {
            android: {
                alert: "abc",
                title: "",
                big_text: "",
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
    console.log("发送了一条通知: " + JSON.stringify(value.data));
})
.catch((err)=>{
    console.log("err: " + err);
})