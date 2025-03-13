"use client";

import { BookProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

const BookModal = ({ isOpen, onClose, onSubmit, formData, setFormData }: any) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red-900 text-center mb-4">
          {formData.id ? "Edit Buku" : "Tambah Buku"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Judul Buku" className="w-full p-3 border rounded-lg" value={formData.title} onChange={handleChange} required />
          <input type="text" name="author" placeholder="Penulis" className="w-full p-3 border rounded-lg" value={formData.author} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Kategori" className="w-full p-3 border rounded-lg" value={formData.category} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stok" className="w-full p-3 border rounded-lg" value={formData.stock} onChange={handleChange} required />
          <input type="text" name="image_url" placeholder="URL Gambar" className="w-full p-3 border rounded-lg" value={formData.image_url} onChange={handleChange} required />
          <div className="flex justify-between">
            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded-lg" onClick={onClose}>Batal</button>
            <button type="submit" className="bg-red-900 text-white py-2 px-4 rounded-lg">{formData.id ? "Update Buku" : "Tambah Buku"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [books, setBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookProps>({ id: 0, title: "", author: "", category: "", stock: 1, image_url: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id ? `http://localhost:8080/books/${formData.id}` : "http://localhost:8080/books";
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!response.ok) throw new Error("Failed to save book");
      fetchBooks();
      setIsModalOpen(false);
      setFormData({ id: 0, title: "", author: "", category: "", stock: 1, image_url: "" });
    } catch (error: any) {
      setError(error.message);
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
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} />
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
                <td className="p-3 text-center"><img src={book.image_url} alt={book.title} className="w-16 h-16 object-cover mx-auto" /></td>
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
