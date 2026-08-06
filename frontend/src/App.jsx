import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Test from './pages/Test'

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/dashboard/:docId" element={<Dashboard />} />
      <Route path="/test" element={<Test/>}/>
    </Routes>
  )
}
