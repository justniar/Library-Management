"use client";

import Pagination from "@/components/atom/pagination";
import { BorrowedBook } from "@/utils/types";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface DecodedToken {
  id: string; 
}

const HistoryPage = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const [histories, setHistories] = useState<BorrowedBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserID(decoded.id); 
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userID) return; 
    const fetchHistoryBorrowedBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/book/history/${userID}?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }
        const data = await response.json();
        if (!data.history || !Array.isArray(data.history)) {
          throw new Error("API response does not contain a books array");
        }
        console.log(data);
        setHistories(data.history);
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistoryBorrowedBooks();
  }, [userID, currentPage]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl text-red-900 font-bold mb-4 text-center">Borrowed Books</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse overflow-x-scroll">
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
            {histories.map((history) => (
              <tr key={history.id} className="border-b">
                <td className="p-3 flex items-center">
                  <img 
                    src={history.image.startsWith("http") ? history.image : `http://localhost:8080/${history.image.replace(/\\/g, "/")}`}
                    alt={history.title} 
                    className="w-12 h-12 mr-3 rounded-md object-cover" />
                  <div>
                    <p className="font-semibold">{history.title}</p>
                    <p className="text-sm text-gray-500">{history.author}</p>
                  </div>
                </td>
                <td className="p-3">{history.category}</td>
                <td className="p-3">
                  {history.borrow_date ? new Date(history.borrow_date).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3">
                  {history.return_date ? new Date(history.return_date).toLocaleDateString() : "-"}
                </td>
                <td className={`p-3 ${history.status === "Borrowed" ? "text-red-900" : "text-green-900"}`}>
                  {history.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
