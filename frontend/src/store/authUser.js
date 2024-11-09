import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_BASE_URL = "https://lqze31k6fk.execute-api.us-east-1.amazonaws.com"; // Replace with your actual API Gateway base URL

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	error: null,

	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post(`${API_BASE_URL}/signup`, credentials);
			set({ user: response.data.user, isSigningUp: false, error: null });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Signup failed");
			set({ isSigningUp: false, user: null, error: error.response?.data?.message });
		}
	},

	login: async (credentials) => {
		set({ isLoggingIn: true, error: null });
		try {
			const response = await axios.post(`${API_BASE_URL}/login`, credentials);
			const token = response.data.token;
			if (token) {
				localStorage.setItem("jwtToken", token); // Store token
				set({ user: true, isLoggingIn: false, error: null }); // Setting `user` to true to indicate successful login
			} else {
				toast.error("Login successful, but no token received");
				set({ isLoggingIn: false, error: "Login successful, but no token received" });
			}
		} catch (error) {
			set({ isLoggingIn: false, user: null, error: error.response?.data?.message || "Login failed" });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},

	logout: async () => {
		set({ isLoggingOut: true });
		try {
			localStorage.removeItem("jwtToken"); // Clear token on logout
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error("Logout failed");
		}
	},

	authCheck: async () => {
		set({ isCheckingAuth: true });
		const token = localStorage.getItem("jwtToken"); // Retrieve token
		if (!token) {
			set({ isCheckingAuth: false, user: null });
			return;
		}

		try {
			const response = await axios.get(`${API_BASE_URL}/verify`, {
				headers: {
					Authorization: `Bearer ${token}`, // Send token in headers for verification
				},
			});
			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			toast.error("Session expired, please log in again");
		}
	},
}));
