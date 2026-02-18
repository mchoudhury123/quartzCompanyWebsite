import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="notfound-page">
      <div className="notfound-texture" />
      <div className="notfound-container">
        <div className="notfound-content">
          <span className="notfound-code">404</span>
          <h1 className="notfound-heading">Page Not Found</h1>
          <p className="notfound-text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="notfound-actions">
            <Link to="/" className="notfound-btn notfound-btn-primary">
              Back to Home
            </Link>
            <Link to="/colours" className="notfound-btn notfound-btn-outline">
              Browse Our Colours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
