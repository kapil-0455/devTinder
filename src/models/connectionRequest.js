const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is incorrect status type'
        }
    }
})

connectionRequestSchema.pre('save' , function(next){
    const connection = this;
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("cannot send connection request to yourself")
    }

    next;

})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)