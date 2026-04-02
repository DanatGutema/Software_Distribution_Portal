import React, { useEffect, useState } from "react";
//import { Home, Settings, Shield } from "lucide-react";
import logo from "../assets/moti_logo.png";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios"; // ✅ use axios instance

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {User, LogOut } from "lucide-react"; // for icons


const SiderUser: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<number | null>(null);
  
  
     useEffect(() => {
      // fetch("http://localhost:5000/api/auth/me", {
      //   credentials: "include",
      // })
      //   .then(async (res) => {
      //     if (!res.ok) {
      //       throw new Error("Not authenticated");
      //     }
      //     const data = await res.json();
  
       const fetchRole = async () => {
      try {
        const res = await api.get("/auth/me"); // ✅ use api
          // 🔥 LOG EVERYTHING
          console.log("🔥 /api/auth/me response:", res.data);
  
          setRole(res.data.role);
        } catch(err) {
          console.error("❌ /api/auth/me error:", err);
          setRole(null);
          window.location.replace("/");
        }
        };
          fetchRole();
    }, []);
  
  
    if (role === null) return null; // or loading spinner
  

   const handleViewProfile = () => {
    navigate("/profile");
  };



  
  const homePath =
  role === 0 ? "/user" :
  // role === 1 ? "/dashboard" :
  // role === 2 ? "/admin" :
  "/";


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

      
         


         {/* <a href="#" className="flex items-center space-x-2 text-blue-600 font-medium  mb-10">
            <Home size={18} /> <span>Dashboard</span>
          </a> */}



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
              //   onClick={async () => {
              //     await fetch("http://localhost:5000/api/auth/logout", {
              //       method: "POST",
              //       credentials: "include",
              //     });
              //     // window.location.href = "/";
              //       window.location.replace("/");
              //   }}
              // >
              onClick={async () => {
                  try {
                    await api.post("/auth/logout"); // ✅ use api
                    //window.location.replace("/");
                    // Clear role or auth state in React
                    setRole(null); // if role is local state
                    // Redirect to login using react-router
                    window.location.href = "/"; // or use navigate("/") if using useNav
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* 🔼 MENU ENDED */}








        {/* <nav className="space-y-4">
        
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
            </div>

        </nav> */}



      </div>

  

    </aside>
  );
};

export default SiderUser;
