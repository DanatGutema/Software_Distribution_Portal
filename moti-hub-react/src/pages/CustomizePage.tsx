// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const CustomizePage: React.FC = () => {
//   const [darkMode, setDarkMode] = useState(true);
//   const [notifications, setNotifications] = useState(true);
//   const [layout, setLayout] = useState("grid");

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
//       <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
//         <h1 className="text-2xl font-bold text-center">Customize App</h1>
//         <p className="text-gray-400 text-center">
//           Adjust your appearance and notification preferences below.
//         </p>

//         {/* Theme Toggle */}
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium">Dark Mode</span>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
//               darkMode ? "bg-blue-600" : "bg-gray-500"
//             }`}
//           >
//             <div
//               className={`bg-white w-5 h-5 rounded-full transform transition ${
//                 darkMode ? "translate-x-7" : "translate-x-0"
//               }`}
//             ></div>
//           </button>
//         </div>

//         {/* Notifications Toggle */}
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium">Notifications</span>
//           <button
//             onClick={() => setNotifications(!notifications)}
//             className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
//               notifications ? "bg-blue-600" : "bg-gray-500"
//             }`}
//           >
//             <div
//               className={`bg-white w-5 h-5 rounded-full transform transition ${
//                 notifications ? "translate-x-7" : "translate-x-0"
//               }`}
//             ></div>
//           </button>
//         </div>

//         {/* Layout Options */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Layout Style
//           </label>
//           <select
//             value={layout}
//             onChange={(e) => setLayout(e.target.value)}
//             className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="grid">Grid View</option>
//             <option value="list">List View</option>
//             <option value="compact">Compact View</option>
//           </select>
//         </div>

//         {/* Save and Back Buttons */}
//         <div className="flex flex-col gap-3 mt-6">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
//             Save Preferences
//           </button>
//           <Link
//             to="/settings"
//             className="text-blue-400 hover:underline text-center text-sm"
//           >
//             ← Back to Settings
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomizePage;
