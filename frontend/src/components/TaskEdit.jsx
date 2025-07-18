import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const TaskEdit = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('todo');
  const today = new Date().toISOString().split("T")[0];
const navigate = useNavigate();
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
    //   alert('Title is required');
    toast.alert('Title is required');
      return;
    }

    try {
      const res = await axios.patch(`${BASE_URL}/task/updatetask/${taskId}`, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        priority,
        status,
      });

      setTask(res.data.data);
    //   alert('Task updated successfully');
    toast.success('Task updated successfully');
    navigate(-1);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/task/gettask/${taskId}`);
        const taskData = res.data.data;

        setTask(taskData);
        setTitle(taskData.title || '');
        setDescription(taskData.description || '');
        setDueDate(taskData.dueDate ? taskData.dueDate.split('T')[0] : '');
        setAssignedTo(taskData.assignedTo || '');
        setPriority(taskData.priority || 'low');
        setStatus(taskData.status || 'todo');
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Task: {task?.title}
      </h2>

      <form onSubmit={handleUpdateTask} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded resize-none"
          rows={4}
        />

        <input
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default TaskEdit;
