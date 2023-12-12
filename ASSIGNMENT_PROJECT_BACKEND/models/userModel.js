const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mob:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    role:{
        type:Number,
        required:true,
        default:5001 // ! If someone passes this as 5003-admin, reject the request.
    },
    password:{
        type:String,
        required:true
    },
    accessToken:{
        type:String,
        required:true,
        default:""
    }

});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {UserModel}