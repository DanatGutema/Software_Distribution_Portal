import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/moti_logo.png";
import { Contact } from "lucide-react";
import api from "@/api/axios";

const SignupPages: React.FC = () => {
  const navigate = useNavigate();


const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [contact, setContact] = useState("");
const [role, setRole] = useState("");
const [status, setStatus] = useState("");
const [createdAt, setCreatedAt] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");


const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone: string) => {
  const re = /^(0\d{9}|(\+251\d{9}))$/;
  return re.test(phone);
};



const validateName = (name: string) => {
    const re = /^[A-Za-z\s]+$/;
    return re.test(name);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // ✅ You’ll add signup logic here later



    //Validation checks
    if (!validateName(fullName)) {
        setError("Please enter a valid full name. Use letters and spaces only.");
        return;
    }


    if(!validateEmail(email)) {
        setError("please enter a valid email address.");
        return;
    }


    if (!validatePhone(contact)) {
    setError("Please enter a valid phone number starting with 09 and 10 digits long.");
    return;
}


    if(password.length < 4) {
        setError("Password must be at least 4 characters long.");
        return;
    }


    if(password !== confirmPassword) {
        setError("Password mismatch. Please re-enter your passwords.");
        return;
    }



    try {
      // ✅ Send signup data to backend
      // const response = await axios.post("http://localhost:5000/api/auth/signup", {
      //   fullname: fullName,
      //   email,
      //   password,
      //   contact,
      //   role,
      //   status,
      //   createdAt,

      // });
        const response = await api.post("/auth/signup", {
        fullname: fullName,
        email,
        password,
        contact,
        role,
        status,
        createdAt,

      });

    //if everything is valid
    setSuccess(response.data.message);
    console.log("Server Response:", response.data);

    //Later: send data to backend (Node + postgres)
  //   setTimeout(() => {
  //       navigate("/"); // Redirect after signup
  //   }, 1000);
    
  // };

      // Redirect to sign in after 1 second
      setTimeout(() => 
        navigate("/"), 1000);
    } catch (err: any) {
      if (err.response && err.response.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
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

        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-gray-400 mb-6">
          Enter your details below to create your account
        </p>

        <form onSubmit={handleSignup}>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            value= {fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            required
          />

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="m@example.com"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            required
          />


          <label className="block text-sm font-medium mb-1">Contact</label>
          <input
            type="tel"
            placeholder="0975424565"
            style={{ backgroundColor: "#e6e1e1" , color: "#242481"}}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            required
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            required
          />

          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-6 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            required
          />


          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-3 text-center">{success}</p>
          )}



          <button
            type="submit"
            style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
            className="w-full text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-gray-100 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPages;
