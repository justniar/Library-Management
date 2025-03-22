import React, { useEffect, useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import Modal from "react-modal";

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    router.push("/auth/login");
  };

  
  return (
    <>
      <nav className="w-full h-15 bg-amber-50 p-4 shadow-md">
        <div className="container mx-auto flex justify-end items-center">
          <div className="flex items-center text-red-900 cursor-pointer space-x-3">
            <span className="font-semibold">{username || "Guest"} </span>
            <Link href="/profile"><FaRegCircleUser className="w-6 h-6"/></Link>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-red-950 cursor-pointer">
              <IoMdLogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed z-20 inset-0 flex items-center justify-center backdrop-brightness-10"
        ariaHideApp={false}
        >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold mb-4">Logout Confirmation</h2>
          <p>Are you sure you want to log out?</p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-950"
            >
              Yes, Logout
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
