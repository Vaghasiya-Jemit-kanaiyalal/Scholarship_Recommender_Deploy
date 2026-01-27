import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholarships } from '../context/ScholarshipContext';

export const Scholarships: React.FC = () => {
  const navigate = useNavigate();
  const { scholarships } = useScholarships();
  const [sortBy, setSortBy] = useState<'match' | 'deadline'>('match');

  // Logic: Ensure stable sorting by converting dates to numeric timestamps
  const sortedScholarships = useMemo(() => {
    const sorted = [...scholarships];
    if (sortBy === 'match') {
      return sorted.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    } else {
      return sorted.sort((a, b) => {
        // Convert to time for accurate sorting
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return dateA - dateB; 
      });
    }
  }, [sortBy, scholarships]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0); 
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMatchBadgeClass = (percentage: number) => {
    if (percentage >= 90) return 'match-high';
    if (percentage >= 80) return 'match-medium';
    return 'match-low';
  };

  return (
    <div className="scholarships-page">
      <div className="scholarships-container">
        {/* Header */}
        <div className="scholarships-header">
          <div className="inline-block mb-4">
            <span className="scholarships-badge">
              AI-Powered Matching
            </span>
          </div>
          <h1 className="scholarships-title">
            Find Your Perfect Scholarship
          </h1>
          <p className="scholarships-subtitle">
            Intelligent matching based on your profile. Get personalized recommendations instantly.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="scholarships-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'match' | 'deadline')}
            className="scholarships-sort-select"
          >
            <option value="match">Best Match</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        {/* Scholarships Grid */}
        {sortedScholarships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No scholarships available</h3>
            <p>Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="scholarships-grid">
            {sortedScholarships.map((scholarship) => {
              const daysLeft = getDaysUntilDeadline(scholarship.deadline);
              const isExpired = daysLeft < 0;
              const isUrgent = daysLeft >= 0 && daysLeft < 7;
              
              return (
                <div
                  key={scholarship.id}
                  // CORRECTED: Changed from singular /scholarship/ to plural /scholarships/
                  // to match your App.tsx route definition
                  onClick={() => navigate(`/scholarships/${scholarship.id}`)}
                  className={`scholarship-list-card ${isExpired ? 'expired-opacity' : ''}`}
                >
                  <div className="scholarship-list-content">
                    <div className="scholarship-list-header">
                      <h3 className="scholarship-list-title">
                        {scholarship.name}
                      </h3>
                      <div className={`scholarship-match-badge ${getMatchBadgeClass(scholarship.matchPercentage || 0)}`}>
                        {scholarship.matchPercentage || 0}%
                      </div>
                    </div>

                    <p className="scholarship-list-description">
                      {scholarship.description}
                    </p>

                    <div className="scholarship-list-footer">
                      <div className="scholarship-deadline-info">
                        <span>{formatDate(scholarship.deadline)}</span>
                      </div>
                      <div className={`scholarship-days-badge ${
                        isExpired ? 'expired' :
                        isUrgent ? 'urgent' :
                        daysLeft > 30 ? 'good' :
                        'warning'
                      }`}>
                        {isExpired ? `Expired ${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}
                      </div>
                    </div>
                  </div>

                  <div className="scholarship-list-arrow">
                    →
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};