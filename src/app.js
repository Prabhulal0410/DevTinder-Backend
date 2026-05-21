import express from "express";
import {adminAuth} from "./middlewares/auth.js"
import {connectDB} from "./config/database.js"
import { User } from "./models/user.js";

const app = express();

// express give us this methode so that express body understand Body obj
app.use(express.json())


app.post("/signup",async (req,res)=>{
  //creating new instance of the User model
const user = new User(req.body)
  await user.save()
  res.send("user Added")
})

// Feed api - get all the user
app.get("/feed",async (req,res)=>{
  try {
    const users= await User.find({})
    res.send(users)
  } catch (error) {
    res.status(400).send("Somethign went wrong")
  }
})

// Delete user Api
app.delete("/user",async(req,res)=>{
   const userId = req.body.userId
  try {
    const user = await User.findByIdAndDelete(userId)
    res.send("User Deleted Succeffully")
  } catch (error) {
    res.status(400).send("Somethign went wrong")
  }
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