import NavBar from "@/components/dashboard/navbar/navbar";
import SideBar from "@/components/dashboard/sidebar/sidebar";


export default function Dashboard() {
    return (
        <div>
            <div>
                <SideBar />
            </div>
            Dashboard
            <div>
                <NavBar />
            </div>
        </div>  
    );
}
  