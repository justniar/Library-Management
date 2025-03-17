import React, { useEffect, useState } from "react";
import { BorrowedBook } from "@/utils/types";

interface BookDetailsProps {
  book: BorrowedBook | null;
  onReturn: (bookId: number) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onReturn  }) => {
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (!book?.book_id) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/books/${book.book_id}/details`
        );
        if (!response.ok) throw new Error("Failed to fetch book details");

        const data = await response.json();
        setBookDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [book?.book_id]);

  if (!book) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">
        Select a book to view details
      </p>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <div className="w-full h-[460px] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                src={book.image.startsWith("http") ? book.image : `http://localhost:8080/${book.image.replace(/\\/g, "/")}`}
                alt={book.title}
              />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                className="flex-1 bg-red-900 text-amber-50 cursor-pointer dark:text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-red-800 dark:hover:bg-gray-500"
                onClick={() => book && onReturn(book.book_id)}
                disabled={isReturning}
              >
                {isReturning ? "Returning..." : "Return Book"}
              </button>
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {book.title}
            </h2>

            {loading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading book details...</p>
            ) : bookDetails ? (
              <>
                <p className="text-gray-700 dark:text-gray-400 mb-4 text-sm">
                  {bookDetails.description || "No description available."}
                </p>
                <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
                  <p>
                    <strong className="font-semibold">Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong className="font-semibold">Category:</strong> {book.category}
                  </p>
                  <p>
                    <strong className="font-semibold">Borrowed:</strong> {book.borrow_date}
                  </p>
                  <p>
                    <strong className="font-semibold">Return:</strong> {book.return_date || "Not Available"}
                  </p>
                  <p>
                    <strong className="font-semibold">Status:</strong>{" "}
                    <span className={`font-bold ${book.status === "Borrowed" ? "text-red-600" : "text-green-600"}`}>
                      {book.status}
                    </span>
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-6">Book Details</h3>
                <div className="grid grid-cols-2 gap-4 mt-2 text-gray-700 dark:text-gray-300 text-sm">
                  <p>
                    <strong className="font-semibold">Publisher:</strong> {bookDetails.publisher}
                  </p>
                  <p>
                    <strong className="font-semibold">Publication Year:</strong> {bookDetails.publication_year}
                  </p>
                  <p>
                    <strong className="font-semibold">Pages:</strong> {bookDetails.pages}
                  </p>
                  <p>
                    <strong className="font-semibold">Language:</strong> {bookDetails.language}
                  </p>
                  <p>
                    <strong className="font-semibold">ISBN:</strong> {bookDetails.isbn}
                  </p>
                </div>

                <h3 className="text-xl font-bold text-red-900 dark:text-white mt-6">
                  {book.synopsis}
                </h3>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Book details not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
