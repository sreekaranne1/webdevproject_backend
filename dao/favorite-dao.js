const axios = require("axios");
const { User, Favorite } = require("../models/models.js");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const jwt = require("jsonwebtoken");

exports.addFavoriteDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let favorite = await Favorite.findOne({
        uid: req.user.id,
        gameid: req.body.gameid,
      });
      if (favorite) {
        return res.json({
          status: 404,
          msg: "User Already Favorited this game",
        });
      } else {
        gamedetails = await apicall(req.body.gameid);
        favorite = {
          uid: req.user.id,
          gameid: req.body.gameid,
          gamename: gamedetails.gamename,
          gameImage: gamedetails.gameImage,
        };
        favorite = await Favorite.create(favorite);
        if (favorite._id) {
          req.user.call = true;
          let favorites = await this.getFavoritesDao(req, res, next);
          return res.json({
            status: 200,
            msg: "success",
            favorites: favorites,
          });
        } else {
          return res.json({
            status: 500,
            msg: "Add to favorites failed",
          });
        }
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does't exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.removeFavoriteDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let favorite = await Favorite.deleteOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      if (favorite.deletedCount == 1) {
        req.user.call = true;
        let favorites = await this.getFavoritesDao(req, res, next);
        return res.json({
          status: 200,
          msg: "success",
          favorites: favorites,
        });
      } else {
        return res.json({
          status: 500,
          msg: "deletion failed",
        });
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does't exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getFavoritesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let favorites = await Favorite.find({
        uid: user._id,
      });

      if (favorites) {
        if (req.user.call) {
          return favorites;
        } else {
          return res.json({
            status: 200,
            msg: "success",
            data: favorites,
          });
        }
      } else {
        if (req.user.call) {
          return [];
        } else {
          return res.json({
            status: 200,
            msg: "User has no favorites",
            data: [],
          });
        }
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does't exist",
      });
    }
  } catch (err) {
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
    return {
      error: false,
      gamename: response.data.name,
      gameImage: response.data.background_image,
    };
  } else {
    return { error: true };
  }
};
