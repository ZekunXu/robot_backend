



exports.getAllUrls = (req, res, next) => {

	var params = {
		url1: "aaa", 
		url2: "bbb", 
		url3: "ccc",
	};

	return res.status(200).json(params);

}