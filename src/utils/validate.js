const validator = require('validator')

const validateSignUp = (req)=>{
    try {
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
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
}

const validateUserDataEdit = (req)=>{
    const allwedFields = ['age' , 'gender' , 'skills' , 'description' , 'photoUrl'];

    const isValid = Object.keys(req.body).every((ele) => allwedFields.includes(ele))

    return isValid;
}

module.exports = {
    validateSignUp,
    validateUserDataEdit
}