import { BookProps } from "@/utils/types";
import React, { useState } from "react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: BookProps;
  setFormData: React.Dispatch<React.SetStateAction<BookProps>>;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  if (!isOpen) return null;  
  // const [formData, setFormData] = useState<BookProps>({
  //   id: 0,
  //   title: "",
  //   author: "",
  //   category: "",
  //   imageFile: undefined,
  //   stock: 0,
  //   publisher: "",
  //   publication_year: new Date().getFullYear(),
  //   pages: 0,
  //   language: "",
  //   description: "",
  //   isbn: "",
  // });
  
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...(prev || {}), 
        imageFile: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("stock", String(formData.stock));
      formDataToSend.append("publisher", formData.publisher || "");
      formDataToSend.append("publication_year", String(formData.publication_year));
      formDataToSend.append("pages", String(formData.pages));
      formDataToSend.append("language", formData.language || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("isbn", formData.isbn || "");

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const response = await fetch("http://localhost:8080/books", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      alert("Book added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4 grid-cols-2 gap-2">
          <input type="text" name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="author" placeholder="Author" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="publisher" placeholder="Publisher" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="publication_year" placeholder="Year" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="number" name="pages" placeholder="Pages" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="language" placeholder="Language" onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          <input type="text" name="isbn" placeholder="ISBN" onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
              )}
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
