import React, { useEffect, useState } from "react";
//import { Home, Settings, Shield } from "lucide-react";
import logo from "../assets/moti_logo.png";
import { Link } from "react-router-dom";
import api from "@/api/axios"; // ✅ use axios instance
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {User, LogOut } from "lucide-react"; // for icons
import { useAuth } from "@/hooks/useAuth";


// const role = Number(localStorage.getItem("role"));



const Sider: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {

  const navigate = useNavigate();
  //const { logout } = useAuth();
  //const [role, setRole] = useState<number | null>(null);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const { role, isLoading, logout } = useAuth();
 if (isLoading || role === null) return null;

  // useEffect(() => {
  //   const fetchRole = async () => {
  //     try {
  //       const res = await api.get("/auth/me");
  //       console.log("🔥 /api/me response:", res.data);
  //       setRole(res.data.role);
  //     } catch (err) {
  //       console.error("❌ /api/me error:", err);
  //       setRole(null);
  //     }
  //   };
  //   fetchRole();
  // }, []);

  // if (role === null) return null; // or loading spinner



 

    const handleLogout = async () => {
    await api.post("/auth/logout");
    // clear role in auth hook
    logout(); // make sure logout clears role in useAuth
    //onLogout?.(); // mark justLoggedOut = true in App
    navigate("/", { replace: true });
  };


  const homePath =
  role === 0 ? "/user" :
  role === 1 ? "/dashboard" :
  role === 2 ? "/admin" :
  "/";


    const handleViewProfile = () => {
    navigate("/profile");
  };

//   const handleLogout = async () => {
//   await logout(); // clears role and calls logout API
//   navigate("/", { replace: true }); // now safe, inside Router
// };










//if (isLoading || role === null) return null; // show spinner
  return (
    <aside
     style={{ backgroundColor: "#242481" }}
    className="w-full max-w-[280px] border-r h-full p-5 flex flex-col justify-between">
        <div>

         
          <Link to={homePath}>


           {/* Logo + title */}
            <div className="flex items-center space-x-2 mb-10">

           <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center cursor-pointer">
            <img src={logo} alt="MotiHub Logo" className="w-full h-full object-contain" />
          </div>
          
              <div className="cursor-pointer">
            <h1 className="font-bold text-lg text-white">MotiHub</h1>
            <p className="text-sm text-white">Your Digital Store</p>
          </div>

            </div>
          </Link>

      
         


        {/* 🔽 DROPDOWN MENU ADDED HERE */}
        <div className="mb-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            

              <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 w-fit">
                    <User className="text-gray-600" size={22} />
                  </div>


                  <div className="cursor-pointer text-white">
                    Account
                  </div>
             
              </div>


            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={handleViewProfile}>
                View Profile
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <Link to="/settings" className="w-full text-left">
                  Settings
                </Link>
              </DropdownMenuItem> */}

              <DropdownMenuItem
                className="text-red-600"
                // onClick={async () => {
                //   try {
                //   await api.post("/auth/logout"); // ✅ use api
                //     setRole(null); // if role is local state
                //    navigate("/", {replace:true}); // redirect using router
                //   } catch (err) {
                //     console.error("Logout failed:", err);
                //   }
                //     //window.location.replace("/");
                // }}
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* 🔼 MENU ENDED */}








        <nav className="space-y-4">
        
          <div className="flex flex-col space-y-3">
          <Link 
          to="/machine-types" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
             Manage Machine Types
          </Link>



              <Link 
          to="/machine-modes" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            Manage Machine Modes
            </Link>



            
          <Link 
          to="/banks" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            Manage Banks
          </Link>



          <Link 
          to="/edit-uploaded-files" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            Edit Uploaded File
          </Link>


          <Link 
          to="/unified-agent" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            Unified Agent
          </Link>



          <Link 
          to="/swd" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            SWD
          </Link>



          <Link 
          to="/advanced-ndc" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            Advanced NDC
          </Link>


          <Link 
          to="/xfs" 
          style={{ backgroundColor: "#F7F7F7" }}
          className="hover:bg-blue-700 text-black text-sm text-center font-small  px-4 py-2 rounded transition">
            XFS
          </Link>

            </div>

        </nav>
      </div>

  




      {/* <div>
           <Link to="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
           <Settings size={18} /> <span>Settings</span>
           </Link>
      </div> */}

    </aside>
  );
};

export default Sider;
