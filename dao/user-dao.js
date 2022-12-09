//Imports
const { User, Review } = require("../models/models.js");
const { getFavoritesDao } = require("./favorite-dao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

//Route functions
exports.registerUserDao = async (req, res, next) => {
  try {
    const pass = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    let user = {
      username: req.body.username,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      profile_pic:
        "https://webdevs3bucket.s3.us-west-2.amazonaws.com/userdefault.jpg",
      cover_pic:
        "https://webdevs3bucket.s3.us-west-2.amazonaws.com/defaultcoverpic.jpg",
      role: req.body.role,
      location: req.body.location,
      dob: req.body.dob,
      following_list: [],
      followers_list: [],
      createdGames: [],
      activity: [],
      followers_count: 0,
      following_count: 0,
    };
    //Db save
    user = await User.create(user);

    jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          //Response
          return res.status(404).json({ err: err });
        }
        return res.status(200).json({
          msg: "User created",
          data: user,
          token,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      err: err.stack,
    });
  }
};

exports.loginUserDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username })
      .lean()
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((match) =>
            match
              ? jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: "360d" },
                  async (err, token) => {
                    if (err) {
                      return res.json({ err: err });
                    }
                    user = await User.findOne({ username: req.body.username })
                      .populate({
                        path: "activity",
                        populate: { path: "review", model: "Review" },
                      })
                      .populate("createdGames")
                      .lean();
                    req.user = {};
                    req.user.id = user._id;
                    req.user.call = true;
                    let favorites = await getFavoritesDao(req, res, next);
                    user.favorites = favorites;
                    return res.json({
                      status: 200,
                      msg: "User Logged",
                      token,
                      logged: true,
                      userObject: user,
                    });
                  }
                )
              : res.json({ status: 404, err: "Wrong password", logged: false })
          );
        } else {
          return res.json({
            status: 404,
            err: "Username does not exist",
            logged: false,
          });
        }
      });
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getUserDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.uid })
      .populate({
        path: "activity",
        populate: { path: "review", model: "Review" },
      })
      .populate("createdGames")
      .lean()
      .then(async (user) => {
        if (user) {
          const token = req.header("x-auth-token");
          user.following = false;
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.id) {
              let user2 = await User.findOne({ _id: decoded.id });
              if (user2) {
                if (
                  user2.following_list.find(
                    (e) => e.toString() == user._id.toString()
                  )
                ) {
                  user.following = true;
                }
              }
            }
          }
          req.user = {};
          req.user.id = req.params.uid;
          req.user.call = true;
          let favorites = await getFavoritesDao(req, res, next);
          user.favorites = favorites;
          res.json({ status: 200, msg: "User found", userObject: user });
        } else {
          return res.json({
            status: 404,
            msg: "User does't exist",
            logged: false,
          });
        }
      });
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.updateProfileDao = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, req.body).then((user) => {
      if (user) {
        res.json({ status: 200, updated: true, msg: "User updated" });
      } else {
        return res.json({
          status: 404,
          updated: false,
          msg: "User does not exist",
        });
      }
    });
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.followUserDao = async (req, res, next) => {
  try {
    if (req.user.id === req.body.uid) {
      return res.json({
        status: 404,
        updated: false,
        msg: "You cannot follow yourself",
      });
    }
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let fuser = await User.findOne({ _id: req.body.uid });
      if (fuser) {
        if (
          user.following_list.find((e) => e.toString() == fuser._id.toString())
        ) {
          return res.json({
            status: 404,
            updated: false,
            msg: "Already following the user",
          });
        }
        if (
          fuser.followers_list.find((e) => e.toString() == user._id.toString())
        ) {
          return res.json({
            status: 404,
            updated: false,
            msg: "User is already in followers List",
          });
        }
        fuser.followers_list.push(user._id);
        user.following_list.push(fuser._id);
        await user.updateOne({
          following_list: user.following_list,
          following_count: user.following_list.length,
        });
        await fuser.updateOne({
          followers_list: fuser.followers_list,
          followers_count: fuser.followers_list.length,
        });
        return res.json({
          status: 200,
          updated: true,
          msg: "success",
          following_list: user.following_list,
          following_count: user.following_list.length,
        });
      } else {
        return res.json({
          status: 404,
          updated: false,
          msg: "User to be followed not found",
        });
      }
    } else {
      return res.json({ status: 404, updated: false, msg: "User not found" });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.unFollowUserDao = async (req, res, next) => {
  try {
    if (req.user.id === req.body.uid) {
      return res.json({
        status: 404,
        updated: false,
        msg: "You cannot Unfollow yourself",
      });
    }
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      let fuser = await User.findOne({ _id: req.body.uid });
      if (fuser) {
        const fuserUpdated = fuser.followers_list.filter(
          (e) => e.toString() != user._id.toString()
        );
        const userUpdated = user.following_list.filter((e) => {
          const isEqual = e != fuser._id;
          return e.toString() != fuser._id.toString();
        });
        await user.updateOne({
          following_list: userUpdated,
          following_count: userUpdated.length,
        });
        await fuser.updateOne({
          followers_list: fuserUpdated,
          followers_count: fuserUpdated.length,
        });
        return res.json({
          status: 200,
          updated: true,
          msg: "success",
          following_list: userUpdated,
          following_count: userUpdated.length,
        });
      } else {
        return res.json({
          status: 404,
          updated: false,
          msg: "User to be Unfollowed not found",
        });
      }
    } else {
      return res.json({ status: 404, updated: false, msg: "User not found" });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getFollowersDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.uid }).populate(
      "followers_list"
    );
    if (user) {
      const followersData = user.followers_list.map((list) => {
        const data = {
          _id: list._id,
          firstname: list.firstname,
          lastname: list.lastname,
          username: list.username,
          profile_pic: list.profile_pic,
        };
        return data;
      });
      res.json({
        status: 200,
        data: { user: user._id, followers_list: followersData },
      });
    } else {
      return res.json({
        status: 404,
        msg: "Username does not exist",
        logged: false,
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getFollowingDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.uid }).populate(
      "following_list"
    );
    if (user) {
      const followingData = user.following_list.map((list) => {
        const data = {
          _id: list._id,
          firstname: list.firstname,
          lastname: list.lastname,
          username: list.username,
          profile_pic: list.profile_pic,
        };
        return data;
      });
      res.json({
        status: 200,
        data: { user: user._id, following_list: followingData },
      });
    } else {
      return res.json({
        status: 404,
        msg: "Username does not exist",
        logged: false,
      });
    }
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.searchUserDao = async (req, res, next) => {
  try {
    const { search } = req.params;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);
    let users = {};
    const token = req.header("x-auth-token");
    let decoded = {};
    if (token) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id) {
        users = await User.find({
          $or: [
            { username: { $regex: searchRgx, $options: "i" } },
            { firstname: { $regex: searchRgx, $options: "i" } },
            { lastname: { $regex: searchRgx, $options: "i" } },
          ],
          _id: { $ne: decoded.id },
        })
          .lean()
          .limit(10);
      }
    } else {
      users = await User.find({
        $or: [
          { username: { $regex: searchRgx, $options: "i" } },
          { firstname: { $regex: searchRgx, $options: "i" } },
          { lastname: { $regex: searchRgx, $options: "i" } },
        ],
      })
        .lean()
        .limit(10);
    }
    const data = users.map((user) => {
      user.following = false;
      if (decoded.id) {
        if (user.followers_list.find((e) => e.toString() == decoded.id)) {
          user.following = true;
        }
      }
      return user;
    });
    res.json({ status: 200, usersData: data });
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.checkUserNameDao = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.search });
    if (user) {
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
exports.checkEmailDao = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.search });
    if (user) {
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

exports.tokenValidation = async (req, res, next) => {
  try {
    req.params = {};
    req.params.uid = req.user.id;
    this.getUserDao(req, res, next);
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.getUserListDao = async (req, res, next) => {
  try {
    let users = {};
    const token = req.header("x-auth-token");
    let decoded = {};
    if (token) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id) {
        users = await User.find({ _id: { $ne: decoded.id } })
          .lean()
          .limit(4);
      }
    } else {
      users = await User.find({}).lean().limit(4);
    }
    const data = users.map((user) => {
      user.following = false;
      if (decoded.id) {
        if (user.followers_list.find((e) => e.toString() == decoded.id)) {
          user.following = true;
        }
      }
      return user;
    });
    return res.json({ status: 200, usersData: data });
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};
