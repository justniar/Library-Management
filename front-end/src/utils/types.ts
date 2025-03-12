export interface BookProps {
    id: number;
    image_url: string;
    title: string;
    author: string;
    stock: number;
    onBorrow: ()=>void;
}

export interface BorrowedBook {
    id: number;
    title: string;
    borrower: string;
    borrowedDate: string;
    status: "Borrowed" | "Returned";
  }