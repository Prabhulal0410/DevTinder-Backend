export const adminAuth = (req,res,next)=>{
  const token = "abc"
  const isAdminAuth = token ==="abc"
  if(!isAdminAuth){
    res.status(401).send("unauthorized request")
  }else{
    next()
  }
}
