const {
  createGameDao,
  updateGameDao,
  deleteGameDao,
  getCreatedGamesDao,
  searchCreatedGamesDao,
  getGamesDao,
} = require("../dao/games-dao");
const { Validator } = require("node-input-validator");

exports.createGame = async (req, res, next) => {
  const v = new Validator(req.body, {
    name: "required",
    genres: "required",
    description: "required",
    stores: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await createGameDao(req, res, next);
  } else {
    return res.status(400).json({
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.updateGame = async (req, res, next) => {
  const v = new Validator(req.body, {
    cgameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await updateGameDao(req, res, next);
  } else {
    return res.status(400).json({
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.deleteGame = async (req, res, next) => {
  const v = new Validator(req.params, {
    cgameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await deleteGameDao(req, res, next);
  } else {
    return res.status(400).json({
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.getGames = async (req, res, next) => {
  const v = new Validator(req.params, {
    cgameid: "required",
  });
  const matched = await v.check();
  if (matched) {
    return await getGamesDao(req, res, next);
  } else {
    return res.status(400).json({
      msg: "incorrect parameters",
      err: v.errors,
    });
  }
};

exports.searchCreatedGames = async (req, res, next) => {
  return await searchCreatedGamesDao(req, res, next);
};

exports.getCreatedGames = async (req, res, next) => {
  return await getCreatedGamesDao(req, res, next);
};
