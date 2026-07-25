import validator from "validator"

export const validateSignUpData = (req) =>{
    const{firstName,lastName,emailId,password} =req.body

    if(!firstName || !lastName){
        throw new Error("Name is rquired")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is required")
    }
}


export const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
};