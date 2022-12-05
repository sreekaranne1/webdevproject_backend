//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const { createGame } = require("../controllers/gamesController");

// //Route config
router.route("/creategame").get(auth, getactivities);
// router.route("/search").post(auth,searchGame);
// router.route("/logout").get(auth,logout);
// router.route("/game/:id").get(auth, getGame)

module.exports = router;
