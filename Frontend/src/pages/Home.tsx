export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">ScholarshipHub</h1>
          <p className="hero-subtitle">
            Smart scholarship discovery powered by AI — personalized, fast, and reliable.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate('/login')} className="btn-home btn-login">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn-home btn-register">
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Why Us Section */}
      <section className="why-us">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
          Platform Excellence
        </h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h3>AI Matching</h3>
            <p style={{ color: '#64748b' }}>Precision algorithms that connect your profile to the right funding.</p>
          </div>
          <div className="feature-card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h3>Verified Sources</h3>
            <p style={{ color: '#64748b' }}>Every scholarship is hand-verified for authenticity and security.</p>
          </div>
          <div className="feature-card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h3>One-Stop Discovery</h3>
            <p style={{ color: '#64748b' }}>No more headache of visiting multiple websites — all verified scholarships in one place.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';