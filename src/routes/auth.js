const express = require('express');
const authRouter = express.Router();
const {validateSignUp} = require('../utils/validate')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator')

authRouter.post('/signUp' , async(req , res)=>{

    // validate the data 
    validateSignUp(req);

    const {firstName , lastName , email , password} = req.body;

    // Hashing the password
    const passwordHash = await bcrypt.hash(password , 10);


    const user = new User({
        firstName , lastName , email , password : passwordHash
    });
    try {
        await user.save();
        res.send("Data saved ")
    } catch (error) {
        res.status(400).send('Something went wrong' + error.message);
    }
})

authRouter.post('/login' , async(req , res)=>{

    try {
        const {email , password} = req.body;

        if(!validator.isEmail(email)){
            throw new Error('Invalid Id')
        }
        const user = await User.findOne({email : email})
        if(!user){
            throw new Error('Invalid credintials');
        }

        const isValidPassword = await user.validatePassword(password);
        if(isValidPassword){
            // make a token and send cookie
            const token = await user.getJWT();
            // console.log(token)
            res.cookie('token' , token , { expires: new Date(Date.now() + 1 * 3600000) });
            res.json({
                 user
            });
        } 
        else {
            throw new Error('Invalid credintials');
        }

    } catch (error) {
        console.log(error)
        res.status(400).send('ERROR : ' + error.message);
    }
    
})

authRouter.post('/logOut' , (req, res)=>{
    res.cookie('token' , null , { expires: new Date(Date.now()) } );
    res.send('User Logged Out succesfully');
})

module.exports = authRouter;