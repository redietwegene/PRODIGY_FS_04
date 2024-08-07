import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from './pages/signup'

function App() {


  return (
    
      <Routes>
      <Route path='/signup' element={< Signup/> } />

      </Routes>
  
  
  )
}

export default App
