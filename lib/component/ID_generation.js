function getNewID(title){
    const leng = 15;
    var chars = 'AMNdefhijkm4789';
    var res = "";
    const timestamp = parseInt(Date.now());

	for (let i=0; i<leng; ++i) {
		res += chars.charAt(Math.floor(Math.random()*chars.length));
	}

	let ID;

	if(title){
		ID = title+res+timestamp;
	} else {
		ID = res+timestamp;
	}


	return ID;
}

module.exports = {

	getNewID

}