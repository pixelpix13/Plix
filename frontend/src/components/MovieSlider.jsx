import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ movies, title }) => {
	const [showArrows, setShowArrows] = useState(false);
	const sliderRef = useRef(null);

	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({
				left: -sliderRef.current.offsetWidth / 2,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({
				left: sliderRef.current.offsetWidth / 2,
				behavior: "smooth",
			});
		}
	};

	return (
		<div
			className="bg-black text-white relative px-5 md:px-20"
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className="mb-4 text-2xl font-bold">{title}</h2>

			<div
				className="flex overflow-x-scroll space-x-4"
				style={{
					scrollSnapType: "x mandatory",
					WebkitOverflowScrolling: "touch",
					overflowX: "scroll",
					msOverflowStyle: "none", // Hide scrollbar for IE and Edge
					scrollbarWidth: "none", // Hide scrollbar for Firefox
				}}
				ref={sliderRef}
			>
				{movies.map((movie) => (
					<Link
						to={`/watch/${movie.id}`}
						className="min-w-[200px] flex-shrink-0 scroll-snap-align-start"
						key={movie.id}
					>
						<div className="rounded-lg overflow-hidden w-[300px] h-[400px] relative group">
							<img
								src={movie.posterUrl}
								alt={movie.title}
								className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
							/>
							{/* Movie ID overlay on hover */}
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							</div>
						</div>
						{/* Movie title below the poster */}
						<p className="text-center mt-2 text-sm font-semibold text-gray-300 hover:text-white transition duration-300">
							{movie.title.length > 20 ? movie.title.slice(0, 20) + "..." : movie.title}
						</p>
					</Link>
				))}
			</div>

			{/* Arrow buttons for scrolling */}
			{showArrows && (
				<>
					<button
						className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
};

export default MovieSlider;
