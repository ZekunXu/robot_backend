

exports.helloWorld = (req, res, next) => {

    console.log("aaaaaa")


    console.log(req.query)

    var echostr = req.query.echostr

    return res.status(200).send(echostr)
}