const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const router = require("./router.js");
const WebSocket = require("ws");
const db = require("./lib/db/websocket_data.js");
const MongoClient = require("mongodb").MongoClient;
const getWWUrls = require("./lib/component/getWWUrls.js");
const checkInfraredStatus = require("./lib/component/checkInfraredStatus.js");
const updateYingshiStatus = require("./lib/component/updateYingshiStatus.js");

// http sever
var http_server = http.createServer(app);


/**
 * 配置使用 session
 */

app.use(session({
  secret: 'victor', //配置加密字符串
  resave: true,
  saveUninitialized: true, // 无论是否使用 Session，都会默认分配一把钥匙
}));


//配置post请求
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));


// 公共访问链接
app.use('/assets',express.static(path.join(__dirname,'./assets/')));


//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin",'http://www.chenkeai.com');
    // res.header("Access-Control-Allow-Origin",'http://localhost');
    //允许的header类型
    res.header("Access-Control-Allow-Headers","Content-Type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Content-Type", "application/x-www-form-urlencoded");
    res.header("Set-Cookie", "SameSite=None; Secure");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
})


app.get('/', (req, res, next) => {
	res.send("Server Starting at port: 3001");
})

app.get('/upload', (req, res, next) => {
  
  fs.readFile('./lib/pages/upload_app.html', (err, data)=>{
    if(err){
      throw err;
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})


// 起用 路由
app.use(router);



http_server.listen(3001, () =>{
	console.log('App is running at port 3001.')

})

//启动定时更新 url 的任务
getWWUrls.setInterval;
checkInfraredStatus.setInterval;
// updateYingshiStatus.setInterval;