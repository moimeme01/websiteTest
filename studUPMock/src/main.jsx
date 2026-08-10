import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from "./context/ProtectedRoute"
import AdminRoute from "./context/AdminRoute"

import {AdminPage, App, Home, Login, Register, Connected } from "./components"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/studUPMock">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}/> 
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />

          <Route element= {<ProtectedRoute/>}>
            <Route path='/student' element={<Connected/>}/>
            <Route path='/professor' element={<Connected/>}/>
          </Route>

          <Route element= {<AdminRoute/>}>
            <Route path='/admin' element={<AdminPage/>}/>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
