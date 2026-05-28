import express from "express"
import { userAuth } from "../middlewares/auth.js";

const profileRouter = express.Router()

// profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

export default profileRouter