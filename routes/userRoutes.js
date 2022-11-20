//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  searchUser,
  checkUserName,
} = require("../controllers/userController");

//Routes config
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile/:uid").get(getUser).post(auth, updateProfile);
router.route("/follow").post(auth, followUser);
router.route("/unfollow").post(auth, unFollowUser);
router.route("/getfollowers/:uid").get(getFollowers);
router.route("/getfollowing/:uid").get(getFollowing);
router.route("/searchuser/:search").get(searchUser);
router.route("/checkusername/:search").get(checkUserName);

// router.route("/profile/following/:uid").get(auth, getFollowing);
// router.route("/profile/follower/:uid").get(auth, getFollowers);
// router.route("/profile/follow/:uid").get(auth, followUser);

module.exports = router;
