'use client'
import Link from "next/link";
import { JSX, useState } from "react";
import { FaBars, FaHome, FaRegUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white p-5 transition-all duration-300`}>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 focus:outline-none">
          <FaBars className="w-6 h-6" />
        </button>

        <nav className="mt-5">
          <ul>
            <SidebarItem to="/" icon={<FaHome className="w-6 h-6" />} text="Dashboard" isOpen={isOpen} />
            <SidebarItem to="/profile" icon={<FaRegUserCircle className="w-6 h-6" />} text="Profile" isOpen={isOpen} />
            <SidebarItem to="/settings" icon={<IoMdSettings className="w-6 h-6" />} text="Settings" isOpen={isOpen} />
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
  <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all">
    {icon}
    {isOpen && <Link href={to} className="ml-3 text-lg">{text}</Link>}
  </li>
);

export default Sidebar;
