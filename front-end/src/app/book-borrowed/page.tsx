"use client";
import BookDetails from "@/components/organism/book/BookDetails";
import { BorrowedBook } from "@/utils/types";
import { useEffect, useState } from "react";

export default function BorrowedBooks() {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  
  const userID = 1;

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/book/history/${userID}`);
        if (!response.ok) throw new Error("Failed to fetch borrowed books");
        
        const data = await response.json();
        console.log("Fetched data:", data);
        const filteredBooks = data
          .filter((book: BorrowedBook) => book.status !== "returned")
          .map((book: BorrowedBook) => ({
            ...book,
            returnDate: book.return_date ? new Date(book.return_date).toLocaleDateString() : "Not Available",
            borrowedDate: new Date(book.borrow_date).toLocaleDateString(),
          }));

        setBooks(filteredBooks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBorrowedBooks();
  }, [userID]);

  const handleReturnBook = async (bookId: number) => {
    setIsReturning(true);
  
    try {
      console.log(`Returning book with ID: ${bookId}`);
  
      const response = await fetch(
        `http://localhost:8080/book/return/${userID}/${bookId}`,
        { method: "PUT" }
      );
  
      const responseData = await response.json();
      console.log("Response:", responseData);
  
      if (!response.ok) throw new Error(responseData.message || "Failed to return book");
  
      setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== bookId));
      setSelectedBook(null);
    } catch (error) {
      console.error("Error returning book:", error);
    } finally {
      setIsReturning(false);
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row gap-6 p-1 overflow-y-hidden">
      <div className="md:w-1/3 h-[100vh] bg-white shadow-lg rounded-lg p-5 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-red-900 mb-4"> Borrowed Books</h2>
        <ul className="space-y-3">
          {books.map((book) => (
            <li
              key={book.id}
              className={`p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer 
                ${
                  selectedBook?.id === book.id
                    ? "bg-red-100 border-red-400"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              onClick={() => setSelectedBook(book)}
            >
              <p className="text-lg font-medium text-gray-700">{book.title}</p>
              <p className="text-sm text-gray-500">{book.author}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:w-2/3">
        <BookDetails book={selectedBook} onReturn={handleReturnBook} />
      </div>
    </div>
  );
}
