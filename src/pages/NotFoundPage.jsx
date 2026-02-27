import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="notfound-page">
      <section className="notfound-hero">
        <div className="notfound-hero__content">
          <span className="notfound-hero__code">404</span>
          <h1 className="notfound-hero__title">Page Not Found</h1>
        </div>
      </section>

      <div className="notfound-body">
        <div className="notfound-body__inner">
          <p className="notfound-body__text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="notfound-body__actions">
            <Link to="/" className="notfound-body__btn notfound-body__btn--primary">
              Back to Home
            </Link>
            <Link to="/colours" className="notfound-body__btn notfound-body__btn--outline">
              Browse Our Colours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
