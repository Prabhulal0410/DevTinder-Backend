import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect("mongodb+srv://prabhulalraghwani410_db:QEWzn7foalrS8RVY@cluster.cbmcbze.mongodb.net/devTinder")
}

// devtinder is the name of database 
// if you dont put somethign after .net/ it will refer to cluster whic we create in atlas

connectDB().then(()=>{
    console.log("databse connection established.")
}).catch(err=>{
    console.log(err)
})