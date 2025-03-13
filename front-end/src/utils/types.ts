export interface BookProps {
    id: number;
    image_url: string;
    title: string;
    author: string;
    stock: number;
    // onBorrow: ()=>void;
}

export interface BorrowedBook {
    id: number;
    user_id: number;
    book_id: number;
    title: string;
    author: string;
    category: string;
    image_url: string;
    borrowedDate: string;
    returnDate?: string | null;
    status: string;
  }
  