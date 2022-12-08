const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .json({ status: 401,err:"failed", msg: "Token failed. Auth denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    return next();
  } catch (err) {
    return res.json({ status:500,err: err });
  }
}

module.exports = auth;
