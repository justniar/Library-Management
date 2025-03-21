"use client";
import Pagination from "@/components/atom/pagination";
import CardBook from "@/components/organism/book/CardBook";
import Hero from "@/components/organism/carrousel/Hero";
import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        const sortedBooks = [...data.books].sort((a, b) => b.id - a.id);
        setBooks(sortedBooks);
  
        console.log("Fetched data:", data);
  
        if (!Array.isArray(data.books)) {
          throw new Error("API response does not contain a books array");
        }
  
        setBooks(sortedBooks); 
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);  
  

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const displayedBooks = books.slice(startIndex, endIndex);

  return (
      <div className="w-full flex flex-col z-0">
        <Hero/>
        <div className="flex flex-wrap gap-4 m-4 justify-between">
          {loading ? (
            <p>Loading books</p>
          ) : error ? (
            <p>{error}</p>
          ): (
            displayedBooks.map((book)=>(
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
          totalPages={Math.ceil(books.length / booksPerPage)}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
      
  );
}
