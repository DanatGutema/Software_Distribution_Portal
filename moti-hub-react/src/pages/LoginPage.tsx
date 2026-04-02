import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

import logo from "../assets/moti_logo.png";
import { useAuth } from "@/hooks/useAuth";


const LoginPages: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setRole } = useAuth();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    // ✅ Here you’ll handle authentication logic later
    //simple email and password validation
    if(!email || !password) {
      setError("please fill out this fields.");
      return;
    }



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }


    try {
      // const response = await axios.post(
      //    "http://localhost:5000/api/auth/login",
      //    { email, password },
      //    { withCredentials: true }
      // );

      const response = await api.post("/auth/login", {
            email,
            password,
       });



      console.log("✅ Login response:", response.data);

      console.log("Fetched user from backend:", response.data.user);

       const user = response.data.user; // user info returned from backend
        console.log("Fetched user from backend:", user);
  

      if (!user) {
        // show error message from backend
        setError(response.data.message || "Login failed");
        return;
      }   


    if (user.status !== "approved") {
      setError("Your account is pending approval. Please wait for admin approval.");
      return;
    }


// this is the code to ignore the OS motion preference and apply from the css    
//   useEffect(() => {
//   const prefersReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

//   if (prefersReduceMotion) {
//     const bg = document.querySelector('.animated-bg') as HTMLElement;
//     if (bg) {
//       // Force animations
//       bg.style.setProperty('animation', 'gradientBG 12s ease infinite');

//       // Force pseudo-elements animation
//       const styleSheet = document.styleSheets[0] as CSSStyleSheet;
//       styleSheet.insertRule(`
//         .animated-bg::before { animation: float 18s ease-in-out infinite !important; }
//       `, styleSheet.cssRules.length);
//       styleSheet.insertRule(`
//         .animated-bg::after { animation: float 18s ease-in-out 6s infinite !important; }
//       `, styleSheet.cssRules.length);
//     }
//   }
// }, []);




// Update auth state first, then navigate on next tick so context has new role when route mounts
      setRole(user.role);

      const targetPath =
        user.role === 2 ? "/admin" :
        user.role === 1 ? "/dashboard" :
        "/user";

      // Defer navigation so React commits the role update before ProtectedRoute reads it
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 0);
    } catch (err: any) {

        // Log **everything** from the error
  console.error("❌ Login error caught:");
  if (err.response) {
    // Backend responded with a status code outside 2xx
    console.error("Status:", err.response.status);
    console.error("Data:", err.response.data);
    console.error("Headers:", err.response.headers);
  } else if (err.request) {
    // Request was made but no response received
    console.error("No response received:", err.request);
  } else {
    // Something else triggered the error
    console.error("Error message:", err.message);
  }
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    // <div 
    // style={{ backgroundColor: "#F7F7F7" }} 
    // className="min-h-screen flex items-center justify-center text-white">
    <div className="animated-bg min-h-screen flex items-center justify-center text-white">

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
      style={{ backgroundColor: "#242481" }}
      className="p-8 rounded-2xl shadow-lg w-96">
      <div className="flex justify-center">
           <div className="w-9 h-9 sm:w-16 sm:h-16 md:w-12 md:h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center">
           <img
               src={logo}
               alt="MotiHub Logo"
              className="w-full h-full object-contain"
            />
           </div>
      </div>

        <h1 className="text-2xl font-bold mb-2">Login to your account</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Enter your email below to login to your account
        </p>

        <form onSubmit={handleLogin}>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}


        <label className="block text-sm font-medium mb-1">Email</label>
        <input
            type="email"
            style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
            placeholder="m@example.com"
            className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Password</label>
            <a href="#" className="text-sm text-gray-100 hover:underline">
              Forgot your password?
            </a>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
            className="w-full p-2 mb-6 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            className="w-full py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>

          {/* <button
            type="button"
            className="w-full mt-3 bg-gray-800 border border-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Login with Google
          </button> */}
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-gray-100 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPages;







