import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

// app.get("/user",(req,res) => {
//   console.log(req.query)
//   res.send("user log")
// })

app.get("/user/:id",(req,res) => {
  console.log(req.params)
  res.send("user log")
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});