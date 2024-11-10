import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const emailParam = params.get("email");
		if (emailParam) {
			setEmail(emailParam);
		}
	}, [location]);

	const handleSignUp = async (e) => {
		e.preventDefault();
		setIsSigningUp(true);
		setErrorMessage("");

		try {
			// Use the API Gateway Invoke URL here
			const response = await axios.post("https://lqze31k6fk.execute-api.us-east-1.amazonaws.com/signup", {
				email,
				username,
				password,
			});

			// Redirect to verification page with email and username
			navigate("/verify-code", { state: { email, username } });
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "An error occurred during signup.");
			console.error("Signup error:", error.response?.data || error);
		} finally {
			setIsSigningUp(false);
		}
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
					<h1 className="text-center text-white text-2xl font-bold mb-4">Sign Up</h1>

					{errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

					<form className="space-y-4" onSubmit={handleSignUp}>
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
							<label htmlFor="username" className="text-sm font-medium text-gray-300 block">
								Username
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
								placeholder="johndoe"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
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
							disabled={isSigningUp}
						>
							{isSigningUp ? "Loading..." : "Sign Up"}
						</button>
					</form>
					<div className="text-center text-gray-400">
						Already a member?{" "}
						<Link to={"/login"} className="text-red-500 hover:underline">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
