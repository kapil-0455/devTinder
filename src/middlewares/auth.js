const adminAuth = (req , res , next)=>{
    console.log('Admin authentication is done')
    let token = 'xyz';
    let isAuthValid = token === 'xyz';
    if(!isAuthValid){
        res.status(401).send('Unauthorized request');
    }
    else {
        next();
    }
}

const userAuth = (req , res , next)=>{
    console.log('User authentication done')
    let token = 'xyz';
    let isAuthValid = token === 'xyz';
    if(!isAuthValid){
        res.status(401).send('Unauthorized request');
    }
    else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}