import { Routes, Route } from 'react-router-dom'
import StreamingBrowser from './pages/StreamingBrowser'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StreamingBrowser />} />
    </Routes>
  )
}

export default App