const express = require("express");
const { User } = require("../models/userModel");
const { userAuth } = require("../middleware/userAuth");

const profileRouter = express.Router();

profileRouter.get("/api/getusers", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

profileRouter.get("/api/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  profileRouter,
};
