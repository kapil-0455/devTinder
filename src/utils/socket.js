const socket = require('socket.io')

const intializeSocket = (server)=>{
    
    const io = socket(server , {
        cors : {
            origin : "http://localhost:5173",
            credentials : true,
        }
    })

    io.on('connection' , (socket)=>{

        socket.on('joinChat' , ()=>{});

        socket.on('sendMessage' , ()=>{});

        socket.on('disconnect' , ()=>{
            console.log('User disconnected : ' + socket.id);
        })
    })

}

module.exports = intializeSocket;