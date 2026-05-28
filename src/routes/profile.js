import express from "express"
import { userAuth } from "../middlewares/auth";

const authRouter = express.Router()

// profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error : " + error.message);
  }
});