const express = require("express");
const { userAuth } = require("../middleware/userAuth");

const connectionRouter = express.Router();

connectionRouter.post("/api/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send({ message: `${user.firstName} sent a Connection request` });
  } catch (error) {}
});

module.exports = {
  connectionRouter,
};
