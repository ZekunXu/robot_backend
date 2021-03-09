const RobotInfoDB = require("../db/robot.js");
const StaredDeviceListDB = require("../db/stared_device_list");

/**
 * 固定设备页首页的接口。
 * {
 *   programCode: String, 
 *   token: String, 
 *   type: String,
 * }
 */

exports.get