import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './componenets/ProtectedRoute'
import '@qpokychuk/gilroy/normal.css';
import ResumeForm from './componenets/ResumeForm'
import ResumeDetail from './componenets/ResumeDetail'



const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path="/create-resume" element={<ResumeForm />} />
          <Route path="/resume/:id" element={<ResumeDetail />} />


          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }></Route>
        </Routes>
    </div>
  )
}

export default App
