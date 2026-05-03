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

requestRouter.post('/request/review/:status/:requestId' , userAuth , async(req, res)=>{
    try {
        const loggedInUser = req.user;

        //Status checked 
        const {status , requestId} = req.params;
        const allowedStatus = ['accepted', 'rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Status is not valid"
            })
        }

        // checking the connection request
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })
        if(!connectionRequest){
            return res.status(404).json({
                msg : 'Connection request not found'
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message : 'Connection request ' + status,
            data
        })
    } catch (error) {
        res.status(400).send('ERROR' + error.message);
    }


})
module.exports = requestRouter;