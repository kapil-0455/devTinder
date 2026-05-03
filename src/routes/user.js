const express = require('express')
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user')
const { connection } = require('mongoose');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age skills photoUrl";

userRouter.get('/user/request/recived' , userAuth , async(req ,res) =>{
    try {
        const loggedInUser = req.user;

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate('fromUserId' , USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

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

userRouter.get('/feed' , userAuth , async(req , res)=>{
    try {
        const loggedInUser = req.user;
        const pages = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (pages - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId : loggedInUser._id },
                {fromUserId : loggedInUser._id}
            ]
        })

        const hiddenUsersFromFeed = new Set();
        connectionRequest.map((req) =>{
            hiddenUsersFromFeed.add(req.toUserId);
            hiddenUsersFromFeed.add(req.fromUserId);
        })

        const users = await User.find({
            $and : [
                { _id : {$nin : Array.from(hiddenUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            users
        })
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message)
    }


})

module.exports = userRouter;