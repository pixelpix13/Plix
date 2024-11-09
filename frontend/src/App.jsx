import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import VerifyCodePage from './pages/VerifyCodePage';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/home/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} /> {/* Replace with your home page */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/verify-code" element={<VerifyCodePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
