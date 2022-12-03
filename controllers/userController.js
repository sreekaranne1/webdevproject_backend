//Imports
const { Validator } = require("node-input-validator");

const {
  registerUserDao,
  loginUserDao,
  getFollowersDao,
  getUserDao,
  updateProfileDao,
  followUserDao,
  unFollowUserDao,
  getFollowingDao,
  searchUserDao,
  checkUserNameDao,
  checkEmailDao,
  tokenValidation,
} = require("../dao/user-dao");

//Route functions
exports.registerUser = async (req, res, next) => {
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
    firstname: "required",
    lastname: "required",
    username: "required",
    phone: "required",
    location: "required",
    dob: "required",
    role: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await registerUserDao(req, res, next);
  } else {
    return res.status(400).json({
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  const v = new Validator(req.body, {
    password: "required",
    username: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await loginUserDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getUser = async (req, res, next) => {
  const v = new Validator(req.params, {
    uid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await getUserDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  return await updateProfileDao(req, res, next);
};

exports.followUser = async (req, res, next) => {
  const v = new Validator(req.body, {
    uid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await followUserDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.unFollowUser = async (req, res, next) => {
  const v = new Validator(req.body, {
    uid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await unFollowUserDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getFollowers = async (req, res, next) => {
  const v = new Validator(req.params, {
    uid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await getFollowersDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getFollowing = async (req, res, next) => {
  const v = new Validator(req.params, {
    uid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await getFollowingDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.searchUser = async (req, res, next) => {
  const v = new Validator(req.params, {
    search: "required",
  });
  const matched = await v.check();
  if (matched) {
    return searchUserDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.checkUserName = async (req, res, next) => {
  const v = new Validator(req.params, {
    search: "required",
  });
  const matched = await v.check();
  if (matched) {
    return checkUserNameDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.checkEmail = async (req, res, next) => {
  const v = new Validator(req.params, {
    search: "required",
  });
  const matched = await v.check();
  if (matched) {
    return checkEmailDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};
exports.tokenValidation = async (req, res, next) => {
  const v = new Validator(req.user, {
    id: "required",
  });
  const matched = await v.check();
  if (matched) {
    return tokenValidation(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};
