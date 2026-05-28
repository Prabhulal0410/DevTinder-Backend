import express from "express"
import { userAuth } from "../middlewares/auth"

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user

    res.send(user.firstName)
})