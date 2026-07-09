import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

const requestRouter = express.Router();

// API for right or left swipe (intrested or ignored)
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // loggedin user id whois sending request
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // user can only send ignored pr intrested nothing else in API
      // this is for our API safety
      const allowledStatus = ["ignored", "intrested"];
      if (!allowledStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type : " + status,
        });
      }

      // check that user is there in db whome we will sending request
      const toUser = await User.findById(toUserId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if a connection request already exists between these two users.
      //
      // We need to check both directions:
      //
      // 1. Logged-in user  ------> Target user
      //    (Has the current user already sent a request?)
      //
      // 2. Target user ------> Logged-in user
      //    (Has the target user already sent a request?)
      //
      // If any one of these exists, we should not allow creating
      // another connection request because there should be only
      // one request between two users.

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          // Case 1:
          // Check if the logged-in user has already sent
          // a request to the target user.
          {
            fromUserId,
            toUserId,
          },

          // Case 2:
          // Check if the target user has already sent
          // a request to the logged-in user.
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({
          message: "Connection Request Already Exists!!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);

export default requestRouter;
