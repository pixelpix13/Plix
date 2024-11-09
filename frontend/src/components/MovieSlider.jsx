import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ movies }) => {
	const [showArrows, setShowArrows] = useState(false);
	const sliderRef = useRef(null);

	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	return (
		<div
			className="bg-black text-white relative px-5 md:px-20"
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className="mb-4 text-2xl font-bold">Movies</h2>

			<div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
				{movies.map((movie) => (
					<Link to={`/watch/${movie.id}`} className="min-w-[150px] relative group" key={movie.id}>
						<div className="rounded-lg overflow-hidden w-full h-[500px] relative">
							<img
								src={movie.posterUrl} // Adjust based on movie data structure from Lambda
								alt="Movie image"
								className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
							/>
							{/* Movie ID overlay on hover */}
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<p className="text-white text-lg font-semibold">{movie.id}</p>
							</div>
						</div>
						<p className="mt-2 text-center text-sm">{movie.title}</p>
					</Link>
				))}
			</div>

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
