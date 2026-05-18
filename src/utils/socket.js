const socket = require('socket.io')
const crypto = require('crypto')

//securing your room Id
const getSecretRoomId =({userId , targetUserId})=>{
   return crypto.createHash('sha256').update([userId , targetUserId].sort().join("-")).digest('hex')
}
const intializeSocket = (server)=>{
    
    const io = socket(server , {
        cors : {
            origin : "http://localhost:5173",
            credentials : true,
        }
    })

    io.on('connection' , (socket)=>{

        socket.on('joinChat' , ({firstName, userId , targetUserId})=>{
            // we need to made room with unique Id for each conversation 
            const roomId = getSecretRoomId({userId , targetUserId});

            console.log(firstName + " "+ "Joining room : " , roomId);
            socket.join(roomId);
        });

        //whatever we send over there we recive that here
        socket.on('sendMessage' , ({firstName , userId , targetUserId ,text})=>{
            const roomId = getSecretRoomId({userId , targetUserId});
            // whatever message we got from frontend -> we have to emit it to other user
            
            io.to(roomId).emit('messageRecived' , {
                firstName ,
                text,
            })
            
            
        });

        socket.on('disconnect' , ()=>{
        })
    })

}

module.exports = intializeSocket;