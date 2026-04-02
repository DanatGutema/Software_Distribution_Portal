import React from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";

const SettingsPage: React.FC = () => {
  return (
    
    <div
    // style={{ backgroundColor: "#F7F7F7" }} 
    className="bg-gray-300 min-h-screen space-y-6 flex flex-col items-center justify-center text-center p-40 ">
      <h1 className="text-2xl font-bold text-black justify-center">Settings</h1>
      <p className="text-black">
        Manage your account preferences, notifications, and theme options here.
      </p>

      <div className="grid md:grid-rows-2 gap-6">
        {/* Account Settings */}
        <div className="p-5 border rounded-2xl shadow-sm bg-blue-900 text-white">
          <h2 className="font-semibold text-lg mb-3">Account Settings</h2>
          <p className="text-sm text-white mb-3">
            Update your profile information or change your password.
          </p>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button> */}
         
          <Link
               to="/edit-profile"
               className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
               >
                 Edit Profile
          </Link>

        </div>

        {/* App Preferences
        <div className="p-5 border rounded-2xl shadow-sm bg-gray-900 text-white ">
          <h2 className="font-semibold text-lg mb-3">App Preferences</h2>
          <p className="text-sm text-gray-500 mb-3">
            Choose theme, layout, and notification settings.
          </p>

          <Link
              to="/customize"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                  Customize
          </Link>
        </div> */}


      </div>
    </div>
  );
};

export default SettingsPage;
