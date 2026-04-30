const express = require('express')
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

requestRouter.post('/request/send/:status/:toUserId' , userAuth,  async(req , res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // check status
        const allowedStatus = ["ignored" , "interested"];
        if(!allowedStatus.includes(status)){
            return  res.json({
                message : 'status is not allowed'
            })
        }
        // check connection request user is there
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message : "user Not found"});
        }



        // check existing connection
        const existinConnectionRequest = await ConnectionRequest.findOne({
            $or :[
                {fromUserId , toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ]
        })

        if(existinConnectionRequest){
            return res.status(400).json({
                msg : 'Connection already exist'
            })
        }

        // make a instance 
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        // save the instance
        const data = await connectionRequest.save();
        res.json({
                message: "Connection request sent successfully",
                data
            })
    }catch(error){
        res.status(400).send('ERROR : ' + error.message);
    }
    
})
module.exports = requestRouter;