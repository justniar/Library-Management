"use client";

import { BorrowedBook } from "@/utils/types";
import { useState } from "react";

const initialBook: BorrowedBook[] = [
  { id: 1, title: "The Pragmatic Programmer", borrower: "Alice", borrowedDate: "2024-07-20", status: "Borrowed" },
  { id: 2, title: "Clean Code", borrower: "Bob", borrowedDate: "2024-07-18", status: "Borrowed" },
  { id: 3, title: "Design Patterns", borrower: "Charlie", borrowedDate: "2024-07-15", status: "Returned" },
];

const HistoryPage = () => {
  const [books, setBooks] = useState(initialBook);

  const handleReturn = (id: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, status: "Returned" } : book
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Borrowed Books</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-900 text-amber-50">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Borrower</th>
              <th className="p-3 text-left">Borrowed Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b">
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.borrower}</td>
                <td className="p-3">{book.borrowedDate}</td>
                <td className={`p-3 ${book.status === "Borrowed" ? "text-red-900" : "text-green-900"}`}>
                  {book.status}
                </td>
                <td className="p-3 text-center">
                  {book.status === "Borrowed" ? (
                    <button
                      onClick={() => handleReturn(book.id)}
                      className="bg-red-900 text-white px-4 py-1 rounded hover:bg-red-800"
                    >
                      Return
                    </button>
                  ) : (
                    <span className="text-gray-400">Returned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
