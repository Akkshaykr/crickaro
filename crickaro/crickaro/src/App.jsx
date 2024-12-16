import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpeningPage from './OpeningPage'; // Import OpeningPage
import Upload from './Upload';           // Ensure this file exists in the specified path
import LoginPage from './LoginPage';     // Ensure this file exists in the specified path
import DistrictPage from './DistrictPage'; // Ensure this file exists in the specified path
import TournamentPage from './TournamentPage'; // Tournament selection page
import Blog from './Blog'; // Ensure this file exists in the specified path
import Past from './Past'; // Import the Past component (make sure the file name is Past.jsx)
import Ongoing from './Ongoing'; // Import the Ongoing component
import Upcoming from './Upcoming'; // Import the Upcoming component
import './App.css'; // Custom styling for the entire app

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<OpeningPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Route for the upload page where users can upload their tournament notice */}
          <Route path="/upload" element={<Upload />} />
          
          {/* Route for viewing the list of districts */}
          <Route path="/district" element={<DistrictPage />} />
          
          {/* Route for viewing tournaments in a specific district, with the district name as a URL parameter */}
          <Route path="/tournament/:district" element={<TournamentPage />} />
          
          {/* Route for ongoing tournaments */}
          <Route path="/ongoing/:district" element={<Ongoing />} />
          
          {/* Route for upcoming tournaments */}
          <Route path="/upcoming/:district" element={<Upcoming />} />
          
          {/* Route for the blog page */}
          <Route path="/blog" element={<Blog />} />
          
          {/* Route for past tournaments */}
          <Route path="/past/:district" element={<Past />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
