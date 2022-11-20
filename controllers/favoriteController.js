const {
  getFavoritesDao,
  removeFavoriteDao,
  addFavoriteDao,
} = require("../dao/favorite-dao");

exports.addFavorite = async (req, res, next) => {
  const v = new Validator(req.body, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await addFavoriteDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.removeFavorite = async (req, res, next) => {
  const v = new Validator(req.params, {
    gameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await removeFavoriteDao(req, res, next);
  } else {
    return res.json({
      status: 400,
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getFavorites = async (req, res, next) => {
  return await getFavoritesDao(req, res, next);
};
