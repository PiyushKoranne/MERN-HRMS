const express = require('express');
const broadCastRouter = express.Router();
const {verifyJWT} = require('../middlewares/verifyJWT');
const broadcastController = require('../controllers/broadcastController');

broadCastRouter.get('/get-broadcast', verifyJWT, broadcastController.getBroadcast)
broadCastRouter.post('/create-broadcast', verifyJWT,broadcastController.broadcastAssignedTask);
broadCastRouter.post('/delete-broadcast', verifyJWT,broadcastController.deleteBroadcast);


module.exports = { broadCastRouter };