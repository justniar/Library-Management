"use client";

import DeleteModal from "@/components/atom/DeleteModal";
import Pagination from "@/components/atom/pagination";
import BookModal from "@/components/organism/book/BookModal";
import { AuthContext } from "@/context/AuthContext";
import { BookProps } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { RingLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";


const AdminDashboard = () => {
  const router = useRouter()
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authContext?.isUserAuthenticated();
      if (!isAuthenticated) {
        router.push("/");
      }
    };
  
    checkAuth();
  }, [authContext]);
  

  const [books, setBooks] = useState<BookProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookProps>({
    id:0,
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
  
  const [isEdit, setIsEdit] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookProps | null>(null);


  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/books?page=${currentPage}`);
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(data.total_pages)
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }
    try {
      const formDataToSend : any = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("publisher", formData.publisher || "");
      formDataToSend.append("publication_year", String(formData.publication_year) );
      formDataToSend.append("language", formData.language || "");
      formDataToSend.append("pages", String(formData.pages));
      formDataToSend.append("description", formData.description || "" );
      formDataToSend.append("isbn", String(formData.isbn));
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }
  
      const url = isEdit
        ? `http://localhost:8080/books/${formData.id}`
        : "http://localhost:8080/books";
  
      const method = isEdit ? "PUT" : "POST";
  
      console.log("Updating book with ID:", formData.id);
      console.log("FormData Sent:", [...formDataToSend.entries()]);
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update book" : "Failed to add book");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
        throw new Error(`Failed: ${response.status} - ${errorText}`);
      }
  
      console.log(formData.imageFile);
      toast.success(isEdit ? "Book updated successfully!" : "Book added successfully!");
      
      setIsModalOpen(false);
      setFormData({
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
        image: "",
      });
      setIsEdit(false); 
      
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
  
  const handleDelete = (book: BookProps) => {
    console.log("Delete button clicked for:", book);
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!bookToDelete) return;
  
    try {
      const response = await fetch(`http://localhost:8080/books/${bookToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete book");
      toast.success("Buku berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchBooks(); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({
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
      image: "",
    });
    setIsEdit(false);
  };
  

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-red-900 text-center mb-8">Admin Dashboard - Buku</h1>
      {loading && (
          <div className="flex justify-center mt-4">
          <RingLoader color="#9f0707" />
        </div>
      )}
      {error && <p className="text-center text-red-900">{error}</p>}
      <button onClick={() => setIsModalOpen(true)} className="bg-red-900 text-white px-4 py-2 rounded-lg mb-4">Tambah Buku</button>
      <BookModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEdit={isEdit}
        />
      <div className="w-full bg-gray-400">
        
      </div>
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
            {(books.map((book, index) => (
                <tr key={book.id} className="hover:bg-amber-100">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.category}</td>
                  <td className="p-3 text-center">{book.stock}</td>
                  <td className="p-3 text-center">
                    <img src={book.image?.startsWith("http") ? book.image : `http://localhost:8080/${book.image?.replace(/\\/g, "/")}`} alt={book.title} className="w-16 h-16 object-cover mx-auto" />
                  </td>
                  <td className="p-3 text-center space-x-2 text-red-900 text-2xl">
                    <button onClick={() => handleEdit(book)}>
                      <MdEdit />
                    </button>
                    <button onClick={()=>handleDelete(book)}>
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
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete} 
          bookTitle={bookToDelete?.title || ""} 
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminDashboard;
