// import mongoose from "mongoose";

// export const connectDB = async() => {
//     await mongoose.connect("mongodb+srv://prabhulalraghwani410_db:QEWzn7foalrS8RVY@cluster.cbmcbze.mongodb.net/devTinder")
// }


import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://prabhulalraghwani410_db:Vkb!5pmgMBbbWcT@cluster.cbmcbze.mongodb.net/devTinder"
    );

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

// devTinder is the name of database 
// if you dont put somethign after .net/ it will refer to cluster which we create in atlas
