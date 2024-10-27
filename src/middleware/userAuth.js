const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    const tokenValid = jwt.verify(token, "SECRETKEY@2024");
    const { id } = tokenValid;

    const user = await User.findOne({ _id: id });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  userAuth,
};
