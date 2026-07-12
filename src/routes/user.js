import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
 const userRouter = express.Router()

// get all the pending connection request for the logged in user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{

    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status:"intrested",
        }).populate("fromUserId",["firstName","lastName","photoUrl"])
        // }).populate("fromUserId", "firtName lastName") this is also one way to write filters

        res.json({
            message:"Data Fetched succsfully!!",
            connectionRequests
        })

    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }

})




 export default userRouter