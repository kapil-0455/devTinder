const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

app.get('/user' , async(req , res)=>{
    const userId = req.body._id;

    try {
        const user = await User.findById({_id : userId});
        res.send(user);
    } catch (error) {
        res.status(400).send("Something Went wrong")
    }
})

app.get('/feed' , async(req , res)=>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

app.delete('/user' , async(req , res)=>{
    const userId = req.body.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted succesfully')
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

app.patch('/user/:userId' , async(req , res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_Updates = ["photoUrl" , "skills" , "gender" , "age" , "description"];
        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_Updates.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Update not Allowed");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills not greater than 10")
        }
        const user = await User.findByIdAndUpdate(userId , data , {runValidators : true});
        console.log(user);
        res.send('User updated succesfully');
    } catch (error) {
        res.status(400).send("Something went wrong: " + error.message);
    }
})


app.post('/signUp' , async(req , res)=>{
    const user = new User(req.body);
    try {
        await user.save();
        res.send("Data saved ")
    } catch (error) {
        res.status(400).send('Something went wrong' + error.message);
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