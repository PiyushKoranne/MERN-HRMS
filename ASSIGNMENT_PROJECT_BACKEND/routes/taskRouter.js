const express = require('express');
const taskRouter = express.Router();
const TaskController = require('../controllers/taskController');
const { verifyJWT } = require('../middlewares/verifyJWT');

taskRouter.post('/add-assigned-task', verifyJWT, TaskController.addAssignedTask);
taskRouter.post('/add-self-task', verifyJWT,TaskController.addSelfTask);
taskRouter.post('/get-tasks', TaskController.getAllTasks);
taskRouter.post('/delete-assigned-task', verifyJWT, TaskController.deleteAssignedTask);
taskRouter.post('/delete-self-task', verifyJWT,TaskController.deleteSelfTask);
module.exports = {taskRouter};