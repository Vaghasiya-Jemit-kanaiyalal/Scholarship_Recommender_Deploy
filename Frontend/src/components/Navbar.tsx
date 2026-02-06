import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Scholarships', path: '/scholarships' },
    { label: 'Profile', path: '/profile' },
  ];

  const adminNavItems = [
    { label: 'Admin Panel', path: '/admin' },
    { label: 'View Scholarships', path: '/scholarships' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // FIX 1: Redirect to Home page ('/') instead of '/login' after logout
  const handleLogout = () => {
    logout();
    navigate('/'); //
    setMobileMenuOpen(false);
  };

  // FIX 2: Determine logo destination
  // If authenticated: Admin goes to /admin, User goes to /dashboard.
  // If NOT authenticated: Everyone goes to Home page /
  const getLogoRedirectPath = () => {
    if (isAuthenticated) {
      return isAdmin ? '/admin' : '/dashboard';
    }
    return '/'; //
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {/* Logo now routes based on auth status */}
          <Link to={getLogoRedirectPath()} className="navbar-brand-link">
            {/* 
              ===== LOGO PATH CONFIGURATION =====
              Step 1: Replace '/logo.svg' with your logo path
              
              Choose ONE of the following options:
              
              Option A - Use SVG from public folder:
                src="/logo.svg"
              
              Option B - Use PNG/JPG from public folder:
                src="/your-logo.png"
              
              Option C - Use image from assets folder:
                src={require('../assets/logo.png')} (for local imports)
              
              Option D - Use online URL:
                src="https://example.com/your-logo.png"
              
              Default: Using SVG logo from public folder
              ===================================
            */}
            <img 
              src="/logo.jpeg" 
              alt="ScholarshipHub Logo" 
              className="navbar-logo"
            />
            <span className="navbar-brand-text">ScholarshipHub</span>
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        {isAuthenticated && !isAuthPage && (
          <button 
            className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        {isAuthenticated && !isAuthPage && (
          <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={handleNavLinkClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className={`navbar-auth ${mobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated && !isAuthPage && (
            <>
              <span className="user-name">
                {user?.name} {isAdmin && <span className="admin-badge">Admin</span>}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          
        
        </div>
      </div>
    </nav>
  );
};