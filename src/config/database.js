const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://KapilDev:1oNnbmDOYPqWUOkD@cluster0.fdqkp17.mongodb.net/devTinder');
}

module.exports = connectDB;