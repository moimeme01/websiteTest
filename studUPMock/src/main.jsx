import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ProfessorRoute from "./context/ProfessorRoute"
import AdminRoute from "./context/AdminRoute"
import StudentRoute from "./context/StudentRoute"

import {AdminPage, App, Home, Login, Register, UserConnected, UnauthorizedRoute, Professor, Layout, Aide, MesClasses, MaClasse} from "./components"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/studUPMock">
      <AuthProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<App />}/> 
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Home />} />
            <Route path='/unauthorizedRoute' element={<UnauthorizedRoute/>}/>
            <Route path='/aide' element={<Aide/>}/> 
            <Route path='/professor' element= {<ProfessorRoute/>}>
              <Route index element={<Professor/>}/>
              <Route path='myclasses' element={<MesClasses/>}/>
              <Route path='myclass/:groupID' element={<MaClasse/>}/>
            </Route>

            <Route element={<StudentRoute/>}>
              <Route path='/student' element={<UserConnected/>}/>
            </Route>

            <Route element= {<AdminRoute/>}>
              <Route path='/admin' element={<AdminPage/>}/>
            </Route>
          </Route>
          
          <Route path='/login' element={<Login />} />

        </Routes>
                

      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
