"use client";

import { BorrowedBook } from "@/utils/types";
import { useEffect, useState } from "react";

const HistoryPage = () => {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const userID = 1;

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

  // const handleReturn = async (bookID: number) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/book/return/${bookID}`, {
  //       method: "POST",
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to return book");
  //     }
  //     setBooks(books.map(book => 
  //       book.book_id === bookID ? { ...book, status: "Returned" } : book
  //     ));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl text-red-900 font-bold mb-4 text-center">Borrowed Books</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-900 text-amber-50">
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Borrowed Date</th>
              <th className="p-3 text-left">Returning Date</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b">
                <td className="p-3 flex items-center">
                  <img 
                    src={book.image.startsWith("http") ? book.image : `http://localhost:8080/${book.image.replace(/\\/g, "/")}`}
                    alt={book.title} 
                    className="w-12 h-12 mr-3 rounded-md object-cover" />
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                </td>
                <td className="p-3">{book.category}</td>
                <td className="p-3">
                  {book.borrow_date ? new Date(book.borrow_date).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3">
                  {book.return_date ? new Date(book.return_date).toLocaleDateString() : "-"}
                </td>
                <td className={`p-3 ${book.status === "Borrowed" ? "text-red-900" : "text-green-900"}`}>
                  {book.status}
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
