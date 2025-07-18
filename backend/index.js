import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import boardRouter from './routes/board.route.js';
import taskRouter from './routes/task.route.js';
import connectDB from './utils/database.js';

dotenv.config();
const app = express();
// app.use(cors());

app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:5173',
  
];
// app.options('*', cors()); // Preflight request handling

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  app.use(express.json());
  app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);
  next();
});
// const PORT = process.env.PORT || 5000;
app.use('/api/board', boardRouter);
app.use('/api/task', taskRouter);


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is running at port  ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB  db connection failed !!!" , err);
})
