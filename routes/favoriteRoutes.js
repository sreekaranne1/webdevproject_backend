//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

//Routes config
router.route("/").get(auth, getFavorites).post(auth, addFavorite);

router.route("/:gameid").delete(auth, removeFavorite);

module.exports = router;
