const axios = require("axios");
const querystring = require("querystring"); // 使用 querystring.stringify 可以让 axios 处理 x-www-form-urlencoded format
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

var a=0;

async function test () {

while(true){
    var raw_img;

    const a = Promise
        .resolve()
        .then((value)=>{
            
            const url = "http://localhost:5000/frame"
            const img = "https://rtmp01open.ys7.com:9188/v3/openlive/D00305745_1_2.flv?expire=1620444850&id=310741096896950272&t=9d1bf74364a6686e7597d03d6e59bb5e384dc75f061130c0d92e8c8dbc4f1a1f&ev=100";

            return axios.post(url, {img: img})

        }).then((value)=>{
            if(!value.data.img){
                console.log("获取直播图片数据失败")
                throw 100;
            }

            raw_img = value.data.img;

            const url2 = "https://open.ys7.com/api/lapp/intelligence/human/analysis/detect";

            const reqData = {
                accessToken: "at.2xjbj30f4o9j72xh52qdihz1bamcfbfw-6m2iesrf8u-0yzciqr-u1bep0ptv",
                dataType: 1,
                image: value.data.img
            }

            return axios.post(url2, querystring.stringify(reqData))

        })
        .then((value)=>{
            
            if(!value.data.data.exists){
                console.log('图片没有人形');
                throw 101;
            }

            console.log('图片有人形');

            const url3 = "https://open.ys7.com/api/lapp/intelligence/face/analysis/detect";

            const dataForm = {
                accessToken: "at.2xjbj30f4o9j72xh52qdihz1bamcfbfw-6m2iesrf8u-0yzciqr-u1bep0ptv",
                dataType: 1,
                image: raw_img
            }

            return axios.post(url3, querystring.stringify(dataForm))

        })
        .then((value)=>{
            if(!value.data.data){
                console.log("没有检测到完整人脸")
                throw 102;
            }


            const url4 = "http://localhost:5000/crop";

            const form = {
                img: raw_img,
                x: value.data.data.faces[0].location.x,
                y: value.data.data.faces[0].location.y,
                width: value.data.data.faces[0].location.width,
                height: value.data.data.faces[0].location.height
            }

            return axios.post(url4, form)

        })
        .then((value)=>{
            console.log(value.data.img)

            return 0;
        })
        .catch((err)=>{

            console.log(err)

            return 0;

        })
}

}

test()