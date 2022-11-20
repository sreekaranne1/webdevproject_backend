const { Validator } = require("node-input-validator");
const {
  likeGameDao,
  disLikeGameDao,
  addreviewDao,
  deleteReviewDao,
  updateReviewDao,
  getdetailsDao,
} = require("../dao/details-dao");

exports.likeGame = async (req, res, next) => {
  const v = new Validator(req.params, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await likeGameDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.disLikeGame = async (req, res, next) => {
  const v = new Validator(req.params, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await disLikeGameDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.addreview = async (req, res, next) => {
  const v = new Validator(req.body, {
    review: "required",
    rating: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await addreviewDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  const v = new Validator(req.params, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await deleteReviewDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};
exports.updateReview = async (req, res, next) => {
  const v = new Validator(req.body, {
    review: "required",
    rating: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await updateReviewDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getdetails = async (req, res, next) => {
  const v = new Validator(req.params, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await getdetailsDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};
