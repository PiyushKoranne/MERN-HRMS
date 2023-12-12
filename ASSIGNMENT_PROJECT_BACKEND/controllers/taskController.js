const { requestModel } = require("../models/requestModel");
const { TaskModel } = require("../models/tasksModel");
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { getAllUsers } = require("./userController");
const { default: mongoose } = require("mongoose");

let isBroadcast = false;
let stopBroadcast = false;
let broadcastError = false;

const addAssignedTask = async (req, res) => {
  // check the access token
  // Must be role Admin
  console.log('req.body',req.body);
  // add task
  try {
    if (req.role && req.role === 5003) {
      // Getting the assigned by info START
      console.log('Finding Assigner');
      const assignedBy = await UserModel.findOne({ _id: req.body.assigned_by });
      console.log('Assigned By: ',assignedBy.name)
      if (!assignedBy) {
        stopBroadcast = true;
        broadcastError = true;
        res
        .status(400)
        .json({ success: false, message: "Cannot find the Assigner." });
        return;
      }
      // Getting the assigned by info END
      console.log('Finding First match')
      const match = await TaskModel.findOne({ user_id: req.body.user_id });
      if (match) {
        console.log('User Id',match.user_id);
        const obj = {
          assigned_by: {
            name: assignedBy.name,
            image: assignedBy.image,
            user_id: assignedBy._id,
            email: assignedBy.email,
          },
          description: req.body.description,
          due_date: req.body.due_date,
          priority: isBroadcast? 1: req.body.priority,
          completed: false,
          is_broadcast:isBroadcast,
          broadcast_id: req.body?.broadcast_id,
        };
        match.assigned_tasks.push(obj);
        console.log('task assigned');
        const response = await match.save();
        !isBroadcast && res
          .status(201)
          .json({ success: true, message: "Task Assigned", data: response });
      } else {
        console.log('Inside else. Match Not FOund.');
        console.log('broadcast_id',req.body.broadcast_id);
        console.log('user_id', req.body.user_id);
        console.log('is_broadcast',isBroadcast);
        const newTask = new TaskModel({
          assigned_tasks: [
            {
              assigned_by: {
                name: assignedBy.name,
                image: assignedBy.image,
                user_id: assignedBy._id,
                email: assignedBy.email,
              },
              description: req.body.description,
              due_date: req.body.due_date,
              priority: isBroadcast? 1 : req.body.priority,
              completed: false,
              is_broadcast:isBroadcast ? true: false,
              broadcast_id: isBroadcast ? req.body.broadcast_id: ""
            },
          ],
          self_tasks: [],
          user_id: req.body.user_id,
        });
        console.log(newTask);
        const response = await newTask.save();
        !isBroadcast && res
          .status(201)
          .json({ success: true, message: "Task Assigned", data: response });
      }
    } else {
      stopBroadcast = true;
      broadcastError = true;
      res
        .status(403)
        .json({ success: false, message: "Only Admin can add Assigned Tasks" });
    }
  } catch (err) {
    stopBroadcast = true;
    broadcastError = true;
    res.status(400).json({ success: false, message: "FAILED" });
  }
};

const deleteAssignedTask = async (req, res) => {
  // send the task id to identify which task should be deleted.
  try {
    if (req.role && req.role === 5003) {
      const match = await TaskModel.findOne({ user_id: req.body.user_id });
      if (match) {
        const arr = match.assigned_tasks.filter(
          (task) => task._id.toString() !== req.body.task_id
        );
        match.assigned_tasks = arr;
        console.log(req.body);
        console.log("match.assigned_tasks", match.assigned_tasks);
        console.log("arr", arr);
        const response = await match.save();
        res
          .status(200)
          .json({ success: true, message: "Task deleted.", response });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Cannot find the task" });
      }
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "ONLY ADMIN CAN DELETE ASSIGNED TASKS",
        });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "FAILED" });
  }
};

const deleteSelfTask = async (req, res) => {
  try {
    const match = await TaskModel.findOne({ user_id: req.body.user_id });
    if (match) {
      const arr = match.self_tasks.filter(
        (task) => task._id.toString() !== req.body.task_id
      );
      match.self_tasks = arr;
      const response = await match.save();
      res
        .status(200)
        .json({ success: true, message: "Task deleted.", response });
    } else {
      res.status(400).json({ success: false, message: "Cannot find the task" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "FAILED" });
  }
};

const addSelfTask = async (req, res) => {
  // check access token
  // add task
  try {
    const match = await TaskModel.findOne({ user_id: req.body.user_id });
    if (match) {
      const obj = {
        description: req.body.description,
        due_date: req.body.due_date,
        priority: req.body.priority,
        completed: false,
      };
      match.self_tasks.push(obj);
      const response = await match.save();
      res
        .status(201)
        .json({ success: true, message: "Self Task Added", data: response });
    } else {
      const newTask = new TaskModel({
        assigned_tasks: [],
        self_tasks: [
          {
            description: req.body.description,
            due_date: req.body.due_date,
            priority: req.body.priority,
            completed: false,
          },
        ],
        user_id: req.body.user_id,
      });
      const response = await newTask.save();
      res
        .status(201)
        .json({ success: true, message: "Self Task Added", data: response });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "FAILED" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    console.log(req.body);
    const match = await TaskModel.findOne({ user_id: req.body.user_id });
    console.log(match);
    if (match) {
      const sortedAssignedTasks = match.assigned_tasks.sort(prioritySort);
      const sortedSelfTasks = match.self_tasks.sort(prioritySort);
      match.assigned_tasks = sortedAssignedTasks;
      match.self_tasks = sortedSelfTasks;
      res.status(200).json({ success: true, match });
    } else res.status(200).json({ success: true, match: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: "FAILED" });
  }
};
const prioritySort = (a, b) => {
  if (a.priority < b.priority) {
    return -1;
  }
  if (a.priority > b.priority) {
    return 1;
  }
  return 0;
};

const updateAssignedTask = async (req, res) => {
  // check access token
  // Must be admin
  // update task
};

const updateSelfTask = async (req, res) => {
  // check access token
  // verify password
  // update task
};

module.exports = {
  addAssignedTask,
  addSelfTask,
  getAllTasks,
  updateAssignedTask,
  updateSelfTask,
  deleteAssignedTask,
  deleteSelfTask,
 };
