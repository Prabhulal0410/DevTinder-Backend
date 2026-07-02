import express from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    // validate Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create jwt token
      // const token = await jwt.sign({ _id: user._id }, "prabhulaltoken2304",{expiresIn:"1d"});

      const token = await user.getJWT();

      // send token in cookie
      res.cookie("token", token);
      res.send("Login Successfull!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default authRouter