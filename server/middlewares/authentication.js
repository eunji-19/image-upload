const mongoose = require("mongoose");
const UserSchema = require("../models/user");

const authentication = async (req, res, next) => {
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) next();
  const user = await UserSchema.findOne({ "sessions._id": sessionid });
  if (!user) next();
  req.user = user;
  next();
};

module.exports = { authentication };
