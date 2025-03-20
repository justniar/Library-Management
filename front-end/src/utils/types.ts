export interface BookProps {
    id: number;
    title: string;
    author: string;
    category?: string;
    imageUrl?: string;
    stock: number;
    publisher?: string;
    publication_year?: number;
    pages?: number;
    language?: string;
    description?: string;
    isbn?: string;
    imageFile?: File | null;
    image: "";
}

export interface BorrowedBook {
    id: number;
    user_id: number;
    book_id: number;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    synopsis: string;
    borrow_date: string;
    return_date?: string | null;
    status: string;
  }
  