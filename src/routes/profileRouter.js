const express = require("express");
const { User } = require("../models/userModel");
const { userAuth } = require("../middleware/userAuth");
const { validatePatchApi } = require("../validators/validations");

const profileRouter = express.Router();

profileRouter.get("/api/getusers", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

profileRouter.get("/api/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

profileRouter.patch("/api/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validatePatchApi(req)) {
      throw new Error("Trying to update wrong fields");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.status(200).json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  profileRouter,
};
