//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  createGame,
  updateGame,
  deleteGame,
  getCreatedGames,
  searchCreatedGames,
  getGames,
  checkHandleOfGame
} = require("../controllers/gamesController");

// //Route config
router.route("/createdgame").post(auth, createGame).put(auth, updateGame);
router.route("/deletegame/:cgameid").delete(auth, deleteGame);
router.route("/getcreatedgames").get(auth, getCreatedGames);
router.route("/getgame/:cgameid").get(auth, getGames);
router.route("/searchcreatedgames/:search").get(auth, searchCreatedGames);
router.route("/checkhandle/:handle").get(auth, checkHandleOfGame);

module.exports = router;
