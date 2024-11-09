import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";

const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();

	// Check for token on mount to determine if the user is logged in
	useEffect(() => {
		const token = localStorage.getItem("jwtToken");
		setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("jwtToken"); // Clear the token from localStorage
		setIsLoggedIn(false); // Set isLoggedIn to false
		navigate("/login"); // Redirect to login page
	};

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<header className="max-w-6xl mx-auto flex items-center justify-between p-4 h-20">
			<div className="flex items-center gap-10 z-50">
				<Link to="/">
					<img src="/plix-logo.png" alt="Logo" className="w-32 sm:w-40" />
				</Link>

				{/* Desktop navbar items */}
				<div className="hidden sm:flex gap-6 items-center">
					<Link to="/" className="hover:underline">Movies</Link>
					<Link to="/search" className="hover:underline">Search</Link>
					{isLoggedIn ? (
						<button onClick={handleLogout} className="hover:underline flex items-center">
							<LogOut className="mr-1" /> Logout
						</button>
					) : (
						<Link to="/login" className="hover:underline">Login</Link>
					)}
				</div>
			</div>

			{/* Mobile icons */}
			<div className="flex gap-2 items-center z-50 sm:hidden">
				<Link to="/search">
					<Search className="size-6 cursor-pointer" />
				</Link>
				<Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
			</div>

			{/* Mobile menu items */}
			{isMobileMenuOpen && (
				<div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
					<Link to="/" className="block hover:underline p-2" onClick={toggleMobileMenu}>Movies</Link>
					<Link to="/search" className="block hover:underline p-2" onClick={toggleMobileMenu}>Search</Link>
					{isLoggedIn ? (
						<button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="w-full p-2 hover:underline flex items-center">
							<LogOut className="mr-1" /> Logout
						</button>
					) : (
						<Link to="/login" className="block p-2 hover:underline" onClick={toggleMobileMenu}>Login</Link>
					)}
				</div>
			)}
		</header>
	);
};

export default Navbar;
