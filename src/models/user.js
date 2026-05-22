import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        min:18,
        max:50,
    },
    grnder:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
        // validate method only works when create something not for update
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is default value for about"
    },
    skills:{
        type:[String],
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)

// User is the name of model (inside this )