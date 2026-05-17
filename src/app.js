const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config();


app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json());
app.use(cookieParser())


const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')
const paymentRouter = require('./routes/payment')

app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/' , requestRouter);
app.use('/' , userRouter);
app.use('/' , paymentRouter);



connectDB().
then(()=>{
    console.log('Database Connected')
    app.listen(process.env.PORT , ()=>{
        console.log('Server is listening at port number ' + process.env.PORT);
    })
}).catch((err)=>{
    console.error("Error Occurred : " + err.message);
})