import mongoose, { Schema } from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:`{VALUE} is incooorect status type`
        },
        required:true
    }
},{timestamps:true})


// this is called before we save the data.
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this

    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to youself")
    }
    next()
})

export const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema)