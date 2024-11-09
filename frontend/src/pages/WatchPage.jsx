import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

	// Fetch trailers
	useEffect(() => {
		const getTrailers = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/movies/getMovieTrailers/${id}`);
				const data = await res.json();
				console.log("Fetched trailers data:", data); // Debugging log
	
				// Set trailers to be an array with a single object if trailerUrl is present
				setTrailers(data.content?.trailerUrl ? [{ url: data.content.trailerUrl }] : []);
			} catch (error) {
				console.error("Error fetching trailers:", error);
				setTrailers([]);
			}
		};
	
		if (id) {
			getTrailers();
		}
	}, [id]);
	
	
	
	// Fetch similar movies
	useEffect(() => {
		const getSimilarMovies = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/movies/getSimilarMovies/${id}`);
				const data = await res.json();
				setSimilarContent(data.similar || []); // Set similarContent to an empty array if undefined
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
				setContent(data.content || {}); // Set content to an empty object if undefined
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
			<div className='min-h-screen bg-black p-10'>
				<WatchPageSkeleton />
			</div>
		);

	if (!content) {
		return (
			<div className='bg-black text-white h-screen'>
				<div className='max-w-6xl mx-auto'>
					<Navbar />
					<div className='text-center mx-auto px-4 py-8 h-full mt-40'>
						<h2 className='text-2xl sm:text-5xl font-bold'>Content not found 😥</h2>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-black min-h-screen text-white'>
			<div className='mx-auto container px-4 py-8 h-full'>
				<Navbar />

				{trailers.length > 0 && (
					<div className='flex justify-between items-center mb-4'>
						<button
							className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
								currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed " : ""
							}`}
							disabled={currentTrailerIdx === 0}
							onClick={handlePrev}
						>
							<ChevronLeft size={24} />
						</button>

						<button
							className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
								currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed " : ""
							}`}
							disabled={currentTrailerIdx === trailers.length - 1}
							onClick={handleNext}
						>
							<ChevronRight size={24} />
						</button>
					</div>
				)}

				<div className='aspect-video mb-8 p-2 sm:px-10 md:px-32'>
					{trailers.length > 0 && trailers[currentTrailerIdx] ? (
						<ReactPlayer
							controls={true}
							width={"100%"}
							height={"70vh"}
							className='mx-auto overflow-hidden rounded-lg'
							url={trailers[currentTrailerIdx]?.url} // Assuming `url` is returned by Lambda
						/>
					) : (
						<h2 className='text-xl text-center mt-5'>
							No trailers available for{" "}
							<span className='font-bold text-red-600'>{content.title}</span> 😥
						</h2>
					)}
				</div>

				{/* movie details */}
				<div className='flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto'>
					<div className='mb-4 md:mb-0'>
						<h2 className='text-5xl font-bold'>{content.title}</h2>
						<p className='mt-2 text-lg'>
							{content.releaseYear} | {content.rating || "PG-13"}
						</p>
						<p className='mt-4 text-lg'>{content.description}</p>
					</div>
					<img
						src={content.posterUrl} // Assuming `posterUrl` is returned by Lambda
						alt='Poster image'
						className='max-h-[600px] rounded-md'
					/>
				</div>

				{similarContent.length > 0 && (
					<div className='mt-12 max-w-5xl mx-auto relative'>
						<h3 className='text-3xl font-bold mb-4'>Similar Movies</h3>
						<div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
							{similarContent.map((item) => (
								<Link key={item.id} to={`/watch/${item.id}`} className='w-52 flex-none'>
									<img
										src={item.posterUrl} // Assuming `posterUrl` for similar movies
										alt='Poster'
										className='w-full h-auto rounded-md'
									/>
									<h4 className='mt-2 text-lg font-semibold'>{item.title}</h4>
								</Link>
							))}

							<ChevronRight
								className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
								onClick={scrollRight}
							/>
							<ChevronLeft
								className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full'
								onClick={scrollLeft}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WatchPage;
