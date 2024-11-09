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
	login: async (credentials) => {
		set({ isLoggingIn: true, error: null });
		try {
			const response = await axios.post(`${API_BASE_URL}/login`, credentials);
			const token = response.data.token;
			console.log(response.data);
			if (token) {
				localStorage.setItem("jwtToken", token); // Store token
				set({ user: true, isLoggingIn: false, error: null }); // Set `user` to true to indicate successful login
			} else {
				toast.error("Login successful, but no token received");
				set({ isLoggingIn: false, error: "Login successful, but no token received" });
			}
		} catch (error) {
			set({ isLoggingIn: false, user: null, error: error.response?.data?.message || "Login failed" });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},

	// Function to check for existing token and set user state if token is valid
	checkAuth: () => {
		const token = localStorage.getItem("jwtToken");
		if (token) {
			set({ user: true, isCheckingAuth: false });
		} else {
			set({ user: null, isCheckingAuth: false });
		}
	},

	// Function to log out the user
	logout: () => {
		localStorage.removeItem("jwtToken");
		set({ user: null, isLoggingOut: false });
		toast.success("Logged out successfully");
	}
}));
