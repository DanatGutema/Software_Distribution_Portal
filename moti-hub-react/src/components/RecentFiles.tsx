import React, { useEffect, useState } from "react";
import api from "@/api/axios"; // use your axios instance

interface UserUpload {
  fullname: string;
  email: string;
  files: number;
}

const RecentFile: React.FC = () => {
  const [users, setUsers] = useState<UserUpload[]>([]);
  const [totalUploads, setTotalUploads] = useState<number>(0);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      try {
        //const res = await fetch("http://localhost:5000/api/files/recent-uploads");
         
        const res = await api.get("/files/recent-uploads");
        //const data = await res.json();
        setUsers(res.data.users);
        setTotalUploads(res.data.totalUploadsThisMonth);
      } catch (err) {
        console.error("Error fetching recent uploads:", err);
      }
    };

    fetchRecentUploads();
  }, []);


  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h2 className="font-semibold text-gray-700 mb-2">Recent Files</h2>
       <p className="text-sm text-gray-500 mb-4">
        Who added files this month? <span className="font-semibold">{totalUploads}</span> 
      </p>

      <div className="space-y-3">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent uploads found.</p>
        ) : (
          users.map((u, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {(u.fullname?.slice(0, 2)) || "NA"}

                </div>
                <div>
                  <p className="font-medium text-gray-800">{u.fullname}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                added <span className="font-semibold">{u.files}</span> files
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default RecentFile;
