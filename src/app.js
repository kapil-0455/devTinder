const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())


const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')

app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/' , requestRouter);



connectDB().
then(()=>{
    console.log('Database Connected')
    app.listen(7777 , ()=>{
        console.log('Server is listening at port number 7777');
    })
}).catch((err)=>{
    console.err("Error Occured");
})