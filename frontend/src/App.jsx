import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import VerifyCodePage from './pages/VerifyCodePage';
import LoginPage from './pages/LoginPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} /> {/* Replace with your home page */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/verify-code" element={<VerifyCodePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
