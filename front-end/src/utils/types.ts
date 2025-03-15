export interface BookProps {
    id: number;
    image_url: string;
    imageFile?: null;
    title: string;
    author: string;
    stock: number;
    category?: string;
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
    description: string;
    synopsis: string;
    borrowedDate: string;
    returnDate?: string | null;
    status: string;
  }
  