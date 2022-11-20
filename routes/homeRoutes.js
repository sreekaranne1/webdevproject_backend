//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  getactivities,
  // searchGame,
  // logout,
  // getGame
} = require("../controllers/homeController");

// //Route config
router.route("/activities").get(auth, getactivities);
// router.route("/search").post(auth,searchGame);
// router.route("/logout").get(auth,logout);
// router.route("/game/:id").get(auth, getGame)

module.exports = router;
