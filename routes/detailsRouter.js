//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();

const {
  likeGame,
  disLikeGame,
  addreview,
  deleteReview,
  updateReview,
  getdetails,
} = require("../controllers/detailsController");
//Routes config
router.route("/like/:gameid").get(auth, likeGame);
router.route("/dislike/:gameid").get(auth, disLikeGame);
router
  .route("/review/:gameid")
  .post(auth, addreview)
  .delete(auth, deleteReview)
  .put(auth, updateReview);
router.route("/getdetails/:gameid").get(getdetails);

module.exports = router;
