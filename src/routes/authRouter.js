const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupApi } = require("../validators/validations");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  try {
    validateSignupApi(req);
    const { firstName, lastName, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encryptedPassword,
    });

    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

authRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      throw new Error("User not found , please check email and password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials , please try again");
    }
    const token = jwt.sign({ id: user._id }, "SECRETKEY@2024");
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 12 * 60 * 60 * 1000),
    });
    res.status(200).send({ message: " Logged in successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  authRouter,
};
