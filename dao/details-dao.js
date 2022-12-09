const axios = require("axios");
const {
  User,
  Activity,
  Game,
  Review,
  Favorite,
} = require("../models/models.js");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const jwt = require("jsonwebtoken");

exports.likeGameDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let game = await Game.findOne({ gameid: req.params.gameid });
      activity = await Activity.findOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      if (game) {
      } else {
        game = await createGame(req.params.gameid);
      }
      if (game._id) {
        if (activity) {
        } else {
          activity = await createActivity(user._id, game);
        }
        if (activity._id) {
          if (!game.likes.find((e) => e.toString() == user._id.toString())) {
            game.likes.push(user._id);
          }
          game = await game.updateOne({ likes: game.likes });
          if (game.acknowledged) {
            const activityRes = await activity.updateOne({
              liked: true,
              date: Date.now(),
            });
            if (activityRes.acknowledged) {
              if (
                !user.activity.find(
                  (e) => e.toString() == activity._id.toString()
                )
              ) {
                user.activity.push(activity._id);
              }
              user = await user.updateOne({
                activity: user.activity,
              });
              if (user.acknowledged) {
                let userActivities = await User.findOne({
                  _id: req.user.id,
                })
                  .populate({
                    path: "activity",
                    populate: { path: "review", model: "Review" },
                  })
                  .lean();
                return res.json({
                  status: 200,
                  msg: "success",
                  activity: userActivities.activity,
                });
              } else {
                return res.json({
                  status: 500,
                  msg: "User Update failed",
                });
              }
            } else {
              return res.json({
                status: 500,
                msg: "activity update failed",
              });
            }
          } else {
            return res.json({
              status: 500,
              msg: "game update failed",
            });
          }
        } else {
          return res.json({
            status: 500,
            msg: "activity creation error",
          });
        }
      } else {
        return res.json({
          status: 500,
          msg: "game creation error",
        });
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does not exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.disLikeGameDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let game = await Game.findOne({ gameid: req.params.gameid });
      activity = await Activity.findOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      if (game) {
        if (activity) {
          game.likes = game.likes.filter(
            (e) => e.toString() != user._id.toString()
          );

          if (activity.review == null) {
            user.activity = user.activity.filter(
              (e) => e.toString() != activity._id.toString()
            );
          }
          game = await game.updateOne({ likes: game.likes });
          if (game.acknowledged) {
            activity = await activity.updateOne({ liked: false });
            if (activity.acknowledged) {
              user = await user.updateOne({
                activity: user.activity,
              });
              if (user.acknowledged) {
                let userActivities = await User.findOne({
                  _id: req.user.id,
                })
                  .populate({
                    path: "activity",
                    populate: { path: "review", model: "Review" },
                  })
                  .lean();
                return res.json({
                  status: 200,
                  msg: "success",
                  activity: userActivities.activity,
                });
              } else {
                return res.json({
                  status: 500,
                  msg: "User Update failed",
                });
              }
            } else {
              return res.json({
                status: 500,
                msg: "activity update failed",
              });
            }
          } else {
            return res.json({
              status: 500,
              msg: "game update failed",
            });
          }
        }
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does not exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.addreviewDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let game = await Game.findOne({ gameid: req.params.gameid });
      activity = await Activity.findOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      review = await Review.findOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      if (game) {
      } else {
        game = await createGame(req.params.gameid);
      }
      if (game._id) {
        if (activity) {
        } else {
          activity = await createActivity(user._id, game);
        }
        if (activity._id) {
          if (review) {
            await review.updateOne({
              review: req.body.review,
              rating: req.body.rating,
            });
          } else {
            review = await createReview(
              user._id,
              game,
              req.body.review,
              req.body.rating,
              user.role
            );
          }
          if (review._id) {
            if (
              !game.reviews.find((e) => e.toString() == review._id.toString())
            ) {
              game.reviews.push(review._id);
            }
            game = await game.updateOne({ reviews: game.reviews });
            if (game.acknowledged) {
              activity.review = review._id;
              const activityRes = await activity.updateOne({
                review: activity.review,
                date: Date.now(),
              });
              if (activityRes.acknowledged) {
                if (
                  !user.activity.find(
                    (e) => e.toString() == activity._id.toString()
                  )
                ) {
                  user.activity.push(activity._id);
                }
                user = await user.updateOne({
                  activity: user.activity,
                });
                if (user.acknowledged) {
                  let userActivities = await User.findOne({
                    _id: req.user.id,
                  })
                    .populate({
                      path: "activity",
                      populate: { path: "review", model: "Review" },
                    })
                    .lean();

                  return res.json({
                    status: 200,
                    msg: "success",
                    activity: userActivities.activity,
                  });
                } else {
                  return res.json({
                    status: 500,
                    msg: "User Update failed",
                  });
                }
              } else {
                return res.json({
                  status: 500,
                  msg: "activity update failed",
                });
              }
            } else {
              return res.json({
                status: 500,
                msg: "game update failed",
              });
            }
          } else {
            return res.json({
              status: 500,
              msg: "review creation error",
            });
          }
        } else {
          return res.json({
            status: 500,
            msg: "activity creation error",
          });
        }
      } else {
        return res.json({
          status: 500,
          msg: "game creation error",
        });
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does not exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.deleteReviewDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let game = await Game.findOne({ gameid: req.params.gameid });
      activity = await Activity.findOne({
        uid: req.user.id,
        gameid: req.params.gameid,
      });
      if (game) {
        if (activity) {
          game.reviews = game.reviews.filter(
            (e) => e.toString() != activity.review.toString()
          );

          if (!activity.liked) {
            user.activity = user.activity.filter(
              (e) => e.toString() != activity._id.toString()
            );
          }

          game = await game.updateOne({ reviews: game.reviews });
          if (game.acknowledged) {
            activity = await activity.updateOne({ review: null });
            if (activity.acknowledged) {
              user = await user.updateOne({
                activity: user.activity,
                date: Date.now(),
              });
              if (user.acknowledged) {
                const review = await Review.deleteOne({
                  uid: req.user.id,
                  gameid: req.params.gameid,
                });
                if (review.deletedCount == 1) {
                  let userActivities = await User.findOne({
                    _id: req.user.id,
                  })
                    .populate({
                      path: "activity",
                      populate: { path: "review", model: "Review" },
                    })
                    .lean();
                  return res.json({
                    status: 200,
                    msg: "success",
                    activity: userActivities.activity,
                  });
                } else {
                  return res.json({
                    status: 500,
                    msg: "deletion failed",
                  });
                }
              } else {
                return res.json({
                  status: 500,
                  msg: "User Update failed",
                });
              }
            } else {
              return res.json({
                status: 500,
                msg: "activity update failed",
              });
            }
          } else {
            return res.json({
              status: 500,
              msg: "game update failed",
            });
          }
        }
      }
    } else {
      return res.json({
        status: 404,
        msg: "User does not exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};
exports.updateReviewDao = async (req, res, next) => {
  try {
    review = await Review.findOne({
      uid: req.user.id,
      gameid: req.params.gameid,
    });
    let activity = await Activity.findOne({
      uid: req.user.id,
      gameid: req.params.gameid,
    });
    if (activity.review.toString() != review._id.toString()) {
      activity.review = review._id.toString();
    }
    if (review) {
      let editedReview = req.body.review ? req.body.review : review.review;
      let editedRating = req.body.rating ? req.body.rating : review.rating;
      review = await review.updateOne({
        review: editedReview,
        rating: editedRating,
      });
      if (review.acknowledged) {
        activityUpdated = activity.updateOne({ date: Date.now() });
        if (activityUpdated) {
          let userActivities = await User.findOne({
            _id: req.user.id,
          })
            .populate({
              path: "activity",
              populate: { path: "review", model: "Review" },
            })
            .lean();
          return res.json({
            status: 200,
            msg: "success",
            activity: userActivities.activity,
          });
        } else {
          return res.json({
            status: 500,
            msg: "activity update failed",
          });
        }
      } else {
        return res.json({
          status: 500,
          msg: "update review failed",
        });
      }
    } else {
      return res.json({
        status: 404,
        msg: "Review does not exist",
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

// exports.getdetailsDao = async (req, res, next) => {
//   try {
//     let game = await Game.findOne({
//       gameid: req.params.gameid,
//     }).populate({
//       path: "reviews",
//       populate: { path: "uid", model: "User" },
//     });
//     let gamedetailsProcessed = { ...game._doc };
//     let gamedetails = gamedetailsProcessed.reviews.map((review) => {
//       return {
//         _id: review._id,
//         uid: review.uid._id,
//         firstname: review.uid.firstname,
//         lastname: review.uid.lastname,
//         username: review.uid.username,
//         userImage: review.uid.profile_pic,
//         review: review.review,
//         rating: review.rating,
//         role: review.role,
//         gameid: review.gameid,
//       };
//     });
//     gamedetailsProcessed.reviews = gamedetails;
//     if (gamedetailsProcessed) {
//       gamedetailsProcessed["liked"] = false;
//       gamedetailsProcessed["reviewed"] = false;
//       gamedetailsProcessed["loggedin"] = false;
//       gamedetailsProcessed["favorited"] = false;
//       const token = req.header("x-auth-token");
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.id) {
//           gamedetailsProcessed["loggedin"] = true;
//           gamedetailsProcessed["liked"] = false;
//           gamedetailsProcessed["reviewed"] = false;
//           if (
//             gamedetailsProcessed.likes.find(
//               (e) => e.toString() == decoded.id.toString()
//             )
//           ) {
//             gamedetailsProcessed["liked"] = true;
//           }
//           if (
//             gamedetailsProcessed.reviews.find(
//               (e) => e.uid.toString() == decoded.id.toString()
//             )
//           ) {
//             gamedetailsProcessed["reviewed"] = true;
//           }
//           let favorite = await Favorite.find({
//             uid: decoded.id,
//             gameid: req.params.gameid,
//           });
//           if (favorite) {
//             gamedetailsProcessed["favorited"] = true;
//           }
//         }
//       }
//       return res.json({
//         status: 200,
//         msg: "success",
//         data: gamedetailsProcessed,
//       });
//     } else {
//       return res.json({
//         status: 404,
//         msg: "Game does not exist",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       status: 500,
//       err: err.stack,
//     });
//   }
// };

exports.getdetailsDao = async (req, res, next) => {
  try {
    let gamedetailsProcessed = await Game.findOne({
      gameid: req.params.gameid,
    })
      .populate({
        path: "reviews",
        populate: { path: "uid", model: "User" },
      })
      .lean();
    if (gamedetailsProcessed) {
      gamedetailsProcessed["liked"] = false;
      gamedetailsProcessed["reviewed"] = false;
      gamedetailsProcessed["loggedin"] = false;
      gamedetailsProcessed["favorited"] = false;
      const token = req.header("x-auth-token");
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
          gamedetailsProcessed["loggedin"] = true;
          gamedetailsProcessed["liked"] = false;
          gamedetailsProcessed["reviewed"] = false;
          if (
            gamedetailsProcessed.likes.find(
              (e) => e.toString() == decoded.id.toString()
            )
          ) {
            gamedetailsProcessed["liked"] = true;
          }
          if (
            gamedetailsProcessed.reviews.find(
              (e) => e.uid._id.toString() == decoded.id.toString()
            )
          ) {
            gamedetailsProcessed["reviewed"] = true;
          }
          let favorite = await Favorite.find({
            uid: decoded.id,
            gameid: req.params.gameid,
          });
          if (favorite.length != 0) {
            gamedetailsProcessed["favorited"] = true;
          }
        }
      }
      return res.json({
        status: 200,
        msg: "success",
        data: gamedetailsProcessed,
      });
    } else {
      return res.json({
        status: 404,
        msg: "Game does not exist",
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

const createGame = async (gameid) => {
  gamedetails = await apicall(gameid);
  if (!gamedetails.error) {
    let game = {
      gameid: gameid,
      gamename: gamedetails.gamename,
      gameImage: gamedetails.gameImage,
      likes: [],
      reviews: [],
    };
    return await Game.create(game);
  } else {
    //gameid is invalid
    return {
      msg: "gameid is invalid",
    };
  }
};

const createActivity = async (userid, game) => {
  activity = {
    uid: userid,
    gameid: game.gameid,
    gamename: game.gamename,
    gameImage: game.gameImage,
    liked: false,
    review: null,
    date: Date.now(),
  };

  return await Activity.create(activity);
};

const createReview = async (userid, game, review, rating, userRole) => {
  review = {
    uid: userid,
    gameid: game.gameid,
    review: review,
    rating: rating,
    role: userRole,
    dateOfReview: Date.now(),
  };

  return await Review.create(review);
};
