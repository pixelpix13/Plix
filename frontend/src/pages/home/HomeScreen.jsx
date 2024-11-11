import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import MovieSlider from "../../components/MovieSlider";

const HomeScreen = () => {
	const [movies, setMovies] = useState([]);
	const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
	const [imgLoading, setImgLoading] = useState(true);
	const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
	const [moviesByGenre, setMoviesByGenre] = useState({});

	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await fetch("https://lqze31k6fk.execute-api.us-east-1.amazonaws.com/movies/getMovies");
				const data = await response.json();
				const movies = data.movies;

				setMovies(movies);

				// Filter out movies with empty or missing updatedAt, then sort by updatedAt and take top 10
				const sortedMovies = movies
					.filter(movie => movie.createdAt) // Exclude movies without updatedAt
					.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				
				const recentMovies = sortedMovies.slice(0, 10); // Get the top 10 recently updated movies
				setNewlyAddedMovies(recentMovies);

				// Group movies by genre
				const genreGroups = movies.reduce((acc, movie) => {
					const genre = movie.genre || 'Other';
					if (!acc[genre]) acc[genre] = [];
					acc[genre].push(movie);
					return acc;
				}, {});
				setMoviesByGenre(genreGroups);

			} catch (error) {
				console.error("Failed to fetch movies:", error);
			}
		};
		fetchMovies();
	}, []);

	// Automatically rotate the hero movie every 5 seconds
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
		}, 5000);

		return () => clearInterval(intervalId);
	}, [movies]);

	if (movies.length === 0) {
		return (
			<div className="h-screen text-white relative">
				<Navbar />
				<div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
			</div>
		);
	}

	const currentMovie = movies[currentMovieIndex];

	return (
		<>
			{/* Hero Section - Full Screen Layout */}
			<div className="relative w-full h-screen text-white overflow-hidden">
				<Navbar />

				{/* Loading shimmer overlay */}
				{imgLoading && (
					<div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
				)}

				{/* Hero Poster - Fullscreen */}
				<img
					src={currentMovie.backdropUrl || currentMovie.posterUrl}
					alt="Hero img"
					className="absolute top-0 left-0 w-full h-full object-cover -z-50"
					onLoad={() => setImgLoading(false)}
					style={{ filter: imgLoading ? 'blur(20px)' : 'none' }}
				/>

				{/* Stronger Gradient Overlay for Readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90 -z-40"></div>

				{/* Content Overlay */}
				<div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-32 text-left space-y-4">
					<h1 className="text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg">{currentMovie.title}</h1>
					<p className="mt-2 text-lg font-medium text-gray-300 drop-shadow-lg">
						{currentMovie.releaseYear} | {currentMovie.rating || "PG-13"}
					</p>
					<p className="mt-4 text-lg text-gray-200 leading-relaxed drop-shadow-lg max-w-2xl">
						{currentMovie.description.length > 200
							? currentMovie.description.slice(0, 200) + "..."
							: currentMovie.description}
					</p>
				</div>
			</div>

			{/* Movie Slider Sections */}
			<div className="flex flex-col gap-10 bg-black py-10">
				{/* Newly Added Movies Slider */}
				{newlyAddedMovies.length > 0 && (
					<MovieSlider movies={newlyAddedMovies} title="Newly Added Movies" />
				)}

				{/* Movies by Genre Sliders */}
				{Object.keys(moviesByGenre).map((genre) => (
					<MovieSlider key={genre} movies={moviesByGenre[genre]} title={`${capitalizeFirstLetter(genre)} Movies`} />
				))}
			</div>
		</>
	);
};

export default HomeScreen;
