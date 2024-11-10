const WatchPageSkeleton = () => {
	return (
		<div className="animate-pulse space-y-4 p-4">
			{/* Title Placeholder */}
			<div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-md w-1/3 h-8 mb-4"></div>

			{/* Video Player Placeholder */}
			<div className="relative bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg w-full h-96 mb-6">
				<div className="absolute inset-0 bg-gray-700 opacity-30 rounded-lg"></div>
			</div>

			{/* Info Section Placeholder */}
			<div className="space-y-2">
				<div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-md w-1/2 h-6"></div>
				<div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-md w-1/3 h-6"></div>
			</div>

			{/* Description Placeholder */}
			<div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-md w-full h-24"></div>

			{/* Similar Movies Section Placeholder */}
			<div className="mt-8">
				<div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-md w-1/4 h-8 mb-4"></div>
				<div className="flex space-x-4 overflow-hidden">
					{[...Array(5)].map((_, idx) => (
						<div
							key={idx}
							className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg w-32 h-48 flex-shrink-0"
						></div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WatchPageSkeleton;

