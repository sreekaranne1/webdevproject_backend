const { getactivitiesDao } = require("../dao/home-dao");

exports.getactivities = async (req, res, next) => {
  return await getactivitiesDao(req, res, next);
};
