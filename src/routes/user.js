const express = require('express')
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest');
const { connection } = require('mongoose');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age skills photoUrl";

userRouter.get('/user/request/recived' , userAuth , async(req ,res) =>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate('fromUserId' , USER_SAFE_DATA)

        const data = connectionRequest.map((row) =>{
            return row.fromUserId;
        })

        res.json({
            message : 'These are your requests',
            data 
        })
    } catch (error) {
        res.status(400).send('ERROR : ' + error.messages);
    }
})

userRouter.get('/user/connections' , userAuth , async(req , res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or :[
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"}
            ]
        }).populate("fromUserId" , USER_SAFE_DATA)
        .populate("toUserId" , USER_SAFE_DATA)

        const data = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({data})
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
} )

module.exports = userRouter;