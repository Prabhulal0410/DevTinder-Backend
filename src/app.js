import express from "express";
import {adminAuth} from "./middlewares/auth.js"

const app = express();

// app.get("/user",(req,res,next) => {
//   console.log("1st handler")
//   next()
//   // express give use next() which is call next route handler 
// },(req,res)=>{
//   res.send("2nd handler")
// })

// Handle Auth MIddleware for all POST,GET,PUT,DELETE
app.use("/admin",adminAuth)

app.get("admin/getAllData",(req,res)=>{
  res.send("All Data")
})


app.listen(3000, () => {
  console.log("Server running on port 3000");
});