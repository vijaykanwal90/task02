
import { getAllBoards, getBoard, updateBoard,createBoard, deleteBoard    } from  "../controllers/board.controller.js";
import express from 'express';
const boardRouter = express.Router();

boardRouter.get('/getallboards',getAllBoards);
boardRouter.post('/createboard',createBoard);
boardRouter.get('/getboard/:boardId',getBoard);

boardRouter.patch('/updateboard/:boardId',updateBoard);

boardRouter.delete('/deleteboard/:boardId',deleteBoard);

export default boardRouter;