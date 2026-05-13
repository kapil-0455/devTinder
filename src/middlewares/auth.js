const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req , res , next)=>{
   try {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("Please Login");
    }

    const decodedData = await jwt.verify(token , process.env.JWT_SECRET);
    const {_id} = decodedData;

    const user = await User.findById(_id);
    if(!user){
        throw new Error("User is not found");
    }
    req.user = user;
    next();
   } catch (error) {
     res.status(400).send("Invalid Token")
   }
}

module.exports = {
    userAuth
}