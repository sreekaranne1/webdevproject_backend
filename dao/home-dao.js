const { User } = require("../models/models.js");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

exports.getactivitiesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id }).populate("activity");
    if (user) {
      let activities = user.activity;
      let sortedActivities = activities.sort((a, b) => b.date - a.date);
      if (sortedActivities.length < 3) {
        return res.json({
          status: 200,
          msg: "success",
          data: sortedActivities,
        });
      } else {
        return res.json({
          status: 200,
          msg: "success",
          data: sortedActivities.slice(0, 3),
        });
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does not exist",
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};
