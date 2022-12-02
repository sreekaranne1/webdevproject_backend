//Imports
const { User, Review } = require("../models/models.js");
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
        "data:image/jpeg;base64,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",
      cover_pic:
        "data:image/png;base64,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",
      role: req.body.role,
      location: req.body.location,
      dob: req.body.dob,
      following_list: [],
      followers_list: [],
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
          return res.json({ status: 404, err: err });
        }
        return res.json({
          status: 200,
          msg: "User created",
          data: user,
          token,
        });
      }
    );
  } catch (err) {
    return res.json({
      status: 500,
      err: err.stack,
    });
  }
};

exports.loginUserDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username }).then(
      (user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((match) =>
            match
              ? jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: "360d" },
                  (err, token) => {
                    if (err) {
                      return res.json({ err: err });
                    }
                    return res.json({
                      status: 200,
                      msg: "User Logged",
                      token,
                      logged: true,
                      fn: user.firstname,
                    });
                  }
                )
              : res.json({ status: 404, msg: "Wrong password", logged: false })
          );
        } else {
          return res.json({
            status: 404,
            msg: "Username does not exist",
            logged: false,
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

exports.getUserDao = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.uid })
      .populate({
        path: "activity",
        populate: { path: "review", model: "Review" },
      })
      .then((user) => {
        if (user) {
          res.json({ status: 200, msg: "User found", data: user });
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
          msg: "Username does not exist",
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
        return res.json({ status: 200, updated: true, msg: "success" });
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
        return res.json({ status: 200, updated: true, msg: "success" });
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
    const role = req.query.role.toLowerCase();
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);
    const users = await User.find({
      $or: [
        { username: { $regex: searchRgx, $options: "i" } },
        { firstname: { $regex: searchRgx, $options: "i" } },
        { lastname: { $regex: searchRgx, $options: "i" } },
      ],
      role: role,
    }).limit(10);
    res.json({ status: 200, data: users });
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