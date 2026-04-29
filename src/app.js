const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const {validateSignUp} = require('./utils/validate')
const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const {userAuth} = require('./middlewares/auth')

app.use(express.json());
app.use(cookieParser())

app.post('/signUp' , async(req , res)=>{

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

app.post('/login' , async(req , res)=>{

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
            res.send('Login succesfully');
        } 
        else {
            throw new Error('Invalid credintials');
        }

    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
    
})

app.get('/profile' ,userAuth , async(req, res)=>{
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
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