const validator = require('validator')

const validateSignUp = (req)=>{
    const {firstName , lastName , email , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name must be required");
    }

    else if(!validator.isEmail(email)){
        throw new Error("Email is Not Correct");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is Not strong");
    }
}

module.exports = {
    validateSignUp,
}