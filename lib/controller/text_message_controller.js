const axios = require('axios');


exports.codeCallback = (req, res, next) => {

	const data = req.body;
	const url = 'http://localhost:3000/auth/verify/callback';


	axios.post(url, data).then((value)=>{})
    

    return res.status(200).send(req.body);

}