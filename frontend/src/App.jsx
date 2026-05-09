import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/Student/StudentDashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ManageExams from './pages/Admin/MangeExam'
import ExamBuilder from './pages/Admin/ExamBuilder'
import AdminResults from './pages/Admin/AdminResults'
import TakeExam from './pages/Student/TakeExam'
import StudentResults from './pages/Student/StudentResults'

function App() {
  const { currentUser } = useApp()

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} /> : <LoginPage />} />

        <Route path="/student" element={currentUser && currentUser.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
        <Route path="/student/exam/:examId" element={currentUser && currentUser.role === 'student' ? <TakeExam /> : <Navigate to="/" />} />
        <Route path="/student/results" element={currentUser && currentUser.role === 'student' ? <StudentResults /> : <Navigate to="/" />} />

        <Route path="/admin" element={currentUser && currentUser.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/exams" element={currentUser && currentUser.role === 'admin' ? <ManageExams /> : <Navigate to="/" />} />
        <Route path="/admin/exams/:examId/build" element={currentUser && currentUser.role === 'admin' ? <ExamBuilder /> : <Navigate to="/" />} />
        <Route path="/admin/results" element={currentUser && currentUser.role === 'admin' ? <AdminResults /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
