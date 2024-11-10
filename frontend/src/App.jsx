import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authUser'; // import the auth store
import SignUpPage from './pages/SignUpPage';
import VerifyCodePage from './pages/VerifyCodePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/home/HomePage';
import WatchPage from './pages/WatchPage';
import Navbar from './components/Navbar';

function App() {
    const { checkAuth, user, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth(); // Check if the user is authenticated when the app loads
    }, [checkAuth]);


    if (isCheckingAuth) {
        return <div>Loading...</div>; // Display a loading screen while checking auth
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={ <HomePage />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
                <Route path="/verify-code" element={user ? <Navigate to="/" /> : <VerifyCodePage />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
                <Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
