const express = require("express");
const { connectDB } = require("./config/database");
const bcrypt = require("bcrypt");
const { validateSignupApi } = require("./validators/validations");
const { User } = require("./models/userModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/userAuth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/api/getusers", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
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

app.get("/api/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established Successfully");
    app.listen(4100, () => console.log("Server listening on port 4100"));
  })
  .catch((err) => console.log("Error connecting", err));
