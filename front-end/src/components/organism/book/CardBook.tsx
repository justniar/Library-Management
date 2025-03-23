"use client";
import { BookProps } from "@/utils/types";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DecodedToken {
  id: string; 
}

const CardBook: React.FC<BookProps> = ({ id, image, title, author, stock }) => {
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState(stock);

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

  const handleBorrow = async () => {
    if (!userID) {
      console.error("User ID not found or invalid!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/book/borrow/${userID}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to borrow book");
      }

      setCurrentStock((prevStock) => prevStock - 1); 
      router.push("/book-borrowed"); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64 flex flex-col">
      {/* <Image src={image} alt={title} width={100} height={60} className="object-cover"/> */}
      <img src={image?.startsWith("http") ? image : `http://localhost:8080/${image?.replace(/\\/g, "/")}`} alt={title} className="w-full h-60 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">By {author}</p>
        <p className="text-gray-500 text-sm mt-1">Stock: {currentStock}</p>
        <div className="mt-auto">
          <button
            onClick={handleBorrow}
            disabled={currentStock === 0}
            className={`mt-3 w-full px-4 py-2 text-white rounded-md ${
              currentStock > 0 ? "bg-red-900 hover:bg-red-950 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
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
