import React, { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCards";
import RecentFile from "../components/RecentFiles";
import { Search, User, LogOut } from "lucide-react"; // for icons
//import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FileUploadForm from "../components/FileUploadForm"; 
import { Link } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth"; // ✅ useAuth hook



interface UserProfile {
  fullname: string;
  email: string;
  role?: string;
  contact?: string;
}


const UserDashboard: React.FC = () => {

  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);




  // const [role, setRole] = useState<number | null>(null);
  // useEffect(() => {
  //   const fetchRole = async () => {
  //     try {
  //       const res = await api.get("/auth/me");
  //       console.log("🔥 /api/me response:", res.data);
  //       setRole(res.data.role);
  //     } catch (err) {
  //       console.error("❌ /api/me error:", err);
  //       setRole(null);
  //       window.location.replace("/");
  //     }
  //   };
  //   fetchRole();
  // }, []);




    useEffect(() => {
    const hasReloaded = sessionStorage.getItem("dashboardReloaded");
  
    if (!hasReloaded) {
      sessionStorage.setItem("dashboardReloaded", "true");
      window.location.reload();
    }
  }, []);

  // const handleViewProfile = async () => {
  //   if (showProfile) {
  //     setShowProfile(false);
  //     return;
  //   }
  //   try {
  //     const res = await fetch("http://localhost:5000/auth/profile", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setProfile(data);
  //       setShowProfile(true);
  //     } else {
  //       alert("Failed to load profile");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };




useEffect(() => {
  const fetchProfile = async () => {
    try {
      // const res = await fetch("http://localhost:5000/api/auth/me", {
      //   method: "GET",
      //   credentials: "include",
      // });

      // if (res.ok) {
      //   const data = await res.json();
      //   console.log("PROFILE RESPONSE:", data);
      //   setProfile(data);
      const res = await api.get("/auth/me");
      setProfile(res.data);
      // } 
      // else {
      //   console.error("Failed to load profile");
      // }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();
}, []);



const handleViewProfile = () => {
  setShowProfile(prev => !prev);
};



  
  return (
    <div className="flex-1 p-8 overflow-auto">
       {/* Header Row */}
       <div className="flex items-center justify-between mb-6">
        {/* Left: Title */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
              {/* Right: Search + Profile */}
              <div className="flex items-center space-x-4">
          {/* Search Box */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div> */}




          
                   <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm">
                              <User className="text-gray-600" size={20} />
                          <span className="font-medium text-gray-700">
                               {profile ? profile.fullname : "Loading..."}
                         </span>
                    </div>
    









        </div>
      </div>




      {/* ✅ User Profile Section */}
      {showProfile && profile && (
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg mb-6 w-full max-w-2xl mx-auto transition-all duration-300">
          <h2 className="text-2xl font-bold mb-3">{profile.fullname}</h2>
          <p className="text-gray-400">Email: {profile.email}</p>
          <p className="text-gray-400">Role: {profile.role || "Not set"}</p>
          <p className="text-gray-400">Contact: {profile.contact || "Not set"}</p>
        </div>
      )}







      {/* Dashboard Content */}
      <DashboardCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">


        {/* upload cards dialog box open */}
        <Dialog>
             <DialogTrigger asChild>
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center text-gray-500 cursor-not-allowed opacity-60 h-64 pointer-events-none">
                  <h3 className="mb-2 font-semibold text-gray-700">Upload a file</h3>
                  <p className="text-gray-400 text-sm">(You don't have this privilege)</p>
                </div>
             </DialogTrigger>


             <DialogContent className="sm:max-w-md  text-white">
            <DialogHeader>
            <DialogTitle>Upload a New File</DialogTitle>
            </DialogHeader>
                  <FileUploadForm />
            </DialogContent>
        </Dialog>
         {/* <div className="bg-white p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center text-gray-500">
            <h3 className="mb-2 font-semibold">Upload a file</h3>
          <FileUploadForm />
       </div> */}
      

      <Link to="/downloads">
      <div className="bg-white p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:shadow-md transition h-64">
          {/* <h2 className="text-lg font-semibold">Downloads</h2> */}
          <h3 className="mb-2 font-semibold text-gray-700">View or download uploaded files</h3>
      </div>
         </Link>


        <RecentFile />
      </div>
    </div>
  );
};

export default UserDashboard;
