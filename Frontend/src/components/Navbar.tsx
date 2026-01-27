import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {/* Logo now routes based on auth status */}
          <Link to={getLogoRedirectPath()}>
            ScholarshipHub
          </Link>
        </div>

        {isAuthenticated && !isAuthPage && (
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="navbar-auth">
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