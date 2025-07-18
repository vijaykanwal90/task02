import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [boards, setBoards] = useState([]);
  const [createBoard, setCreateBoard] = useState(false);
  const [title, setTitle] = useState("");

  const filteredBoards = boards?.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (boardId) => async () => {
    try {
      await axios.delete(`${BASE_URL}/board/deleteboard/${boardId}`);
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
      toast.success("Board deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete board. Please try again later.");
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/board/createBoard`, { title });
      setBoards((prev) => [...prev, res.data.data]);
      setTitle("");
      setCreateBoard(false);
      toast.success("Board created successfully");
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Failed to create board. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/board/getAllBoards`);
        setBoards(res.data.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Boards</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => setCreateBoard(!createBoard)}
          >
            {createBoard ? "Cancel" : "+ Create Board"}
          </button>
        </div>

        {/* Create Board Form */}
        {createBoard && (
          <form
            onSubmit={handleCreateBoard}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <input
              type="text"
              placeholder="Board Title"
              className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
            >
              Create
            </button>
          </form>
        )}

        {/* Search Box */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBoards.length > 0 ? (
            filteredBoards.map((board) => (
              <div
                key={board._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <Link to={`/board/${board._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {board.title}
                    </h3>
                  </Link>
                  <FaTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={handleDelete(board._id)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {board.tasks?.length || 0}{" "}
                  {board.tasks?.length === 1 ? "task" : "tasks"}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No boards found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
