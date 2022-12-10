const { User } = require("../models/models.js");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config({ path: "../.env" });

exports.getactivitiesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id })
      .populate("activity")
      .lean();
    if (user) {
      let activities = user.activity;
      let sortedActivities = activities.sort((a, b) => b.date - a.date);
      //api to get rating
      for (const i in sortedActivities) {
        sortedActivities[i]["rating"] = await apicall(
          sortedActivities[i].gameid
        );
      }
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

const apicall = async (gameid) => {
  let response = await axios.get(
    "https://api.rawg.io/api/games/" +
      gameid +
      "?key=f227150707ad40b08b9a626750b0564b"
  );
  if (response.status == 200) {
    return response.data.rating;
  } else {
    return { error: true };
  }
};
