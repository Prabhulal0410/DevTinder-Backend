import validator from "validator"

export const validateSignUpData = (req) =>{
    const{firstName,lastName,emailId,password} =req.body

    if(!firstName || !lastName){
        throw new Error("Name is rquired")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is required")
    }
}