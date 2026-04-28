const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.post('/signUp' , async(req , res)=>{
    const user = new User({
        firstName: 'Kapil',
        lastName: 'Singh',
        email: 'kapil0455cu@gmail.com',
        password: '730041',
        age: 22,
        gender: 'Male'

    });
    try {
        await user.save();
        res.send("Data saved ")
    } catch (error) {
        res.status(400).send('Not saved');
    }
})

connectDB().
then(()=>{
    console.log('Database Connected')
    app.listen(7777 , ()=>{
        console.log('Server is listening at port number 7777');
    })
}).catch((err)=>{
    console.err("Error Occured");
})