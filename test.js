// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var moment = require('moment');

// mongoose.connect('mongodb://localhost/robot');

// var webCamUrlSchema = new Schema({
// 	camType: {type: String, required: true}, 
// 	mainUrl: {
// 		url: {type: String, required: true},
// 	}, 
// });


// //导出模型构造函数
// var DB = mongoose.model('webCamUrl', webCamUrlSchema);

// var data = {
// 	camType: "normal", 
// 	mainUrl: {
// 		url: "https://",
// 	},
// };

// new DB(data).save().then(() => console.log("存储成功"));