const jwt = require("jsonwebtoken");

const adminAuth = (req,res,next)=>{

const token = req.headers.authorization?.split(" ")[1];

if(!token){
return res.status(401).json({message:"No token"});
}


try{

const decoded = jwt.verify(token, process.env.JWT_SECRET || "health_secret_key");
// console.log("Authorization header:", req.headers.authorization);
// console.log("Token received:", token);

req.admin = decoded;

next();

}catch(err){

return res.status(401).json({message:"Invalid token"});
}

};

module.exports = adminAuth;