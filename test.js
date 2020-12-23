const token = require("./lib/component/token.js");


// const leng = 32;
// var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789';
// var token = "";

// for (let i=0; i<leng; ++i) {
// 	token += chars.charAt(Math.floor(Math.random()*chars.length));
// }
// 
var result = token.getToken();

console.log(token.getToken()); 