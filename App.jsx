import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './frontend/src/SignUpPage.jsx'; // Adjust path if necessary
import HomePage from './pages/HomePage';     // Assume you have a HomePage component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />       {/* Home route */}
                <Route path="/signup" element={<SignUpPage />} /> {/* Sign-up route */}
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
