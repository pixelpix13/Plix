import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authUser.js";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	// Get state and functions from useAuthStore
	const { user, login, isLoggingIn, error } = useAuthStore();

	// When the user state changes to a logged-in state, navigate to the home page

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const emailParam = params.get("email");
		if (emailParam) {
			setEmail(emailParam);
		}
	}, [location]);
	
	useEffect(() => {
		
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMessage(""); // Clear previous errors
		await login({ email, password }); // Call the login function from useAuthStore
	};

	return (
		<div className="h-screen w-full hero-bg">
			<header className="max-w-6xl mx-auto flex items-center justify-between p-4">
				<Link to={"/"}>
					<img src="/plix-logo.png" alt="logo" className="w-52" />
				</Link>
			</header>

			<div className="flex justify-center items-center mt-20 mx-3">
				<div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
					<h1 className="text-center text-white text-2xl font-bold mb-4">Login</h1>

					{errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
					{error && <p className="text-red-500 text-center">{error}</p>}

					<form className="space-y-4" onSubmit={handleLogin}>
						<div>
							<label htmlFor="email" className="text-sm font-medium text-gray-300 block">
								Email
							</label>
							<input
								type="email"
								className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
								placeholder="you@example.com"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor="password" className="text-sm font-medium text-gray-300 block">
								Password
							</label>
							<input
								type="password"
								className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
								placeholder="••••••••"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							type="submit"
							className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
							disabled={isLoggingIn}
						>
							{isLoggingIn ? "Loading..." : "Login"}
						</button>
					</form>
					<div className="text-center text-gray-400">
						Don't have an account?{" "}
						<Link to={"/signup"} className="text-red-500 hover:underline">
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
