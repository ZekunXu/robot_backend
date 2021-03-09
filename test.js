//固定设备页面相关接口

//根据programCode和Type来返回对应的设备列表信息
//是否要区分常用的列表和其他？

//请求格式
var json = {
    programCode: "IFS",
    token: "999999",
    type: "WebCam" //EDoor, Infrared... Stars(用户添加的常用设备)
}

//返回格式
var json = {
    statusCode: "connected",
    msg: "success",
    param: [
        {
            hardwareType: "WebCam",
            status: {
                status: "online",
                timestamp: 1211111
            },
            hardwareID: "28367WW",
            name: "1楼窗户红外报警器",  
        },
        {
            hardwareType: "Infrared",
            status: {
                status: "online",
                timestamp: 1211111
            },
            hardwareID: "28367WW",
            name: "1楼窗户红外报警器",  
        },
    ]
}