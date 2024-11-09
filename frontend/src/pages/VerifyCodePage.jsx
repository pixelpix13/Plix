import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyCodePage = () => {
	const [code, setCode] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	// Retrieve the email and username from the location state
	const { email, username } = location.state || {};

	const handleVerify = async (e) => {
		e.preventDefault();
		setErrorMessage("");

		try {
			// Use the API Gateway Invoke URL for the verify endpoint
			const response = await axios.post("https://lqze31k6fk.execute-api.us-east-1.amazonaws.com/verify", {
				username,
				code,
			});
			navigate("/login"); // Redirect to login page after successful verification
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Verification failed.");
			console.error("Verification error:", error.response?.data || error);
		}
	};

	return (
		<div className="h-screen w-full hero-bg flex flex-col items-center justify-center">
			<div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
				<h1 className="text-center text-white text-2xl font-bold mb-4">Verify Your Email</h1>
				<p className="text-gray-400 text-center mb-6">Enter the verification code sent to {email}.</p>

				{errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

				<form onSubmit={handleVerify} className="space-y-4">
					<div>
						<label htmlFor="code" className="text-sm font-medium text-gray-300 block">
							Verification Code
						</label>
						<input
							type="text"
							id="code"
							className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
							value={code}
							onChange={(e) => setCode(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
					>
						Verify
					</button>
				</form>
			</div>
		</div>
	);
};

export default VerifyCodePage;
