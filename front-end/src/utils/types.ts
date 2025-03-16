export interface BookProps {
    id: number;
    title: string;
    author: string;
    category?: string;
    image?: string;
    stock: number;
    publisher?: string;
    publication_year?: number;
    pages?: number;
    language?: string;
    description?: string;
    isbn?: string;
    imageFile?: File | null;
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
  