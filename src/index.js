const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRouter");
const { profileRouter } = require("./routes/profileRouter");
const { connectionRouter } = require("./routes/requestRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);

connectDB()
  .then(() => {
    console.log("Database connection established Successfully");
    app.listen(4100, () => console.log("Server listening on port 4100"));
  })
  .catch((err) => console.log("Error connecting", err));
