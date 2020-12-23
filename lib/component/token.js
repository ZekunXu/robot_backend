


function getToken(){
	const leng = 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789';
	var token = "";

	for (let i=0; i<leng; ++i) {
		token += chars.charAt(Math.floor(Math.random()*chars.length));
	}
	return token;
}

module.exports = {
	getToken
}