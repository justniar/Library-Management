import React from 'react';

const Hero = () => {
  return (
    <div className="max-w-80% h-60 bg-red-900 rounded-2xl m-4 flex flex-col items-center justify-center text-center p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-amber-50 mb-2">Welcome to the Library!</h1>
      <p className="text-amber-50 text-sm mb-4">
        Discover a world of knowledge with our vast collection of books.
      </p>
      <button className="bg-amber-50 rounded-xl px-4 py-2 text-red-900 font-semibold transition-all duration-300 hover:bg-red-900 hover:text-white cursor-pointer">
        Explore More
      </button>
    </div>
  );
};

export default Hero;
