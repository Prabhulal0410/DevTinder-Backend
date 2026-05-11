import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect("mongodb+srv://prabhulalraghwani410_db:QEWzn7foalrS8RVY@cluster.cbmcbze.mongodb.net/devTinder")
}

// devTinder is the name of database 
// if you dont put somethign after .net/ it will refer to cluster whic we create in atlas
