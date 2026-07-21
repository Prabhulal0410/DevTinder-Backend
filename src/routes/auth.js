import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validate Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, photoUrl } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate input
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }
    if (isPasswordValid) {
      // create jwt token
      // const token = await jwt.sign({ _id: user._id }, "prabhulaltoken2304",{expiresIn:"1d"});

      const token = await user.getJWT();

      // send token in cookie
      res.cookie("token", token);
      res.status(200).json({
        message: "Login successful",
        data: user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "logout successful!" });
});

export default authRouter;
