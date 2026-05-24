import express from "express";
import {adminAuth} from "./middlewares/auth.js"
import {connectDB} from "./config/database.js"
import { User } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";

const app = express();

// express give us this methode so that express body understand Body obj
app.use(express.json())


app.post("/signup", async (req, res) => {

  try {
    // validate Data
    validateSignUpData(req)

    // Encrypt the password

    const user = new User(req.body);
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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

app.patch("/user/:userId",async(req,res)=>{
  const userId = req.params?.userId
  const data = req.body

  try {
  const allowed_updates= ["photoUrl","about","gender","age","skills","firstName"]
  const isUpdatedAllowed = Object.keys(data).every((k)=>allowed_updates.includes(k))
  if(!isUpdatedAllowed){
    throw new Error("Update not allowed")
  }

    await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before",runValidators:true},
    )
    //returnDocument:"before" will return user before update and if we user "after" then it will return obj after update doc byDefault it is before if we wont pass anything
    // runValidators unable to run validation function whic is define in schema bydefault it willonly for create if use runValidators:true then only run for update &patch
    res.send("User Updated Succeffully")
  } catch (error) {
    res.status(400).send("Update Failed:" + error.message)
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