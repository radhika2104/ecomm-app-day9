const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    // get auth token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        err: "auth header not found",
      });
    }

    // auth header = "Bearer variable"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        err: "token not found",
      });
    }
    // if token found decode jwt token using secret message which gives back payload
    const userDecoded = jwt.verify(token, "HAHA");
    const user = await User.findOne({ where: { id: userDecoded.user.id } });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    req.user = user.dataValues;
    //  if everything is okay, call next function and response can be extended to save performance
    // response has not been sent back, not changed, so it can be extended so that we do not check again in db for user
    next();
  } catch (e) {
    return res.status(500).send(e);
  }
};

const isSeller = (req, res, next) => {
  try {
    if (req.user.isSeller) {
      next();
    } else {
      return res.status(401).json({ error: "User is not seller!" });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
};

const isBuyer = (req, res, next) => {
  try {
    if (!req.user.isSeller) {
      next();
    } else {
      return res.status(401).json({ error: "User is a seller!" });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
};
module.exports = { isAuthenticated, isSeller, isBuyer };
