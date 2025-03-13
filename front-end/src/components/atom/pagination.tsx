import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
      <div className="lg:w-3/5 w-full flex items-center justify-between border-t border-gray-200">
        <button 
          className={`flex items-center pt-3 text-gray-600 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-red-900 cursor-pointer"}`}
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.1665 4L4.49984 7.33333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.1665 4.00002L4.49984 0.666687" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm ml-3 font-medium leading-none">Previous</p>
        </button>

        <div className="sm:flex hidden">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`text-sm font-medium leading-none cursor-pointer border-t pt-3 mr-4 px-2 ${
                currentPage === page ? "text-red-900 border-red-900" : "text-gray-600 hover:text-red-900 border-transparent hover:border-red-900"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          className={`flex items-center pt-3 text-gray-600 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:text-indigo-700 cursor-pointer"}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <p className="text-sm font-medium leading-none mr-3">Next</p>
          <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 7.33333L12.8333 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 0.666687L12.8333 4.00002" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
