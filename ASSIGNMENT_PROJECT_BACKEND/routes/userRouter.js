const express = require('express');
const path = require('path');
const userRouter = express.Router();
const multer = require('multer');
const { createUser, handleLogin, getAllUsers, updateUserById, deleteUserById, changeUserPassword, getUserById } = require('../controllers/userController');


    const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'), (error, success)=>{
            if(error) console.log("Error in User Router\n",error);
        })
    },
    filename:function(req, file, cb) {
        cb(null, file.originalname, (error, success)=>{
            if(error) console.log("Error in userRouter\n", error);
        })
    }
});
const upload = multer({storage:storage});

// For user requests
userRouter.post('/login', handleLogin);
userRouter.post('/create-user',upload.single('image'),createUser);
userRouter.get('/get-users', getAllUsers);
userRouter.post('/get-userbyid', getUserById);
userRouter.put('/update-user', upload.single('image'),updateUserById)
userRouter.delete('/delete-user', deleteUserById);
userRouter.post('/change-password', changeUserPassword);



module.exports = {userRouter};

