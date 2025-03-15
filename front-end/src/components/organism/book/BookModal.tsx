import React from 'react'
import DropZone from './DropZone';

const BookModal = ({ isOpen, onClose, onSubmit, formData, setFormData }: any) => {
  if (!isOpen) return null;

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && files && files[0]) {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      (e.target.files[0]);
    }
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
          <DropZone onChange={handleFileChange}/>
          <div className="flex justify-between">
            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded-lg" onClick={onClose}>Batal</button>
            <button type="submit" className="bg-red-900 text-white py-2 px-4 rounded-lg">{formData.id ? "Update Buku" : "Tambah Buku"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal