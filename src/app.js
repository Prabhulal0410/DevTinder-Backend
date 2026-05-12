import express from "express";
import {adminAuth} from "./middlewares/auth.js"
import {connectDB} from "./config/database.js"
import { User } from "./models/user.js";

const app = express();

app.use(express.json())


app.post("/signup",async (req,res)=>{
  //creating new instance of the User model
const user = new User(req.body)

  await user.save()
  res.send("user Added")
})






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