const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required : true,
        min : 2,
        max:50
    },
    lastName :{
        type : String 
    },
    email :{
        type: String,
        required:true,
        lowercase:true,
        trim : true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not Correct")
            }
        }

    },
    password :{
        type: String,
        required : true,

    },
    age:{
        type: Number,
        min : 18
    },
    gender :{
        type: String,
        validate(value){
            if(!["male" , "female" , "others"].includes(value)){
                throw new Error("Gender data is not Defined")
            }
        }
    },
    photoUrl:{
        type : String,
        default : "https://imgs.search.brave.com/hrPEOI6ZTeAdutYXBBsEiam5Os8jkLZwAQ-quU0b-ps/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDUv/OTQ0LzE5OS9zbWFs/bC9tYWxlLWRlZmF1/bHQtcGxhY2Vob2xk/ZXItYXZhdGFyLXBy/b2ZpbGUtZ3JheS1w/aWN0dXJlLWlzb2xh/dGVkLW9uLWJhY2tn/cm91bmQtbWFuLXNp/bGhvdWV0dGUtcGlj/dHVyZS1mb3ItdXNl/ci1wcm9maWxlLWlu/LXNvY2lhbC1tZWRp/YS1mb3J1bS1jaGF0/LWdyZXlzY2FsZS1p/bGx1c3RyYXRpb24t/dmVjdG9yLmpwZw",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Email is not Correct")
            }
        }
    },
    description :{
        type : String,
        default : "This is Default behaviour"
    },
    skills:{
        type : [String]
    }

}, {timestamps : true})

module.exports = mongoose.model("User" , userSchema);