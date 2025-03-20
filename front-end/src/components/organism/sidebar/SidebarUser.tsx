'use client'
import Link from "next/link";
import { JSX, useState } from "react";
import { FaBars, FaBook, FaHistory, FaHome, FaRegUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const SidebarUser = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex z-10 shadow-md">
      <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-amber-50 text-red-900 p-5 transition-all duration-300`}>
        <button onClick={() => setIsOpen(!isOpen)} className="text-red-900 p-2 focus:outline-none cursor-pointer">
          <FaBars className="w-6 h-6" />
        </button>

        <nav className="mt-5">
          <ul>
            <SidebarItem to="/dashboard/user" icon={<FaHome className="w-6 h-6" />} text="Dashboard" isOpen={isOpen} />
            <SidebarItem to="/book-borrowed" icon={<FaBook className="w-6 h-6" />} text="Book Borrowed" isOpen={isOpen} />
            <SidebarItem to="/history" icon={<FaHistory className="w-6 h-6" />} text="History" isOpen={isOpen} />

            <SidebarItem to="/profile" icon={<FaRegUserCircle className="w-6 h-6" />} text="Profile" isOpen={isOpen} />
            {/* <SidebarItem to="/settings" icon={<IoMdSettings className="w-6 h-6" />} text="Settings" isOpen={isOpen} /> */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

type SidebarItemProps = {
  to: string;
  icon: JSX.Element;
  text: string;
  isOpen: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, isOpen }) => (
  <li>
    <Link 
      href={to} 
      className="flex items-center p-3 hover:bg-red-900 hover:text-amber-50 rounded-lg transition-all"
    >
      {icon}
      {isOpen && <span className="ml-3 text-lg">{text}</span>}
    </Link>
  </li>
);

export default SidebarUser;
