import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation"; 

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  return (
    <nav className="w-full h-15 bg-amber-50 p-4 shadow-md">
      <div className="container mx-auto flex justify-end items-center">
        <div className="flex items-center text-red-900 cursor-pointer space-x-3">
          <span className="font-semibold">{username}</span>
          <FaRegCircleUser className="w-6 h-6" />
          <button onClick={handleLogout} className="hover:text-red-950">
            <IoMdLogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
