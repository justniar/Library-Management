import React from 'react'
import { FaRegCircleUser } from 'react-icons/fa6';

interface NavbarProps {
    username: string;
}

const Navbar: React.FC<NavbarProps> = ({username}) => {
  return (
    <nav className='bg-amber-50 p-4 shadow-md'>
        <div className='container mx-auto flex justify-end items-center'>
            <div className='flex items-center gap-2'>
                <FaRegCircleUser className='w-20' />
                <span className='text-red-900 font-semibold'>{username}</span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar