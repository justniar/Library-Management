import Navbar from "@/components/organism/navbar/Navbar";
import Sidebar from "@/components/organism/sidebar/Sidebar";

export default function Home() {
  const loggedInUser = "Salsabila"
  return (
    <>
     <Sidebar/>
     <Navbar username={loggedInUser}/>
     <div>
      <h1>Welcome to the Library {loggedInUser}!</h1>
     </div>
    </>
  );
}
