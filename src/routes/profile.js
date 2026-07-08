import express from "express"
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validation.js";

const profileRouter = express.Router()

// profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit request")
    }

    // loggedIn user
    const loggedInUser = req.user
    // loggedInUser.firstName = req.body.firstName
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save(); 

    res.send(`${loggedInUser.firstName} your profile updated successfully`)

  } catch (error) {
    res.status(400).send("Error : " + error.message) 
  }
})


// homework profile/password   ===> means forget password

// Update Password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw new Error("Password is required");
    }

    const loggedInUser = req.user;

    loggedInUser.password = password;

    await loggedInUser.save();

    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

export default profileRouter