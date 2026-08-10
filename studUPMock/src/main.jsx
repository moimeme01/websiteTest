import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import Connected from './UserSession'
import ProtectedRoute from "./context/ProtectedRoute"
import AdminRoute from "./context/AdminRoute"

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
