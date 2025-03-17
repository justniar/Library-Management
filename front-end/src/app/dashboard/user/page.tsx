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
  const [page, setPage] = useState(1);
  const limit = 8; 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/books?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  // const startIndex = (currentPage - 1) * booksPerPage;
  // const endIndex = startIndex + booksPerPage;
  // const displayedBooks = books.slice(startIndex, endIndex);

  return (
      <div className="w-full flex flex-col z-0">
        <Hero/>
        <div className="flex flex-wrap gap-4 m-4 justify-between">
          {loading ? (
            <p>Loading books</p>
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
          // totalPages={Math.ceil(books.length / booksPerPage)}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
      
  );
}
