import React from 'react';
import { useNavigate } from 'react-router-dom';
import './openingpage.css';


const OpeningPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="page-container">

      <div className="content">
        <h1 className="title">Welcome to Crickaro</h1>
        <p className="description">
          This platform is designed to connect cricket enthusiasts across Tamil Nadu.
          You can easily upload tournament notices or check for upcoming tournaments.
        </p>
        <div className="categories">
          <div className="category">
            <h2>Upload</h2>
            <p>
              If you're organizing a cricket tournament, upload your notice here.
              Teams from all districts in Tamil Nadu will be able to view it.
            </p>
          </div>
          <div className="category">
            <h2>User</h2>
            <p>
              Are you a team looking for tournaments?
              Check out our listings to find tournaments happening in your district.
            </p>
          </div>
        </div>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OpeningPage;
