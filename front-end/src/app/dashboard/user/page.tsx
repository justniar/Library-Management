"use client";
import Pagination from "@/components/atom/pagination";
import CardBook from "@/components/organism/book/CardBook";
import Hero from "@/components/organism/carrousel/Hero";
import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

export default function Home() {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
  
        console.log("Fetched data:", data);
  
        if (!Array.isArray(data.books)) {
          throw new Error("API response does not contain a books array");
        }
  
        setBooks(data.books);
        setTotalPages(data.total_pages)
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, [currentPage]);  
  
  return (
      <div className="w-full flex flex-col z-0">
        <Hero/>
        <div className="flex flex-wrap gap-4 m-4 justify-between">
          {loading ? (
            <RingLoader/>
          ) : error ? (
            <p>{error}</p>
          ): (
            books.map((book)=>(
              <CardBook 
                key={book.id}
                id={book.id}
                image={book.image}
                title={book.title}
                author={book.author}
                stock={book.stock}
              />
            ))
          )}
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
      
  );
}
