"use client";

import Pagination from "@/components/atom/pagination";
import BookModal from "@/components/organism/book/BookModal";
import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

const AdminDashboard = () => {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookProps>({
    id: 0,
    title: "",
    author: "",
    category: "",
    stock: 0,
    publisher: "",
    publication_year: 0,
    pages: 0,
    language: "",
    description: "",
    isbn: "",
    image:"",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8
  const [isEdit, setIsEdit] = useState(false); 

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data.books);
      console.log(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const displayedBooks = books.slice(startIndex, endIndex);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("title", formData.title);
  //   formDataToSend.append("author", formData.author);
  //   formDataToSend.append("stock", formData.stock.toString()); 
  //   if (formData.imageFile) {
  //     formDataToSend.append("image", formData.imageFile);
  //   }
  
  //   try {
  //     const response = await fetch("http://localhost:8080/api/books", {
  //       method: "POST",
  //       body: formDataToSend,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to upload book");
  //     }
  
  //     const data = await response.json();
  //     console.log("Success:", data);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("stock", formData.stock.toString());
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }
  
      const url = isEdit
        ? `http://localhost:8080/api/books/${formData.id}`
        : "http://localhost:8080/api/books";
  
      const method = isEdit ? "PUT" : "POST";
  
      const response = await fetch(url, { method, body: formDataToSend });
  
      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update book" : "Failed to add book");
      }
  
      alert(isEdit ? "Book updated successfully!" : "Book added successfully!");
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save book");
    }
  };
  

  const handleEdit = (book: BookProps) => {
    setFormData(book);
    setIsEdit(true);
    setIsModalOpen(true);
  };
  

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      const response = await fetch(`http://localhost:8080/books/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete book");
      fetchBooks();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-red-900 text-center mb-8">Admin Dashboard - Buku</h1>
      {loading && <p className="text-center text-red-900">Loading...</p>}
      {error && <p className="text-center text-red-900">{error}</p>}
      <button onClick={() => setIsModalOpen(true)} className="bg-red-900 text-white px-4 py-2 rounded-lg mb-4">Tambah Buku</button>
      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
      />
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-900 text-white">
              <th className="p-3">#</th>
              <th className="p-3">Judul</th>
              <th className="p-3">Penulis</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Gambar</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(displayedBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-amber-100">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.category}</td>
                  <td className="p-3 text-center">{book.stock}</td>
                  <td className="p-3 text-center">
                    <img src={book.image.startsWith("http") ? book.image : `http://localhost:8080/${book.image.replace(/\\/g, "/")}`} alt={book.title} className="w-16 h-16 object-cover mx-auto" />
                  </td>
                  <td className="p-3 text-center space-x-2 text-red-900 text-2xl">
                    <button onClick={() => handleEdit(book)}>
                      <MdEdit />
                    </button>
                    <button onClick={() => handleDelete(book.id)}>
                      <MdOutlineDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(books.length / booksPerPage)}
            onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
