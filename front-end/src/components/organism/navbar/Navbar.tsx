import React from 'react'
import { FaRegCircleUser } from 'react-icons/fa6';
import { IoMdLogOut } from 'react-icons/io';

interface NavbarProps {
    username: string;
}

const Navbar: React.FC<NavbarProps> = ({username}) => {
  return (
    <nav className='w-full h-15 bg-amber-50 p-4 shadow-md'>
        <div className='container mx-auto flex justify-end items-center'>
            <div className='flex items-center text-red-900 cursor-pointer'>
                <span className='font-semibold'>{username}</span>
                <FaRegCircleUser className='w-10' />
                <IoMdLogOut />
            </div>
        </div>
    </nav>
  )
}

export default Navbar