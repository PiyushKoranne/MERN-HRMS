const express = require('express');
const requestRouter = express.Router();
const multer = require('multer');
const path = require('path');
const {verifyJWT} = require('../middlewares/verifyJWT');
const requestController = require('../controllers/requestController');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../public/requestImages'));
    },
    filename: (req, file, cb)=>{
        cb(null, 'REQUEST_'+Date.now()+'_'+file.originalname)
    }
})


const upload = multer({
    storage:storage,
    fileFilter: function(req, file,cb){
        if(!file.mimetype.match(/.jpg|.jpeg|.png/i)){
            cb(new Error('File format not supported'), false)
        } else{
            cb(null, true);
        }
    }
})

requestRouter.post('/make-request', upload.array('image'),requestController.makeRequest);
requestRouter.post('/get-requests', requestController.getRequests);
requestRouter.post('/get-all-requests', verifyJWT, requestController.getAllRequestsAdmin);
requestRouter.post('/delete-request', verifyJWT, requestController.deleteRequest);
requestRouter.post('/approve-request', verifyJWT, requestController.approveRequest);


module.exports = {requestRouter};