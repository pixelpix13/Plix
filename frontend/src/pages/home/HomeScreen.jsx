import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import MovieSlider from "../../components/MovieSlider";

const HomeScreen = () => {
	const [movies, setMovies] = useState([]);
	const [imgLoading, setImgLoading] = useState(true);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				// Fetch data from Lambda function to retrieve a list of movies
				const response = await fetch("https://lqze31k6fk.execute-api.us-east-1.amazonaws.com/movies/getMovies"); // Adjust Lambda URL if needed
				const data = await response.json();
				setMovies(data.movies); // Assuming `movies` is the array of movie objects returned
			} catch (error) {
				console.error("Failed to fetch movies:", error);
			}
		};

		fetchMovies();
	}, []);

	if (movies.length === 0) {
		return (
			<div className="h-screen text-white relative">
				<Navbar />
				<div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
			</div>
		);
	}

	return (
		<>
			<div className="relative h-screen text-white">
				<Navbar />

				{/* Show the first movie as the hero image */}
				{imgLoading && (
					<div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
				)}

				<img
					src={movies[0].posterUrl || movies[0].backdropUrl} // Use `posterUrl` or adjust based on movie data structure from Lambda
					alt="Hero img"
					className="absolute top-0 left-0 w-full h-full object-cover -z-50"
					onLoad={() => setImgLoading(false)}
				/>

				<div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50" aria-hidden="true" />

				<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
					<div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />
					<div className="max-w-2xl">
						<h1 className="mt-4 text-6xl font-extrabold text-balance">{movies[0].title}</h1>
						<p className="mt-2 text-lg">
							{movies[0].releaseYear} | {movies[0].rating || "PG-13"}
						</p>
						<p className="mt-4 text-lg">
							{movies[0].description.length > 200 ? movies[0].description.slice(0, 200) + "..." : movies[0].description}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-10 bg-black py-10">
				<MovieSlider movies={movies} />
			</div>
		</>
	);
};

export default HomeScreen;
