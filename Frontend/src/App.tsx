
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScholarshipProvider } from './context/ScholarshipContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home'; // ADDED THIS IMPORT
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProfileForm } from './pages/ProfileForm';
import { Scholarships } from './pages/Scholarships';
import { ScholarshipDetails } from './pages/ScholarshipDetails';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivateRoute } from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ScholarshipProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* 1. ROOT PATH NOW GOES TO HOME PAGE */}
                <Route path="/" element={<Home />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* PROTECTED ROUTES */}
                <Route path="/profile" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
                <Route path="/scholarships" element={<PrivateRoute><Scholarships /></PrivateRoute>} />
                <Route path="/scholarships/:id" element={<PrivateRoute><ScholarshipDetails /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                
                {/* 2. CATCH-ALL ROUTE (REDIRECT TO HOME IF PAGE NOT FOUND) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ScholarshipProvider>
    </AuthProvider>
  );
}

export default App;