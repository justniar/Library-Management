"use client";

import { BookProps } from '@/utils/types'
import React from 'react'

const CardBook: React.FC<Omit<BookProps, "id">> = ({image_url, title, author, stock, onBorrow}) => {
  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden w-64'>
        <img src={image_url} alt={title} className='w-full h-60 object-cover'/>
        <div className='p-4'>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <p className='text-gray-600 text-sm'>By {author}</p>
            <p className='text-gray-500 text-sm mt-1'>Stock: {stock}</p>
            <button
                onClick={onBorrow}
                disabled={stock === 0}
                className={`mt-3 w-full px-4 py-2 text-white rounded-md ${
                    stock > 0? "bg-red-900 hover:bg-red-950":"bg-gray-400 cursor-not-allowed"
                }`}    
            >
                {stock > 0 ? "Borrow" : "Out of Stock"}
            </button>
        </div>
    </div>
  )
}

export default CardBook