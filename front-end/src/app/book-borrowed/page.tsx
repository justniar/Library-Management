"use client"
import { BorrowedBook } from "@/utils/types";
import { useEffect, useState } from "react";

export default function BorrowedBooks() {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const userID = 1; //

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/book/history/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }
        const data = await response.json();
        console.log(data);
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Borrowed Books</h1>
      <div className="mt-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="border p-4 rounded-md shadow-md mb-2">
              <h2 className="text-lg font-semibold">Book: {book.id}</h2>
              <p className="text-gray-600">Status: {book.status}</p>
              <p className="text-gray-500 text-sm">
                Borrowed on: {new Date(book.borrowedDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No books borrowed yet.</p>
        )}
      </div>
    </div>
  );
}
