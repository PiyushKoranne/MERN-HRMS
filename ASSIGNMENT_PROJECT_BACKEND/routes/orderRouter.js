const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');

orderRouter.post('/create-order', orderController.createOrder);
orderRouter.post('/get-orders', orderController.getOrdersByBuyerId)

module.exports = {orderRouter};