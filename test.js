{
    "camType": "ldRobot",
    "name": "蓝帄小车前置摄像头",
    "hardwareID": "LD001",
    "version": "1.0",
    "param": {
        "haiKangCam": {
            "HDFlv": "https://flvopen.ys7.com:9188/openlive/fc06ca5771e84b5583cbc5e35bdde861.hd.flv",
            "SDFlv": "https://flvopen.ys7.com:9188/openlive/fc06ca5771e84b5583cbc5e35bdde861.flv",
            "HDRtmp": "rtmp://rtmp01open.ys7.com/openlive/fc06ca5771e84b5583cbc5e35bdde861.hd",
            "SDRtmp": "rtmp://rtmp01open.ys7.com/openlive/fc06ca5771e84b5583cbc5e35bdde861"
        }
    }
}


db.webCamUrl.insert({
    camType: "wwRobot",
    name: "7楼巡逻小黑",
    hardwareID: "19WV430010",
    version: "v1.0",
    param: {
        robotCam: {
            leftRtmp: "rtmp://www.anbotcloud.com:1936/live/19WV430010/left/3a00749469eb4d13ba6e39156d47a0ca",
            frontRtmp: "rtmp://www.anbotcloud.com:1936/live/19WV430010/front/3a00749469eb4d13ba6e39156d47a0ca",
            rightUrl: "https://www.anbotcloud.com:443/live/19WV430010/right/3a00749469eb4d13ba6e39156d47a0ca.flv",
            backUrl: "https://www.anbotcloud.com:443/live/19WV430010/back/3a00749469eb4d13ba6e39156d47a0ca.flv",
            leftUrl: "https://www.anbotcloud.com:443/live/19WV430010/left/3a00749469eb4d13ba6e39156d47a0ca.flv",
            backRtmp: "rtmp://www.anbotcloud.com:1936/live/19WV430010/back/3a00749469eb4d13ba6e39156d47a0ca",
            rightRtmp: "rtmp://www.anbotcloud.com:1936/live/19WV430010/right/3a00749469eb4d13ba6e39156d47a0ca",
            frontUrl: "https://www.anbotcloud.com:443/live/19WV430010/front/3a00749469eb4d13ba6e39156d47a0ca.flv"
        }
    }
})