export interface BookProps {
    id: number;
    image_url: string;
    title: string;
    author: string;
    stock: string;
    onBorrow: ()=>void;
}