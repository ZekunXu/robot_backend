const axios = require("axios");
const querystring = require("querystring"); // 使用 querystring.stringify 可以让 axios 处理 x-www-form-urlencoded format
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

Promise
    .resolve()
    .then((value)=>{
        
        const url = "http://localhost:5000/frame"
        const img = "https://rtmp01open.ys7.com:9188/v3/openlive/D00305745_1_2.flv?expire=1620444850&id=310741096896950272&t=9d1bf74364a6686e7597d03d6e59bb5e384dc75f061130c0d92e8c8dbc4f1a1f&ev=100";

        return axios.post(url, {img: img})

    }).then((value)=>{
        if(!value.data){
            throw 101;
        }

        const url2 = "https://open.ys7.com/api/lapp/intelligence/human/analysis/detect";

        var reqData = {
            accessToken: "at.2xjbj30f4o9j72xh52qdihz1bamcfbfw-6m2iesrf8u-0yzciqr-u1bep0ptv",
            dataType: 1,
            image: value.data
        }

        return axios.post(url2, reqData)

    })
    .then((value)=>{
        console.log(value.data)
    })
    .catch((err)=>{
    })