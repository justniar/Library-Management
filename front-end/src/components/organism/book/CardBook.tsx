"use client";
import { BookProps } from "@/utils/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CardBook: React.FC<BookProps> = ({ id, image, title, author, stock }) => {
  const router = useRouter();
  const userID = 1; // 
  const [currentStock, setCurrentStock] = useState(stock);

  const handleBorrow = async () => {
    try {
      const response = await fetch(`http://localhost:8080/book/borrow/${userID}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to borrow book");
      }

      setCurrentStock((prevStock) => prevStock - 1); 
      router.push("/history"); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64 flex flex-col">
      <img src={image} alt={title} className="w-full h-60 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">By {author}</p>
        <p className="text-gray-500 text-sm mt-1">Stock: {currentStock}</p>
        <div className="mt-auto">
          <button
            onClick={handleBorrow}
            disabled={currentStock === 0}
            className={`mt-3 w-full px-4 py-2 text-white rounded-md ${
              currentStock > 0 ? "bg-red-900 hover:bg-red-950" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStock > 0 ? "Borrow" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardBook;
