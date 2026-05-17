const express = require("express")
const paymentRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')
const {memberShipAmount} = require('../utils/constants')

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

module.exports = paymentRouter