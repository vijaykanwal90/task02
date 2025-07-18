import Board from "../models/board.model.js";
const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    return res.status(200).json({
      message: "All Boards retrieved successfully",
      data: boards,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getBoard = async (req, res) => {
  console.log("on get board");

  try {
    const { boardId } = req.params;
    console.log("Getting board with ID:", boardId);

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    console.log("Board found");

    const populatedBoard = await board.populate('tasks'); // ✅ FIXED HERE

    return res.status(200).json({
      message: "Board retrieved successfully",
      data: populatedBoard,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    const newBoard = new Board({ title });
    await newBoard.save();
    return res.status(201).json({
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  try {
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    const updatedBoard = await Board.find;
    ByIdAndUpdate(boardId, { title }, { new: true });
    if (!updatedBoard) {
      return res.status(404).json({
        message: "Board not found",
      });
    }
    return res.status(200).json({
      message: "Board updated successfully",
      data: updatedBoard,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    if (!boardId) {
      return res.status(400).json({
        message: "Board ID is required",
      });
    }
    const deletedBoard = await Board.findByIdAndDelete(boardId);
    if (!deletedBoard) {
      return res.status(404).json({
        message: "Board not found",
      });
    }
    return res.status(200).json({
      message: "Board deleted successfully",
      data: deletedBoard,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export { getAllBoards, getBoard, createBoard, updateBoard, deleteBoard };
