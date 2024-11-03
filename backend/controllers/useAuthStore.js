import { useState } from 'react';
import axios from 'axios';

export function useAuthStore() {
    const [isSigningUp, setIsSigningUp] = useState(false);

    async function signup({ email, username, password }) {
        setIsSigningUp(true);

        try {
            const response = await axios.post('http://localhost:5000/auth/signup', {
                email,
                username,
                password
            });
            console.log('Signup successful:', response.data);
            // Handle successful signup (e.g., redirect to login or dashboard)
        } catch (error) {
            console.error('Error during signup:', error.response?.data || error.message);
            // Handle error (e.g., show an error message)
        } finally {
            setIsSigningUp(false);
        }
    }

    return {
        signup,
        isSigningUp,
    };
}
