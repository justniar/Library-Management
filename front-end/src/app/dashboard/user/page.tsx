"use client";
import CardBook from "@/components/organism/book/CardBook";
import Hero from "@/components/organism/carrousel/Hero";
import Sidebar from "@/components/organism/sidebar/Sidebar";
import { BookProps } from "@/utils/types";

export default function Home() {
  const books : BookProps[] = [
    {
        id: 1,
        image_url: "https://id.images.search.yahoo.com/images/view;_ylt=Awrx.onLWNFnBmEbUBrNQwx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzhkZDIyNTYxNWUzNDVlM2E1ZmMyNTA5NmJmNjBmMTUzBGdwb3MDMgRpdANiaW5n?back=https%3A%2F%2Fid.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dthe%2Bgreat%2Bgatsby%2Bbook%26ei%3DUTF-8%26type%3DE210ID91215G0%26fr%3Dmcafee%26fr2%3Dsa-gp-search%26tab%3Dorganic%26ri%3D2&w=1889&h=2475&imgurl=hachette.imgix.net%2Fbooks%2F9780762498130.jpg%3Fauto%3Dcompress%2Cformat&rurl=https%3A%2F%2Fwww.hachette.com.au%2Ff-scott-fitzgerald-adam-simpson%2Fthe-great-gatsby-a-novel-illustrated-edition&size=585KB&p=the+great+gatsby+book&oid=8dd225615e345e3a5fc25096bf60f153&fr2=sa-gp-search&fr=mcafee&tt=The+Great+Gatsby%3A+A+Novel%3A+Illustrated+Edition+by+F.+Scott+Fitzgerald+...&b=0&ni=80&no=2&ts=&tab=organic&sigr=ee9GyaIHC_Lm&sigb=VHXyQvu5_WAf&sigi=2AJAJpQdy_hY&sigt=.9HnfxVQA4Iq&.crumb=4dyh93Xe/wn&fr=mcafee&fr2=sa-gp-search&type=E210ID91215G0",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        stock: 3,
        onBorrow: () => alert("You borrowed: The Great Gatsby"),
      },
      {
        id: 2,
        image_url: "https://tse4.mm.bing.net/th?id=OIP.T55C4BiOVfcS3WFdCM3xdwHaK2&pid=Api&P=0&h=180",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        stock: 0,
        onBorrow: () => alert("You borrowed: To Kill a Mockingbird"),
      },
  ]
  return (
      <div className="w-full flex flex-col z-0">
        <Hero/>
        <div className="flex gap-4 m-4">
            {books.map((book)=>(
                <CardBook 
                    key={book.id}
                    image_url={book.image_url}
                    title={book.title}
                    author={book.author}
                    stock={book.stock}
                    onBorrow={book.onBorrow}
                />
            ))}
        </div>
      </div>
  );
}
