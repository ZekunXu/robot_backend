
// 弹窗接口
var json = {
    "statusCode": "connected",
    "msg": "success",
    "param": [
        {
            "programName": "IFS 国金中心",
            "programCode": "IFS",
            "GPSLocation": {
                "latitute": 20.0,
                "longitude": 108.123
            },
            "devices": [
                {
                    "hardwareType": "wwwRobot",
                    "hardwareName": "万维机器人",
                    "count": 4
                },
                {
                    "hardwareType": "HaikangWebCam",
                    "hardwareName": "固定摄像头",
                    "count": 20,
                }
            ]
        },
        {
            "programName": "乔庄社区 56号",
            "programCode": "QZSQ",
            "GPSLocation": {
                "latitute": 20.0,
                "longitude": 108.123
            },
            "devices": [
                {
                    "hardwareType": "Robot",
                    "hardwareName": "市井机器人",
                    "count": 1
                },
                {
                    "hardwareType": "HaikangWebCam",
                    "hardwareName": "固定摄像头",
                    "count": 20,
                }
            ]
        },
    ]
}


//首页加载接口
// request api
var json = {
    "programCode": "IFS",
}

// response api
var json = {
    "statusCode": "",
    "msg": "",
    "param": [
        {

        },
        {
            
        }
    ]
}