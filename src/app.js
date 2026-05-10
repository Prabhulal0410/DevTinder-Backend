import express from "express";

const app = express();

// app.get("/user",(req,res,next) => {
//   console.log("1st handler")
//   next()
//   // express give use next() which is call next route handler 
// },(req,res)=>{
//   res.send("2nd handler")
// })

// Handle Auth MIddleware for all POST,GET,PUT,DELETE
app.use("/admin",(req,res,next)=>{
  const token = "abc"
  const isAdminAuth = token ==="abc"
  if(!isAdminAuth){
    res.status(401).send("unauthorized request")
  }else{
    next()
  }
})

app.get("admin/getAllData",(req,res)=>{
  res.send("All Data")
})


app.listen(3000, () => {
  console.log("Server running on port 3000");
});