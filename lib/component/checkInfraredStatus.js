const axios = require("axios");
const InfraredInfoDB = require("../db/infrared_info.js");


async function intervalFunc () {

	var IDList = ["MJ9499E38E0D84"];

    const url = "https://m.hulian100.cn/addons/hlwj_sq/api/door/devicestatus.php";
    
    Promise
        .resolve()
        .then(()=>{

            var data = { id: IDList };

            return axios.post(url, data);
        })
        .then(async (res)=>{
            for(var i=0; i<res.data.num; i++){

                var status = res.data.info[i].code == 0 ? "oneline" : "offline"; 

               await InfraredInfoDB.findOneAndUpdate({hardwareID: res.data.info[i].id}, {status: status});
            }
        })
        .then(()=>{
            // console.log("红外报警器信息更新成功");
        })
        .catch((err)=>{
            // console.log("红外报警器更新失败，err：" + err);
        })

}


exports.setInterval = setInterval(intervalFunc, 5000);