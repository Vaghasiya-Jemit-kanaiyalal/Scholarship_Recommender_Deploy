import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useScholarships } from '../context/ScholarshipContext';
import { profileAPI } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scholarships, refreshScholarships } = useScholarships();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await profileAPI.get();
        setProfile(profileData.profile);
        await refreshScholarships();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const fields = ['cgpa', 'family_income', 'category', 'highest_education', 'state', 'gender'];
    const completedFields = fields.filter(field => profile[field] && profile[field] !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const topMatches = scholarships.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p className="dashboard-subtitle">Find the perfect scholarship for your journey</p>
        </div>

        {/* Profile Completion Section */}
        <div className="profile-section">
          <div className="progress-card">
            <div className="card-header-row">
              <div>
                <h2>Profile Completion</h2>
                <p className="card-subtitle">Complete your profile to get better recommendations</p>
              </div>
              {profileCompletion < 100 && (
                <button 
                  className="btn-outline"
                  onClick={() => navigate('/profile')}
                >
                  Complete Profile
                </button>
              )}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <p className="progress-text">
              <strong>{profileCompletion}%</strong> Complete
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>Available Scholarships</h3>
              <p className="stat-number">{scholarships.length}</p>
              <p className="stat-label">scholarships waiting for you</p>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">💡</div>
            <div className="stat-content">
              <h3>Personalized Matches</h3>
              <p className="stat-number">{topMatches.length}</p>
              <p className="stat-label">top recommendations</p>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Profile Score</h3>
              <p className="stat-number">{profileCompletion}%</p>
              <p className="stat-label">completeness level</p>
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="recommendations-section">
          <div className="section-header">
            <h2>Top Recommendations For You</h2>
            <button 
              className="btn-link"
              onClick={() => navigate('/scholarships')}
            >
              View All →
            </button>
          </div>

          {scholarships.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No scholarships available yet</h3>
              <p>Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="recommendations-grid">
              {topMatches.map((scholarship) => (
                <div 
                  key={scholarship.id} 
                  className="recommendation-card"
                  onClick={() => navigate(`/scholarships/${scholarship.id}`)}
                >
                  <div className="match-badge-top">
                    {scholarship.matchPercentage || 85}% Match
                  </div>
                  <h3>{scholarship.name}</h3>
                  <p className="scholarship-amount">{scholarship.amount}</p>
                  <p className="scholarship-description">{scholarship.description}</p>
                  <div className="scholarship-footer">
                    <span className="deadline-text">
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {profileCompletion < 100 && (
          <div className="cta-section">
            <div className="cta-card">
              <h3>Get Better Recommendations</h3>
              <p>Complete your profile to unlock personalized scholarship matches based on your academic background, income, and preferences.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/profile')}
              >
                Complete Your Profile Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
