import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <h3 className="footer-title">ScholarshipHub</h3>
          <h1 className="footer-title">Some Data is dummy not all data is real for now</h3>
        <p className="footer-tagline">Empowering students through smart scholarship discovery.</p>
        <p className="footer-email">
          Email: <a href="mailto:contact@scholarshiphub.com">contact@scholarshiphub.com</a>
        </p>
        <p className="footer-copyright">
          © {currentYear} ScholarshipHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

