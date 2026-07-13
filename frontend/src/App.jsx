import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
