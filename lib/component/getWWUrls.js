const axios = require("axios");


async function intervalFunc () {

	var IDList = ["20WV450008", "19WV430010"];

	const url = "http://www.anbotcloud.com:8180/httpRequest";


	for (var i=0; i<IDList.length; i++){

		var data = {
			version: "1.0.0",
		    key: "1b8f1ebd1c88431a9a1f3b6d23229655",
		    module: "video",
		    function: "getCameraUrl",
		    requestId: "123",
		    param: {
		      robotId: IDList[i]
		    }
		};

		await axios
		.post(url, data)
		.then((res) => {
			var param = {
				hardwareID: IDList[i],
				param: {
					robotCam: res.data.param,
				}
			}

			return axios.post("http://www.chenkeai.com:3001/api/robot/webcams/update", param)
		})
		.then((res) => {
		})
		.catch((err) => {
			console.log("err: " + err);
		})

	}

}


exports.setInterval = setInterval(intervalFunc, 60000);