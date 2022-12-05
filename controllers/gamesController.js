const { createGameDao } = require("../dao/games-dao");

exports.createGame = async (req, res, next) => {
  return await createGameDao(req, res, next);
};
