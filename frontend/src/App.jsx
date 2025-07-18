
import './App.css'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Board from './components/Board';
import TaskEdit from './components/TaskEdit';
import { Toaster } from 'react-hot-toast';
function App() {


  return (
    <>
    <Toaster/>
     <div className=''>
        <BrowserRouter>
        <Routes>
        
          <Route path="/board/:boardId" element={<Board/>} />
          <Route path="/taskEdit/:taskId" element={<TaskEdit/>} />

          <Route path="/" element={<Home/>} />

        </Routes>
        </BrowserRouter>
       
      </div>
  
    
    </>
  )
}

export default App
