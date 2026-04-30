const express = require('express')
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const {userAuth} = require('../middlewares/auth')
const {validateUserDataEdit} = require('../utils/validate')

profileRouter.get('/profile' ,userAuth , async(req, res)=>{
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
    
})

profileRouter.patch('/profile/edit' ,userAuth, async(req, res)=>{
    try {
        if(!validateUserDataEdit(req)){
            throw new Error('Data not appropriate');
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.json({
            msg : `User updated succesfully`,
            data : loggedInUser,
        })

    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
})

profileRouter.patch('/profile/password' , userAuth , async (req , res)=>{
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if(!currentPassword || !newPassword || !confirmPassword){
            throw new Error('currentPassword, newPassword and confirmPassword are required');
        }

        if(newPassword !== confirmPassword){
            throw new Error('New password and confirm password do not match');
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error('New password must be stronger');
        }

        const user = req.user;
        const isValidPassword = await user.validatePassword(currentPassword);

        if(!isValidPassword){
            throw new Error('Current password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({
            msg: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).send('ERROR : ' + error.message);
    }
})

module.exports = profileRouter;