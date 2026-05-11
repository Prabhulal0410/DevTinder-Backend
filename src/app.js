import express from "express";
import {adminAuth} from "./middlewares/auth.js"
import {connectDB} from "./config/database.js"

const app = express();



app.listen(3000, () => {
  console.log("Server running on port 3000");
});