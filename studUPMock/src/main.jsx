import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/AuthProvider'
import Register from './Register'
import Login from './Login'
import Welcomehome from './Welcomehome'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/studUPMock">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}/> 
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/WELCOMEHOME' element={<Welcomehome />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
