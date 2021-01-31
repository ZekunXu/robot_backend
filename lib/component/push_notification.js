const GLOBAL_PARAM = require("../global_param.js");
const axios = require("axios");



exports.pushNotificationByRegisterId = (registerIdList, title, big_text, alert) => {

    Promise
    .resolve()
    .then(()=>{
        const data = {
            platform: "all",
            audience: {
                registration_id: registerIdList
            },
            notification: {
                android: {
                    alert: alert,
                    title: title,
                    big_text: big_text,
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