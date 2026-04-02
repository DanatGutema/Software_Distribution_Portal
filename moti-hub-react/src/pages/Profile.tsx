import React, { useEffect, useState } from "react";
import api from "@/api/axios";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";



const ProfilePage = () => {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState({
  fullname: "",
  email: "",
  role: 0,
  createdAt: "",
});


const roleMap: Record<number, string> = {
  0: "User",
  1: "Manager",
  2: "Admin",
};


const roleRouteMap: Record<number, string> = {
  0: "/user",
  1: "/dashboard",
  2: "/admin",
};




  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

   const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
       const targetRoute = roleRouteMap[user.role] || "/";
       navigate(targetRoute);
  }
  };




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/profile", {
        //   method: "GET",
        //   credentials: "include", // 🔥 important for auth cookie
        // });

        // if (!res.ok) throw new Error("Failed to fetch profile");

        // const data = await res.json();

        const res = await api.get("/profile");
        console.log("PROFILE RESPONSE:", res.data);
        setUser(res.data.user);
        //console.log("USER STATE:", data.user);

      } catch (error) {
        console.error("Unauthorized User", error);
              // 🔥 Redirect to login page immediately
       // window.location.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //if (loading) return <p className="p-6">Loading profile...</p>;

  if (!user) return <p className="p-6 text-red-500">No user data found</p>;





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



  return (
     <div className=" animated-bg min-h-screen flex items-center justify-center p-6"
     onClick={handleBackgroundClick}
     >

             {/* Added 5 bubbles */}
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div> 
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div> 
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            
    <div 
    ref={cardRef}
    onClick={(e) => e.stopPropagation()}
    className=" bg-blue-900 p-12 w-200 max-w-xl mx-auto mt-30">
      <h1 className="text-2xl font-bold mb-10 mt-4 text-white text-center">My Profile</h1>



      <div className="space-y-4  p-4 rounded shadow text-white text-center">
        <p><strong>Name:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* <p><strong>Role:</strong> {user.role}</p> */}
        <p>
        <strong>Role:</strong>{" "}
             {roleMap[user.role] ?? "Unknown"}
        </p>

        {/* <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p> */}
        <p>
          <strong>Created At:</strong>{" "}
          {user.createdAt? new Date(user.createdAt).toLocaleDateString(): "N/A"}
        </p>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
