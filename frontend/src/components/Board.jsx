import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from 'react-hot-toast';
const Board = () => {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('low');
  const [createTask, setCreateTask] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/board/getboard/${boardId}`);
        setBoard(res.data.data);
      } catch (err) {
        console.error('Error fetching board:', err);
        setError("Failed to load board. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");

    try {
      const res = await axios.post(`${BASE_URL}/task/createtask`, {
        title,
        boardId: board._id,
        description,
        status: 'todo',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        priority
      });

      setBoard(prev => ({
        ...prev,
        tasks: [...prev.tasks, res.data.data],
      }));

      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      setPriority('low');
      toast.success("Task created successfully");

      setCreateTask(false);
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task. Please try again later.");

      setError("Failed to create task. Please try again.");
    }
  };

  const handleDelete = (taskId) => async () => {
    try {
      await axios.delete(`${BASE_URL}/task/deletetask/${taskId}`);
      setBoard(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t._id !== taskId),
      }));
    //   alert("Task deleted");
    toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task. Please try again later.");
      setError("Failed to delete task.");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const filteredTasks = board?.tasks?.filter(task =>
    (task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     task?.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredByStatus = filteredTasks?.filter(task =>
    statusFilter === 'all' || task.status === statusFilter
  );

  const finalFilteredTasks = filteredByStatus?.filter(task =>
    priorityFilter === 'all' || task.priority === priorityFilter
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 text-red-500 text-lg';
      case 'medium': return 'border-yellow-400 text-yellow-500 text-md';
      case 'low': return 'border-green-400 text-green-500 text-sm ';
      default: return 'border-gray-300';
    }
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    switch (status) {
      case 'todo': return <span className={`${base} bg-gray-200 text-gray-800`}>To Do</span>;
      case 'in-progress': return <span className={`${base} bg-yellow-300 text-yellow-800`}>In Progress</span>;
      case 'done': return <span className={`${base} bg-green-300 text-green-800`}>Done</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-500`}>Unknown</span>;
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading board...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">{board?.title}</h2>
        <button
          onClick={() => setCreateTask(!createTask)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          {createTask ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {/* Task Form */}
      {createTask && (
        <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Title" className="p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" className="p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="date" className="p-2 border rounded" value={dueDate} min={today} onChange={(e) => setDueDate(e.target.value)} />
          <input type="text" placeholder="Assigned To" className="p-2 border rounded" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
          <select className="p-2 border rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow" type="submit">Add Task</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full lg:w-1/2 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="p-2 border rounded">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={handleResetFilters} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">
            Reset
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalFilteredTasks?.length > 0 ? (
          finalFilteredTasks.map((task) => (
            <div key={task._id} className={`p-4 border rounded shadow flex justify-between items-start`}>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  {getStatusBadge(task.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                )}

                <p className="text-sm text-gray-500 mt-1">Assigned To: <span className='text-lg font-bold'>{task.assignedTo || "Unassigned"}</span></p>
                <span className={`inline-block  mt-2 px-2 py-1    ${getPriorityColor(task.priority)}  border rounded-full`}>
                  Priority: {task.priority}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 ml-3">
                <Link to={`/taskEdit/${task._id}`}>
                  <FaEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                </Link>
                <FaTrash
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={handleDelete(task._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No matching tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Board;
