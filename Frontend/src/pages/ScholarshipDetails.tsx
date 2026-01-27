import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scholarshipAPI } from '../services/api';

export const ScholarshipDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScholarship = async () => {
      try {
        const response = await scholarshipAPI.getById(Number(id));
        const data = response.scholarship;

        if (data) {
          const processedScholarship = {
            ...data,
            eligibility: typeof data.eligibility === 'string' 
              ? data.eligibility.split('\n') 
              : data.eligibility,
            requiredDocuments: typeof data.required_documents === 'string' 
              ? data.required_documents.split('\n') 
              : data.required_documents,
          };
          setScholarship(processedScholarship);
        }
      } catch (error) {
        console.error('Failed to load scholarship:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadScholarship();
  }, [id]);

  if (loading) return <div className="details-loading"><div className="spinner"></div><p>Loading...</p></div>;
  if (!scholarship) return <div className="details-error"><h2>Not found</h2><button onClick={() => navigate('/scholarships')}>Back</button></div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
  const isExpired = daysLeft < 0;
  const isUrgent = daysLeft >= 0 && daysLeft < 7;

  return (
    <div className="scholarship-details-page">
      <div className="details-container">
        <div className="details-header-banner">
          <button className="back-btn" onClick={() => navigate('/scholarships')}>← Back</button>
          
          <div className="header-content">
            <div className={`match-badge-large ${(scholarship.matchPercentage || 0) >= 80 ? 'match-high' : 'match-medium'}`}>
              {scholarship.matchPercentage || 0}% Match
            </div>

            {/* NEW LOGIC: SHOW FAILED CRITERIA IF BELOW 100% */}
            {scholarship.matchPercentage < 100 && scholarship.failedCriteria?.length > 0 && (
              <div className="missing-criteria-box">
                <h4>Points missing due to:</h4>
                <ul>
                  {scholarship.failedCriteria.map((reason: string, index: number) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <h1>{scholarship.name}</h1>
            
            <div className="header-meta">
              <span className="amount-badge">₹ {scholarship.amount}</span>
              <span className={`deadline-badge ${isExpired ? 'expired' : isUrgent ? 'urgent' : ''}`}>
                {isExpired ? 'Closed' : `${daysLeft} days left`}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="main-info">
            <section className="details-section">
              <h2>About This Scholarship</h2>
              <p className="scholarship-about">{scholarship.description}</p>
            </section>

            <section className="details-section">
              <h2>Eligibility Criteria</h2>
              <ul className="eligibility-list">
                {scholarship.eligibility?.map((item: string, i: number) => (
                  <li key={i}><span className="check-icon">✓</span><span>{item}</span></li>
                ))}
              </ul>
            </section>
          </div>

          <div className="side-info">
             <section className="details-section">
              <h2>Documents</h2>
              <ul className="documents-list">
                {scholarship.requiredDocuments?.map((doc: string, i: number) => (
                  <li key={i}><span className="doc-icon">•</span><span>{doc}</span></li>
                ))}
              </ul>
            </section>

            <div className="details-apply-card">
               <h3>Ready to Apply?</h3>
               <a href={scholarship.official_website} target="_blank" rel="noreferrer" 
                  className={`btn-primary btn-large ${isExpired ? 'btn-disabled' : ''}`}>
                 {isExpired ? 'Application Closed' : 'Apply on Official Site'}
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};