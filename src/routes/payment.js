const express = require("express")
const paymentRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')
const {memberShipAmount} = require('../utils/constants');
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post('/payment/create' , userAuth , async(req ,res) =>{

    const {firstName , lastName , email} = req.user;
    const {memberShipType} = req.body;

    if(!memberShipType || !memberShipAmount[memberShipType]){
        return res.status(400).json({message : "Please provide a valid membership type"})
    }
    
    try {
        const order = await razorpayInstance.orders.create({
            amount: memberShipAmount[memberShipType] * 100,
            currency:"INR",
            receipt:"receipt#1",
            notes:{
                firstName,
                lastName,
                email, 
                membershipType:memberShipType
            },
        })

        // save order in database 
        // console.log(order)
        const payment = new Payment({
            userId : req.user._id,
            orderId : order.id,
            status : order.status,
            amount : order.amount,
            currency : order.currency,
            receipt : order.receipt,
            notes : order.notes,
        })

        const savedPayment = await payment.save();
        // console.log(savedPayment)

        res.json({keyId : process.env.RAZORPAY_KEY_ID , ...savedPayment.toJSON()});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})


// razorpay call this route after payment is success
// it dont have to userAuth
paymentRouter.post('/payment/webhook' , async(req ,res) =>{
    try {

        const webhookSignature = req.headers['X-Razorpay-Signature'];
        // validate webhook signature
        const isWebHookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature , process.env.WEBHOOK_SECRET);

        if (!isWebHookValid){
            return res.status(400).json({message : "Invalid webhook signature"});
        }


        // if webhook valid updaete in db payment details 
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({orderId : paymentDetails.order_id});
        //update user as premium
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findById(payment.userId);
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        //return success response to razorPay
        // if (req.body.event ==='payment.captured'){

        // } 

        // if(req.body.event ==='payment.failed'){
            
        // }

        // if you dont write this it will keep calling the api waiting for some response
        return res.status(200).json({message : "Webhook received successfully"});
        
    } catch (error) {
        return res.status(400).json({message : error.message});
    }
})

module.exports = paymentRouter