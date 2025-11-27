import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentPortal from './pages/StudentPortal';
import AdminPortal from './pages/AdminPortal';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;