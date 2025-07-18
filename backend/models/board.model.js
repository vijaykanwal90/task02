import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
}, {
    timestamps: true
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
