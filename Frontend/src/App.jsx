import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from './pages/signup'
import Login from './pages/login';
import Chat from './pages/chat';

function App() {


  return (
    
      <Routes>
      <Route path='/signup' element={< Signup/> } />
      <Route path='/' element={< Login/> } />
      <Route path='/chat' element={< Chat/> } />

      </Routes>
  
  
  )
}

export default App
