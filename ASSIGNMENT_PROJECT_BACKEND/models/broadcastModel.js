const mongoose = require('mongoose');

const BroadCastSchema = new mongoose.Schema({
    assigned_by:{
        name:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        user_id:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    description:{
        type:String,
        required:true
    },
    due_date:{
        type:String,
    },
    priority:{
        type:Number,
        required:true,
        default:1
    },
});

const broadcastModel = mongoose.model('Broadcast',BroadCastSchema);

module.exports = {broadcastModel};
