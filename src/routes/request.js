import express from "express"
import { userAuth } from "../middlewares/auth.js"
import { ConnectionRequest } from "../models/connectionRequest.js"
import { User } from "../models/user.js"

const requestRouter = express.Router()

// API for right or left swipe (intrested or ignored)
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
   try {
    // loggedin user id whois sending request
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    // user can only send ignored pr intrested nothing else in API
    // this is for our API safety
    const allowledStatus = ["ignored","intrested"]
    if(!allowledStatus.includes(status)){
        return res.status(400).json({
            message:"invalid status type : " + status
        })
    }


    // check that user is there in db whome we will sending request
    const toUser = await User.findById(toUserId)
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }


    // if fromUser has send request to toUser then again it can't send it and viceversa
    // same time toUser also can't send request to fromUser
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(existingConnectionRequest){
        return res.status(400).send({
            message:"Connection Request Already Exists!!"
        })
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })

    const data = await connectionRequest.save()

    res.json({
        message:"connection request sent Successfully!",
        data
    })

   } catch (error) {
    res.status(400).send("Error: " + error.message)
   }
})

export default requestRouter