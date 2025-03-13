"use client";
import CardBook from "@/components/organism/book/CardBook";
import Hero from "@/components/organism/carrousel/Hero";
import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8080/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
      <div className="w-full flex flex-col z-0">
        <Hero/>
        <div className="flex flex-wrap gap-4 m-4 justify-between">
          {loading ? (
            <p>Loading books</p>
          ) : error ? (
            <p>{error}</p>
          ): books.length > 0 ? (
            books.map((book)=>(
              <CardBook 
                key={book.id}
                id={book.id}
                image_url={book.image_url}
                title={book.title}
                author={book.author}
                stock={book.stock}
              />
            ))
          ) : (<p>no books available</p>)}
        </div>
      </div>
  );
}
