//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");


//Import route functions
const router = express.Router();
const {
  s3urlControllers,

} = require("../controllers/imageController");

//Routes config

router.route("/s3Url/:name").get(s3urlControllers);

// router.route("/profile/following/:uid").get(auth, getFollowing);
// router.route("/profile/follower/:uid").get(auth, getFollowers);
// router.route("/profile/follow/:uid").get(auth, followUser);

module.exports = router;
