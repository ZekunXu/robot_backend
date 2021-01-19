const { findOne, findOneAndUpdate } = require("../db/robot.js");
const RobotInfoDB = require("../db/robot.js");

exports.saveData = (req, res, next) => {

	var data = req.body;

	RobotInfoDB(data)
		.save()
		.then((value) => {
			return res.status(200).json({ msg: "success", value: value });
		})
		.catch((err) => {
			return res.status(404).json({ msg: "fail", err: err });
		})

}


exports.updateRobotStatus = (req, res, next) => {

	var data = req.body;

	var hardwareID = data.robotId;

	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.findOneAndUpdate({ hardwareID: hardwareID }, {
				status: {
					status: data.selfStatus.status,
					timestamp: Date.now()
				},
				realtimeStatus: {
					realtimeStatus: data.selfStatus.realtimeStatus,
					timestamp: Date.now()
				},
				power: {
					percentage: data.selfStatus.power.selfPower,
					timestamp: Date.now()
				}
			});

		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "info updated!", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server" });
		})
}

exports.updateRobotLocation = (req, res, next) => {

	var data = req.body;

	var hardwareID = data.robotId;

	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.findOneAndUpdate({ hardwareID: hardwareID }, {
				location: {
					longitude: data.selfStatus.GPSInformation.longtitude,
					latitude: data.selfStatus.GPSInformation.latitude,
					altitude: data.selfStatus.GPSInformation.altitude,
					timestamp: Date.now
				}
			})
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "info updated!", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server" });
		})

}


exports.updateSmokeInfo = (req, res, next) => {
	var data = req.body;

	var hardwareID = data.robotId;

	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.findOneAndUpdate({ hardwareID: hardwareID }, {
				smoke: {
					coordinate: data.smoke.coordinate,
					timestamp: Date.now()
				}
			})
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server", err: err });
		});
}

exports.getRobotStatusByID = (req, res, next) => {
	var hardwareID = req.body.hardwareID;

	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.findOne({ hardwareID: hardwareID })
		})
		.then((value) => {
			if (value == null) {
				return res.status(200).json({ statusCode: "connected", msg: "no such robot data" });
			}

			return res.status(200).json({
				statusCode: "connected", msg: "success",
				data: {
					hardwareID: value.hardwareID,
					name: value.name,
					status: value.status.status,
					realtimeStatus: value.realtimeStatus.realtimeStatus,
				}
			});
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server" });
		});
}

exports.getAllRobotStatus = (req, res, next) => {
	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.find();
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server" });
		})
}

exports.updateOnlineOfflineById = (req, res, next) => {

	var data = req.body;

	console.log(data);

	Promise
		.resolve()
		.then(() => {
			return RobotInfoDB.findOneAndUpdate({ hardwareID: data.hardwareID }, {
				status: {
					status: data.status,
					timestamp: Date.now()
				}
			});
		})
		.then((value) => {
			return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
		})
		.catch((err) => {
			return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server", err: err });
		})
}