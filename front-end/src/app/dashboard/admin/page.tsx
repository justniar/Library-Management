"use client";

import BookModal from "@/components/organism/book/BookModal";
import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

const AdminDashboard = () => {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
  const [formData, setFormData] = useState<BookProps>({ id: 0, title: "", author: "", category: "", stock: 1, image: "" });
  const [page, setPage] = useState(1);
  const limit = 8; // Always fetch 8 books per page
  const [totalPages, setTotalPages] = useState(1);
=======
  const [formData, setFormData] = useState<BookProps>({ id: 0, title: "", author: "", category: "", stock: 1, imageUrl: "" });
>>>>>>> parent of dda209a (feat: server side pagination)

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data: BookProps[] = await response.json();
      setBooks(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formDataToSend = new FormData();
  //   if (formData.image_url) formDataToSend.append("image", formData.image_url);
  //   try {
  //     const method = formData.id ? "PUT" : "POST";
  //     const url = formData.id ? `http://localhost:8080/books/${formData.id}` : "http://localhost:8080/books";
  //     const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
  //     if (!response.ok) throw new Error("Failed to save book");
  //     fetchBooks();
  //     setIsModalOpen(false);
  //     setFormData({ id: 0, title: "", author: "", category: "", stock: 1, image_url: null });
  //   } catch (error: any) {
  //     setError(error.message);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("stock", formData.stock.toString()); 
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/books", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload book");
      }
  
      const data = await response.json();
      console.log("Success:", data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const handleEdit = (book: BookProps) => {
    setFormData(book);
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
            {books.map((book, index) => (
              <tr key={book.id} className="hover:bg-amber-100">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category}</td>
                <td className="p-3 text-center">{book.stock}</td>
                <td className="p-3 text-center"><img src={book.imageUrl} alt={book.title} className="w-16 h-16 object-cover mx-auto" /></td>
                <td className="p-3 text-center space-x-2 text-red-900 text-2xl">
                  <button onClick={() => handleEdit(book)}><MdEdit />
                  </button>
                  <button onClick={() => handleDelete(book.id)}><MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
