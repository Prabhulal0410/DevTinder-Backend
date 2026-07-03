import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    // read token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    // verify token which we got from cookies
    const decodedMsg = await jwt.verify(token, "prabhulaltoken2304");


    // get id from token and find user by id
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};
