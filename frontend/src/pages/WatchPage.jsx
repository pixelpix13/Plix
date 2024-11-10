import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

const API_BASE_URL = "https://lqze31k6fk.execute-api.us-east-1.amazonaws.com";

const WatchPage = () => {
	const { id } = useParams();
	const [trailers, setTrailers] = useState([]); // Ensures trailers is always an array
	const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState({});
	const [similarContent, setSimilarContent] = useState([]);
	const sliderRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showArrows, setShowArrows] = useState(false);

	const handlePlay = () => setIsPlaying(true);
	const handlePause = () => setIsPlaying(false);

	// Auto-scroll similar movies every 5 seconds
	useEffect(() => {
		const autoScroll = setInterval(() => {
			if (sliderRef.current) {
				sliderRef.current.scrollBy({
					left: sliderRef.current.offsetWidth,
					behavior: "smooth",
				});
			}
		}, 5000);

		return () => clearInterval(autoScroll); // Clear interval on component unmount
	}, []);

	// Fetch trailers
	useEffect(() => {
		const getTrailers = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/movies/getMovieTrailers/${id}`);
				const data = await res.json();
				setTrailers(data.content?.trailerUrl ? [{ url: data.content.trailerUrl }] : []);
			} catch (error) {
				console.error("Error fetching trailers:", error);
				setTrailers([]);
			}
		};

		if (id) getTrailers();
	}, [id]);

	// Fetch similar movies
	useEffect(() => {
		const getSimilarMovies = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/movies/getSimilarMovies/${id}`);
				const data = await res.json();
				setSimilarContent(data.similar || []);
			} catch (error) {
				console.error("Error fetching similar movies:", error);
				setSimilarContent([]);
			}
		};
		getSimilarMovies();
	}, [id]);

	// Fetch movie details
	useEffect(() => {
		const getMovieDetails = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/movies/getMovieDetails/${id}`);
				const data = await res.json();
				setContent(data.content || {});
			} catch (error) {
				console.error("Error fetching movie details:", error);
				setContent(null);
			} finally {
				setLoading(false);
			}
		};
		getMovieDetails();
	}, [id]);

	const handleNext = () => {
		if (currentTrailerIdx < trailers.length - 1) setCurrentTrailerIdx(currentTrailerIdx + 1);
	};
	const handlePrev = () => {
		if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
	};

	const scrollLeft = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	};
	const scrollRight = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	if (loading)
		return (
			<div className="min-h-screen bg-black p-10">
				<WatchPageSkeleton />
			</div>
		);

	if (!content) {
		return (
			<div className="bg-black text-white h-screen">
				<div className="max-w-6xl mx-auto">
					<Navbar />
					<div className="text-center mx-auto px-4 py-8 h-full mt-40">
						<h2 className="text-2xl sm:text-5xl font-bold">Content not found 😥</h2>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-black min-h-screen text-white">
			<div className="mx-auto container px-4 py-8 h-full">
				<Navbar />

				{trailers.length > 0 && (
					<div className="flex justify-between items-center mb-4">
						<button
							className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
							disabled={currentTrailerIdx === 0}
							onClick={handlePrev}
						>
							<ChevronLeft size={24} />
						</button>

						<button
							className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
							disabled={currentTrailerIdx === trailers.length - 1}
							onClick={handleNext}
						>
							<ChevronRight size={24} />
						</button>
					</div>
				)}

				<div className="relative aspect-video mb-8 p-2 sm:px-10 md:px-32">
					{/* Blurred background */}
					{content.posterUrl && (
						<div
							className="absolute inset-0 bg-cover bg-center filter blur-md opacity-50"
							style={{
								backgroundImage: `url(${content.posterUrl})`,
							}}
						/>
					)}

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black opacity-75"></div>

					{/* Trailer player with custom overlay */}
					<div className="relative z-10 flex flex-col items-center justify-center">
						<div className="relative w-full h-full mx-auto rounded-lg shadow-2xl overflow-hidden">
							<div className="absolute inset-0 bg-black opacity-20 backdrop-blur-lg"></div>
							<ReactPlayer
								controls
								width="100%"
								height="100%"
								className="mx-auto rounded-lg shadow-2xl"
								url={trailers[currentTrailerIdx]?.url}
								playing={isPlaying}
								onPlay={handlePlay}
								onPause={handlePause}
							/>

							{/* Custom Play Button */}
							{!isPlaying && (
								<div
									className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 hover:bg-opacity-70 cursor-pointer"
									onClick={handlePlay}
								>
									<PlayCircle size={80} className="text-white opacity-90 hover:opacity-100" />
								</div>
							)}
						</div>

						{/* Movie Title and Description Overlay */}
						<div className="absolute bottom-10 left-0 right-0 px-4 sm:px-8 md:px-16 lg:px-32 z-20 text-center text-white">
							<h2 className="text-3xl md:text-5xl font-bold mb-4">{content.title}</h2>
						</div>
					</div>
				</div>

				{/* movie details */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
					<div className="mb-4 md:mb-0">
						<h2 className="text-5xl font-bold">{content.title}</h2>
						<p className="mt-2 text-lg">
							{content.releaseYear} | {content.rating || "PG-13"}
						</p>
						<p className="mt-4 text-lg">{content.description}</p>
					</div>
					<img
						src={content.posterUrl}
						alt="Poster image"
						className="max-h-[600px] rounded-md"
					/>
				</div>

				{/* Similar Movies Carousel */}
				{similarContent.length > 0 && (
					<div
						className="bg-black text-white relative px-5 md:px-20 mt-12 w-full"
						onMouseEnter={() => setShowArrows(true)}
						onMouseLeave={() => setShowArrows(false)}
					>
						<h3 className="text-3xl font-bold mb-4 text-left">Similar Movies</h3>

						<div
							className="flex overflow-x-scroll space-x-4 scrollbar-hide"
							style={{
								scrollSnapType: "x mandatory",
								WebkitOverflowScrolling: "touch",
								overflowX: "scroll",
								msOverflowStyle: "none", // Hide scrollbar for IE and Edge
								scrollbarWidth: "none", // Hide scrollbar for Firefox
							}}
							ref={sliderRef}
						>
							{similarContent.map((item) => (
								<Link
									key={item.movieId}
									to={`/watch/${item.movieId}`}
									className="min-w-[200px] flex-shrink-0 scroll-snap-align-start"
								>
									<div className="rounded-lg overflow-hidden w-[300px] h-[400px] relative group">
										<img
											src={item.posterUrl}
											alt={item.movieName}
											className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
										/>
									</div>
									<p className="text-center mt-2 text-sm font-semibold text-gray-300 hover:text-white transition duration-300">
										{item.movieName.length > 20 ? item.movieName.slice(0, 20) + "..." : item.movieName}
									</p>
								</Link>
							))}
						</div>

						{/* Arrow buttons for scrolling */}
						{showArrows && similarContent.length > 0 && (
							<>
								<button
									className="absolute top-1/2 -translate-y-1/2 left-4 flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
									onClick={scrollLeft}
								>
									<ChevronLeft size={24} />
								</button>

								<button
									className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
									onClick={scrollRight}
								>
									<ChevronRight size={24} />
								</button>
							</>
						)}
					</div>
				)}


			</div>
		</div>
	);
};

export default WatchPage;
