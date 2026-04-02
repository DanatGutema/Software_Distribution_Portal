// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";



// interface UserProfile {
//     fullname: string;
//     role?: string;
//     contact?: string;
//     email: string;
//   }


// const EditProfilePage: React.FC = () => {

//     const [profile, setProfile] = useState<UserProfile>({
//         fullname: "",
//         role: "",
//         contact: "",
//         email: "",
//       });
//       const navigate = useNavigate();


//       // Fetch existing profile on load
//   useEffect(() => {
//     fetch("/auth/profile", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setProfile(data))
//       .catch(console.error);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/auth/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(profile),
//       });

//       if (res.ok) {
//         alert("Profile updated successfully!");
//         navigate("/dashboard"); // go back to dashboard
//       } else {
//         alert("Failed to update profile");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error updating profile");
//     }
//   };

  
//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
//       <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
//         <h1 className="text-2xl font-bold text-center">Edit Profile</h1>
//         <p className="text-gray-400 text-center">
//           Update your personal information below.
//         </p>

//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Role
//             </label>
//             <input
//               type="text"
//               placeholder="Update your role here"
//               className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-1">
//               Contact
//             </label>
//             <input
//               type="tel"
//               placeholder="Add your contact"
//               className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
//           >
//             Save Changes
//           </button>

//           <a
//             href="/settings"
//             className="block text-center text-sm text-blue-400 hover:underline mt-2"
//           >
//             ← Back to Settings
//           </a>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;




