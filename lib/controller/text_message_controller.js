

exports.codeCallback = (req, res, next) => {

    var echostr = req.query.echostr;

    return res.status(200).send(echostr);

}