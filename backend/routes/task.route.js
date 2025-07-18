import {getAllTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import express from 'express';

const taskRouter = express.Router();

taskRouter.get('/getalltasks',getAllTasks);
taskRouter.post('/createtask',createTask);
taskRouter.patch('/updatetask/:taskId',updateTask);
taskRouter.get('/gettask/:taskId',getTask);

taskRouter.delete('/deletetask/:taskId',deleteTask);

export default taskRouter;