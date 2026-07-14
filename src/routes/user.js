import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills";

// get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
    // }).populate("fromUserId", "firtName lastName") this is also one way to write filters

    res.json({
      message: "Data Fetched succsfully!!",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// api for user to show who is connected
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

    const data = connectionRequests.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId
        }
        return row.fromUserId
    });

    res.json({
      message: "Succesfully fetch Accepted connection request",
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});


// api for user feed
userRouter.get("/user/feed",userAuth,async(req,res)=>{
  try {
    // user shouldno all the other card except
    // 1.his own card
    // 2.his connections
    // 3.ignored people
    // 4.already sent the connection request

    const loggedInUser = req.user;

    // find all connectin requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    //users to hide from loggedin user
    const hideUserFromFeed = new Set()
    connectionRequests.forEach((req)=>{
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString())
    })

    const users = await User.find({
      $and:[{ _id : {$nin:Array.from(hideUserFromFeed)}},
            {_id :{$ne:loggedInUser._id}}
      ]}
    ).select(USER_SAFE_DATA)



    res.json({
      users,
    });
  } catch (error) {
    res.status(400).json({
      message:error.message
    })
  }
})

export default userRouter;
