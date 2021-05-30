const GLOBAL_PARAM = require("../global_param.js");
const axios = require("axios");



exports.pushNotificationByRegisterId = ({registerIdList: registerIdList, title: title, big_text: big_text, alert: alert, style: style, big_pic_path: big_pic_path, extras: extras}) => {


    Promise
    .resolve()
    .then(async ()=>{

        var data;

        switch(style){
            case 0:
                break;
            case 1:
                data = {
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
                            style: style
                        }
                    }, 
                    extras: extras
                }
                break;
            case 2:
                break;
            case 3:
                data = {
                    platform: "all",
                    audience: {
                        registration_id: registerIdList
                    },
                    notification: {
                        android: {
                            alert: alert,
                            title: title,
                            big_pic_path: big_pic_path,
                            priority: 1,
                            style: style
                        },
                        extras: extras
                    }
                }
                break;
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
        console.log("value: " + JSON.stringify(value.data));
    })
    .catch((err)=>{
        console.log("err: " + err);
    })

}