import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Famille from './pages/Famille'

import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/famille' element={<Famille />} />
      <Route path='/projets' element={<div> Coming soon </div>} />
    </Routes>
  )
}

export default App;
