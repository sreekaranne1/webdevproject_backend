var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var review = new Schema({
  uid: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  gameid: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
  },
  role: {
    type: String,
  },
  dateOfReview: { type: Date, default: () => Date.now() },
});

var userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  profile_pic: {
    type: String,
  },
  cover_pic: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  location: String,
  dob: String,
  doj: { type: Date, default: () => Date.now(), immutable: true },
  following_list: [{ type: mongoose.ObjectId, ref: "User" }],
  followers_list: [{ type: mongoose.ObjectId, ref: "User" }],
  activity: [{ type: mongoose.ObjectId, ref: "Activity" }],
  createdGames: [{ type: mongoose.ObjectId, ref: "CreatedGames" }],
  likes: [{ type: mongoose.ObjectId, ref: "Game" }],
  following_count: Number,
  followers_count: Number,
});

var createdGames = new Schema({
  uid: { type: mongoose.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  background_image: {
    type: String,
  },
  genres: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stores: {
    type: Array,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
});
var detailsSchema = new Schema({
  gameid: {
    type: Number,
    unique: true,
    required: true,
  },
  gamename: {
    type: String,
    required: true,
  },
  gameImage: String,
  likes: [{ type: mongoose.ObjectId, ref: "User" }],
  reviews: [{ type: mongoose.ObjectId, ref: "Review" }],
});

var favritesSchema = new Schema({
  uid: { type: mongoose.ObjectId, ref: "User" },
  gameid: {
    type: Number,
    required: true,
  },
  gamename: {
    type: String,
    required: true,
  },
  gameImage: String,
});

var activitySchema = new Schema({
  uid: { type: mongoose.ObjectId, ref: "User" },
  gameid: {
    type: Number,
    required: true,
  },
  gamename: {
    type: String,
    required: true,
  },
  gameImage: String,
  liked: Boolean,
  review: { type: mongoose.ObjectId, ref: "Review" },
  date: Date,
});

const User = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", detailsSchema);
const Activity = mongoose.model("Activity", activitySchema);
const Favorite = mongoose.model("Favorite", favritesSchema);
const Review = mongoose.model("Review", review);
const CreatedGames = mongoose.model("CreatedGames", createdGames);
module.exports = {
  User,
  Game,
  Activity,
  Favorite,
  Review,
  CreatedGames,
};
