const express = require('express');

const app = express();

app.get('/' , (req, res)=>{
    res.send('Hello from server')
})
app.get('/test' , (req , res)=>{
    res.send('Tesing our server')
})
app.get('/hello' , (req, res)=>{
    res.send("heloo my friends")
})
app.listen(7777 , ()=>{
    console.log('Server is listening at port number 7777');
})