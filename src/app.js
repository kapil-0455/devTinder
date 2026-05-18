const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config();
const http = require('http')


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
const paymentRouter = require('./routes/payment');
const intializeSocket = require('./utils/socket');

app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/' , requestRouter);
app.use('/' , userRouter);
app.use('/' , paymentRouter);

// making server for socket.io
const server = http.createServer(app);
intializeSocket(server);



connectDB().
then(()=>{
    console.log('Database Connected')
    server.listen(process.env.PORT , ()=>{
        console.log('Server is listening at port number ' + process.env.PORT);
    })
}).catch((err)=>{
    console.error("Error Occurred : " + err.message);
})