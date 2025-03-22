"use client";

import Pagination from "@/components/atom/pagination";
import { AuthContext } from "@/context/AuthContext";
import { BorrowedBook } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function BorrowHistory() {
  const router = useRouter()
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authContext?.isUserAuthenticated();
      if (!isAuthenticated) {
        router.push("/");
      }
    };
  
    checkAuth();
  }, [authContext]);
    

  const [history, setHistory] = useState<BorrowedBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const displayedBooks = history.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          throw new Error("Token tidak tersedia");
        }
        
        const response = await fetch(`http://localhost:8080/book/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }
        const data = await response.json();
        console.log(data);
        setHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl text-red-900 font-bold mb-4 text-center">Borrowed Books</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse overflow-x-scroll">
          <thead>
            <tr className="bg-red-900 text-amber-50 rounded-lg">
              <th className="p-3 text-left">User Id</th>
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Borrowed Date</th>
              <th className="p-3 text-left">Returning Date</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedBooks.map((book) => (
              <tr key={book.id} className="border-b">
                <td className="p-3">{book.user_id}</td>
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
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(history.length / booksPerPage)}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
      </div>
    </div>
  );
};