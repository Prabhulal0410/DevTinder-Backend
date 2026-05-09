import express from "express";

const app = express();

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

app.get("/user",(req,res,next) => {
  console.log("1st handler")
  next()
  // express give use next() which is call next route handler 
},(req,res)=>{
  res.send("2nd handler")
})

// app.get("/user/:id",(req,res) => {
//   console.log(req.params)
//   res.send("user log")
// })

app.listen(3000, () => {
  console.log("Server running on port 3000");
});