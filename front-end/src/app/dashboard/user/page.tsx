import Hero from "@/components/organism/carrousel/Hero";
import Navbar from "@/components/organism/navbar/Navbar";
import Sidebar from "@/components/organism/sidebar/Sidebar";

export default function Home() {
  const loggedInUser = "Salsabila"

  return (
    <>
    <div className="flex">
      <Sidebar/>
      <div className="w-full flex flex-col z-0">
        <Navbar username={loggedInUser}/>
        <Hero/>
      </div>
      
    </div>
    </>
  );
}
