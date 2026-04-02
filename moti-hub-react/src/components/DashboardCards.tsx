import React, { useState, useEffect } from "react";
import api from "@/api/axios"; // import your axios instance

const DashboardCard: React.FC = () => {

  const [recentCount, setRecentCount] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);
  const [documentCount, setDocumentCount] = useState<number>(0);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       // Fetch recently added files count
  //       const recentRes = await fetch("http://localhost:5000/api/files/recent-count");
  //       const recentData = await recentRes.json();
  //       setRecentCount(recentData.recentFiles);

  //       // Fetch counts by file type
  //       const typeRes = await fetch("http://localhost:5000/api/files/file-type-counts");
  //       const typeData = await typeRes.json();
  //       setImageCount(typeData.imageCount);
  //       setDocumentCount(typeData.documentCount);



  //       // const recentUploadsRes = await fetch("http://localhost:5000/api/files/recent-uploads");

  //     } catch (err) {
  //       console.error("Error fetching dashboard data:", err);
  //     }
  //   };

  //   fetchStats();
  // }, []);






useEffect(() => {
  const fetchStats = async () => {
    try {
      // Fetch recently added files count
      // const recentRes = await fetch("http://localhost:5000/api/files/recent-count", {
      //   credentials: "include", // only if your backend uses cookies/auth
      // });

      // if (!recentRes.ok) throw new Error(`HTTP error! status: ${recentRes.status}`);
      // const recentData = await recentRes.json();
      const recentRes = await api.get("/files/recent-count");
      setRecentCount(recentRes.data.recentFiles);

      
      // const typeRes = await fetch("http://localhost:5000/api/files/file-type-counts", {
      //   credentials: "include",
      // });

      // if (!typeRes.ok) throw new Error(`HTTP error! status: ${typeRes.status}`);
      // const typeData = await typeRes.json();
      const typeRes = await api.get("/files/file-type-counts");
      setImageCount(typeRes.data.imageCount);
      setDocumentCount(typeRes.data.documentCount);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  fetchStats();
}, []);




  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold text-gray-700">Recently Added Files</h2>
        <p className="text-3xl font-bold mt-2">{recentCount}</p>
        <p className="text-sm text-gray-500">files added in the last 7 days</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold text-gray-700">Image Files</h2>
        <p className="text-3xl font-bold mt-2">{imageCount}</p>
        <p className="text-sm text-gray-500">total image files</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold text-gray-700">Other Files</h2>
        <p className="text-3xl font-bold mt-2">{documentCount}</p>
        <p className="text-sm text-gray-500">total other files</p>
      </div>
    </div>
  );
};


export default DashboardCard;