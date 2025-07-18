import Task from '../models/task.model.js';
import Board from '../models/board.model.js';
const getAllTasks = async (req, res)=>{
    try {
        const tasks = await Task.find();
        return res.status(200).json({
            message: "Tasks retrieved successfully",
            data: tasks
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
        
    }
}
const getTask = async (req,res)=>{
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        return res.status(200).json({
            message: "Task retrieved successfully",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
        
    }
}
const createTask = async (req, res) => {
  const { title, description, boardId, status, dueDate, assignedTo, priority } = req.body;

  try {
    console.log("on create task");

    if (!title || !boardId) {
      console.log("Missing title or boardId");
      return res.status(400).json({
        message: "Title and Board ID are required",
      });
    }

    // Step 1: Create the new task
    const newTask = new Task({
      title,
      description,
      boardId,
      status,
      dueDate,
      assignedTo,
      priority,
    });

    await newTask.save();

    // Step 2: Push the task to the board's tasks array
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.tasks.push(newTask._id); // Push the task ID to board's tasks
    await board.save();

    console.log("Task created and added to board:", newTask);
    return res.status(201).json({
      message: "Task created successfully",
      data: newTask,
    });

  } catch (error) {
    console.error("Error creating task:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateTask = async (req,res)=>{
  try {
        const {taskId } = req.params;
        const {title, description, status, dueDate, assignedTo, priority} = req.body;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        if (!title && !description && !status && !dueDate && !assignedTo && !priority) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;
        task.priority = priority || task.priority;
        await task.save();
        return res.status(200).json({
            message: "Task updated successfully",
            data: task

        });

  } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
    
  
}
const deleteTask = async (req,res)=>{
    const {taskId} = req.params;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        return res.status(200).json({
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
export { getAllTasks, getTask, createTask, updateTask, deleteTask };