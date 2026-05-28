import express from "express";
import { userAuth } from "./middlewares/auth.js";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// express give us this methode so that express body understand Body obj
app.use(express.json());
// cookieParser will read tha cookie data which sent by client.(its a middleware)
app.use(cookieParser());



// Connect DB first
connectDB()
  .then(() => {
    console.log("Database connection established.");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
    console.error(err);
  });

// First we have to connect with db
// then will start server and listen
