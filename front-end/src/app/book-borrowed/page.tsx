"use client";
import { useEffect, useState } from "react";

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  borrow_date: string;
}

export default function BorrowedBooks() {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const userID = 1; //contoh blm bisa login hiks

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/book/history/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }
        const data = await response.json();
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
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-600">By {book.author}</p>
              <p className="text-gray-500 text-sm">Borrowed on: {new Date(book.borrow_date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No books borrowed yet.</p>
        )}
      </div>
    </div>
  );
}
