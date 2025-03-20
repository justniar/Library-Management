import { BookProps } from "@/utils/types";
import React, { useState } from "react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: BookProps;
  setFormData: React.Dispatch<React.SetStateAction<BookProps>>;
  isEdit: boolean;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }) => {
  if (!isOpen) return null;  
  
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

  if (!isOpen) return null;

  return (
    <div className="w-full md:inset-0 max-h-full fixed z-20 flex items-center justify-center backdrop-brightness-10">
      <div className="h-5/6 bg-white p-6 rounded-lg shadow-lg w-[600px] overflow-auto">
        <h2 className="text-xl text-red-900 font-bold mb-4 text-center">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h2>        
        <form onSubmit={onSubmit} className="w-full space-y-4">
          <div className="w-full flex justify-between gap-1">
            <input type="text" value={formData.title} name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" required />
            <input type="text" value={formData.author} name="author" placeholder="Author" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" required />
          </div>
          <div className="w-full flex justify-between gap-1">
            <input type="text" value={formData.category} name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
            <input type="number" value={formData.stock} name="stock" placeholder="Stock" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
          </div>
          <div className="w-full flex justify-between gap-1">
            <input type="text" value={formData.publisher} name="publisher" placeholder="Publisher" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
            <input type="number" value={formData.publication_year} name="publication_year" placeholder="Year" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
          </div>
          <div className="w-full flex justify-between gap-1">
            <input type="number" value={formData.pages} name="pages" placeholder="Pages" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
            <input type="text" value={formData.language} name="language" placeholder="Language" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />
          </div>
          <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="w-full h-50 p-1 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"></textarea>
          <input type="text" value={formData.isbn} name="isbn" placeholder="ISBN" onChange={handleChange} className="w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" />

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
            <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded">
              {isEdit ? "Update Book" : "Add Book"}
            </button>          
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
