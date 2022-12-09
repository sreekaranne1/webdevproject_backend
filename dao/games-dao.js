const { User, CreatedGames } = require("../models/models.js");

exports.createGameDao = async (req, res, next) => {
  try {
    let game = {
      uid: req.user.id,
      name: req.body.name,
      genres: req.body.genres,
      description: req.body.description,
      stores: req.body.stores,
      // background_image: req.body.background_image,
      background_image: req.body.background_image
        ? req.body.background_image
        : "https://webdevs3bucket.s3.us-west-2.amazonaws.com/defaultcoverpic.jpg",
      handle: req.body.handle,
    };
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      if (user.role == "creator") {
        game = await CreatedGames.create(game);
        if (game._id) {
          user.createdGames.push(game._id);
          user = await user.updateOne({
            createdGames: user.createdGames,
          });
          if (user.acknowledged) {
            user = await User.findOne({
              _id: req.user.id,
            })
              .populate("createdGames")
              .lean();
            return res.json({
              status: 200,
              msg: "success",
              createdGames: user.createdGames,
            });
          } else {
            return res.json({
              status: 400,
              msg: "User Update failed",
            });
          }
        } else {
          return res.json({
            status: 404,
            msg: "Create Game failed",
          });
        }
      } else {
        return res.json({
          status: 404,
          err: "failed",
          msg: "Not authorized to create game",
        });
      }
    } else {
      return res.json({
        status: 404,
        err: "failed",
        msg: "user doesnot exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.updateGameDao = async (req, res, next) => {
  try {
    await CreatedGames.findByIdAndUpdate(req.body.cgameid, req.body).then(
      async (game) => {
        if (game) {
          user = await User.findOne({
            _id: req.user.id,
          })
            .populate("createdGames")
            .lean();
          return res.json({
            status: 200,
            msg: "success",
            createdGames: user.createdGames,
          });
        } else {
          return res.json({
            status: 404,
            updated: false,
            msg: "game does not exist",
          });
        }
      }
    );
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.deleteGameDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user && user.role == "creator") {
      let game = await CreatedGames.deleteOne({
        _id: req.params.cgameid,
      });
      if (game.deletedCount == 1) {
        user.createdGames = user.createdGames.filter(
          (e) => e.toString() != req.params.cgameid
        );
        user = await user.updateOne({
          createdGames: user.createdGames,
        });
        if (user.acknowledged) {
          user = await User.findOne({
            _id: req.user.id,
          })
            .populate("createdGames")
            .lean();
          return res.json({
            status: 200,
            msg: "success",
            createdGames: user.createdGames,
          });
        } else {
          return res.json({
            status: 500,
            msg: "Internal Error",
          });
        }
      } else {
        return res.json({
          status: 500,
          msg: "deletion failed",
        });
      }
    } else {
      return res.json({
        status: 404,
        err: "error",
        msg: "not authorized to delete",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};
exports.getCreatedGamesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user && user.role == "creator") {
      let myGames = await CreatedGames.find({ uid: req.user.id });
      if (myGames) {
        return res.json({
          status: 200,
          msg: "success",
          games: myGames,
        });
      } else {
        return res.json({
          status: 200,
          msg: "success",
          games: [],
        });
      }
    } else {
      return res.json({
        status: 404,
        err: "error",
        msg: "not authorized",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getGamesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user && (user.role == "creator" || user.role == "streamer")) {
      let myGame = await CreatedGames.findOne({
        _id: req.params.cgameid,
      }).lean();
      let user = await User.findOne({ _id: myGame.uid });
      myGame.cretorFirstName = user.firstname;
      myGame.creatorLastName = user.lastname;
      myGame.creatorImage = user.profile_pic;
      if (myGame) {
        return res.json({
          status: 200,
          msg: "success",
          games: myGame,
        });
      } else {
        return res.json({
          status: 404,
          msg: "game not found",
        });
      }
    } else {
      return res.json({
        status: 404,
        err: "error",
        msg: "not authorized",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.searchCreatedGamesDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    const { search } = req.params;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);
    if (user && (user.role == "creator" || user.role == "streamer")) {
      games = await CreatedGames.find({
        name: { $regex: searchRgx, $options: "i" },
      })
        .lean()
        .limit(10);

      res.json({ status: 200, gamesData: games });
    } else {
      return res.json({
        status: 404,
        err: "error",
        msg: "not authorized to search",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.checkHandleGamesDao = async (req, res, next) => {
  try {
    const game = await CreatedGames.findOne({ handle: req.params.handle });
    console.log("game", game);
    if (game) {
      return res.json({ status: 200, available: false });
    } else {
      return res.json({ status: 200, available: true });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};
