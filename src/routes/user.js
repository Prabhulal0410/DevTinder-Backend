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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
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
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // user shouldno all the other card except
    // 1.his own card
    // 2.his connections
    // 3.ignored people
    // 4.already sent the connection request

    // Logged-in user is added by the userAuth middleware after JWT verification
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit >50 ? 50 : limit
    const skip = (page - 1)*limit

    // find all connectin requests (sent + received)
    // We need both because:
    // If I sent a request to someone -> don't show again
    // If someone sent me a request -> don't show again
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, // Requests I have sent
        { toUserId: loggedInUser._id },   // Requests I have received
      ],
    }).select("fromUserId toUserId"); // We only need these two ids, nothing else

    //users to hide from loggedin user

    // Using Set because it stores only unique values.
    // Even if the same user appears multiple times,
    // Set will keep only one copy.
    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      // Add the sender of the request
      hideUserFromFeed.add(req.fromUserId.toString());

      // Add the receiver of the request
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Example:
    // Logged-in User = A
    //
    // A ----> B (Interested)
    // C ----> A (Interested)
    // A ----> D (Ignored)
    //
    // hideUserFromFeed will contain:
    // {A, B, C, D}
    //
    // Later we'll remove A separately using $ne
    // and remove B, C, D using $nin.

    const users = await User.find({
      $and: [
        // $nin = Not In
        // Exclude everyone present inside hideUserFromFeed
        { _id: { $nin: Array.from(hideUserFromFeed) } },

        // $ne = Not Equal
        // Don't show my own profile in the feed
        { _id: { $ne: loggedInUser._id } },
      ],
    })
    // Return only safe fields like firstName, lastName, photoUrl etc.
    // Hide password, email, tokens, etc.
    .select(USER_SAFE_DATA).skip(skip).limit(limit)

    // Send the filtered users as feed
    res.json({
      users,
    });
  } catch (error) {
    // Any database or server error
    res.status(400).json({
      message: error.message,
    });
  }
});

export default userRouter;
