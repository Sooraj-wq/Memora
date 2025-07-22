
function SearchButton({ searchTerm, onSearchChange }) {
    return (
        <>
            <div className="search-btn text-shadow-white">
                <div className="relative w-[70%] max-w-md mx-auto bg-gray-800 rounded-full text-shadow-white">
                    <input 
                        placeholder="Search by title..." 
                        className="rounded-full w-[75%] md:w-[85%] font-family-cabin h-10 bg-transparent py-1 pl-6 mr-5 outline-none border-2 text-white border-gray-800 placeholder-gray-400 shadow-sm hover:outline-none focus:ring-pink-600 focus:border-pink-600 text-sm" 
                        type="text" 
                        name="query" 
                        id="query"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="absolute inline-flex justify-center items-center h-8 w-12 text-xs text-white transition duration-150 ease-in-out rounded-full outline-none right-2 top-1 bg-pink-600 sm:px-4 sm:text-sm sm:font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                        <svg 
                            className="w-3 h-3 sm:h-4 sm:w-4" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}

export default SearchButton;