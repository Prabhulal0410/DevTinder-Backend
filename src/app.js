import express from "express";
import { connectDB } from "./config/database.js";
import { validateSignUpData } from "./utils/validation.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";

const app = express();

// express give us this methode so that express body understand Body obj
app.use(express.json());
// cookieParser will read tha cookie data which sent by client.(its a middleware)
app.use(cookieParser());

// Use Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)



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
