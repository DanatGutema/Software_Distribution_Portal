import React, { useEffect, useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { FileText } from "lucide-react"; // <-- note icon from lucide-react
import api from "@/api/axios";
import { openDB } from "idb";

import { 
  saveChunk, 
  getChunk, 
  deleteChunk, 
  saveMetadata, 
  getMetadata, 
  deleteMetadata,
  
  type DownloadMetadata  // 👈 add this
} from "@/utils/downloadDB";

// To this:
//import streamSaver from "streamsaver";

interface FileData {
  id: number;
  filename: string;
  keywords: string;
  notes: string;
  //fileurl: string;

  uploadedBy: {
    id: number;
    fullname: string;
  };

  bank: {
    id: number;
    name: string;
  };

  machineType: {
    id: number;
    name: string;
  };

  machineMode: {
    id: number;
    name: string;
  };

  operatingSystem: string;
  // unifiedAgent: string;
  // swd: string;
  // advanceNdc: string;
  // xfs: string;

unifiedAgent: { id: number; name: string } | null;
swd: { id: number; name: string } | null;
advanceNdc: { id: number; name: string } | null;
xfs: { id: number; name: string } | null;
  createdAt: string;
  status: string;

}




const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      // Documents
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word";
      case "xls":
      case "xlsx":
        return "Excel";
      case "ppt":
      case "pptx":
        return "PowerPoint";
      case "txt":
        return "Text";
      case "rtf":
        return "Rich Text";
  
      // Images
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "webp":
        return "Image";
  
      // Video
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
      case "flv":
      case "wmv":
        return "Video";
  
      // Audio
      case "mp3":
      case "wav":
      case "ogg":
      case "flac":
      case "aac":
      case "m4a":
        return "Audio";
  
      // Compressed files
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return "Archive";
  
      // Code / Programming files
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "py":
      case "java":
      case "c":
      case "cpp":
      case "cs":
      case "html":
      case "css":
      case "json":
      case "xml":
      case "sh":
      case "bat":
        return "Code";
  
      // Default fallback
      default:
        return ext?.toUpperCase() || "File";
    }
  };



  const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700 border-green-400";
    case "archived":
      return "bg-gray-400 text-gray-700 border-gray-400";
    default:
      return "bg-blue-100 text-blue-700 border-blue-400";
  }
};

  

const DownloadPage: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 20;
  

  const CHUNK_SIZE = 1024 * 1024; // 1MB
  // IndexedDB setup
  const DB_NAME = "downloadDB";
  const STORE_NAME = "chunks";
  const [downloadProgress, setDownloadProgress] = useState<{[key: number]: number}>({});
  const [pausedDownloads, setPausedDownloads] = useState<{[key: number]: boolean}>({});

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





  // Fetch uploaded files from backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/files/files");
        const res = await api.get("/files/files");
        const data = res.data;

        //const data = await res.json();
        setFiles(data);
       
      } catch (err) {
        console.error("Error fetching files:", err);
        
      }
    };
    fetchFiles();
  }, []);

   
// // ✅ ADD THIS RIGHT HERE — after the fetchFiles useEffect
//   // Restore paused downloads state on page load/refresh
//   useEffect(() => {
//     const restorePausedState = async () => {
//       if (files.length === 0) return;
//       for (const file of files) {
//         const pausedData = await getPaused(file.id);
//         if (pausedData) {
//           setDownloadProgress(prev => ({ ...prev, [file.id]: pausedData.progress }));
//           setPausedDownloads(prev => ({ ...prev, [file.id]: true }));
//         }
//       }
//     };
//     restorePausedState();
//   }, [files]); // runs whenever files are loaded


// this is for the multi-filter search
const [filterFilename, setFilterFilename] = useState("");
const [filterBank, setFilterBank] = useState("");
const [filterMachineType, setFilterMachineType] = useState("");
const [filterMachineMode, setFilterMachineMode] = useState("");
const [filterFileType, setFilterFileType] = useState("");
const [filterFileStatus, setFilterFileStatus] = useState("");


  // Get unique values for filters
const uniqueFilenames = [...new Set(files.map(f => f.filename))];
const uniqueBanks = [...new Set(files.map(f => f.bank?.name).filter(Boolean))];
const uniqueMachineTypes = [...new Set(files.map(f => f.machineType?.name).filter(Boolean))];
// const uniqueMachineTypes = [...new Set(files.map(f => typeof f.machineType === "string" ? f.machineType : f.machineType.name))];
const uniqueMachineModes = [...new Set(files.map(f => f.machineMode?.name).filter(Boolean))];
const uniqueFileTypes = [...new Set(files.map(f => getFileType(f.filename)))];
const uniqueFileStatus = [...new Set(files.map(f => f.status).filter(Boolean))];






 // Filtered files
const filteredFiles = files.filter((file) => {
  const lowerSearch = searchTerm.toLowerCase();
  const fileType = getFileType(file.filename);

  const matchesGlobalSearch =
    file.filename.toLowerCase().includes(lowerSearch) ||
    file.keywords.toLowerCase().includes(lowerSearch) ||
    file.notes.toLowerCase().includes(lowerSearch) ||
    file.bank?.name.toLowerCase().includes(lowerSearch) ||
    file.machineType?.name.toLowerCase().includes(lowerSearch) ||
    file.machineMode?.name.toLowerCase().includes(lowerSearch) ||
    file.status.toLowerCase().includes(lowerSearch) ||
    fileType.toLowerCase().includes(lowerSearch);

  const matchesFilename =
    !filterFilename || file.filename === filterFilename;

  const matchesBank =
    !filterBank || file.bank.name === filterBank;

  const matchesMachineType =
    !filterMachineType || file.machineType.name === filterMachineType;

  const matchesMachineMode =
    !filterMachineMode || file.machineMode.name === filterMachineMode;

  const matchesFileType =
    !filterFileType || fileType === filterFileType;


  const matchesFileStatus =
    !filterFileStatus || file.status === filterFileStatus;  

  return (
    matchesGlobalSearch &&
    matchesFilename &&
    matchesBank &&
    matchesMachineType &&
    matchesMachineMode &&
    matchesFileStatus &&
    matchesFileType
    
  );
});

  



  // Pagination calculations
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const currentFiles = filteredFiles.slice(startIndex, startIndex + filesPerPage);


  

//   const m = async (file: FileData) => {
//   try {

//     const res = await api.get(
//       `/files/${file.id}/download`,
//       { responseType: "blob" } // 🔥 VERY IMPORTANT
//     );

//     const blob = new Blob([res.data]);

//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.filename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to download file");
//   }
// };




// const handleDownload = (file: FileData) => {
//   window.open(
//     `http://localhost:5000/api/files/${file.id}/download`,
//     "_blank"
//   );
// };











// // Open or create the IndexedDB
// const dbPromise = openDB(DB_NAME, 1, {
//   upgrade(db) {
//     if (!db.objectStoreNames.contains(STORE_NAME)) {
//       db.createObjectStore(STORE_NAME);
//     }
//   },
// });

// // Save a chunk to IndexedDB
// const saveChunk = async (key: string, chunk: Blob) => {
//   const db = await dbPromise;
//   await db.put(STORE_NAME, chunk, key);
// };

// // Get a chunk from IndexedDB
// const getChunk = async (key: string): Promise<Blob | undefined> => {
//   const db = await dbPromise;
//   return db.get(STORE_NAME, key);
// };

// // Get all chunks for merging
// const getAllChunks = async (): Promise<Blob[]> => {
//   const db = await dbPromise;
//   return db.getAll(STORE_NAME);
// };

// // Clear all chunks after download completes
// const clearChunks = async () => {
//   const db = await dbPromise;
//   await db.clear(STORE_NAME);
// };



// const handleDownload = async (file: FileData) => {
//   const fileId = file.id;
//   const fileName = file.filename;
//   const CHUNK_SIZE = 1024 * 1024; // 1MB
//   const MAX_RETRIES = 3;
//   const token = localStorage.getItem("token");


//   try {
//     // Step 1: Get file size
//     const head = await fetch(
//       `http://localhost:5000/api/files/${fileId}/chunk?start=0&end=0`,
//       { credentials: "include" }
//     );

//     const contentRange = head.headers.get("Content-Range");
//     if (!contentRange) throw new Error("Could not get file size from headers.");


//     const totalSize = parseInt(contentRange!.split("/")[1]);
//     let start = 0;
//     let chunkIndex = 0;


//      // Step 2: Download chunks
//     while (start < totalSize) {
//       const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);

//       const chunkKey = `${fileId}-${chunkIndex}`;

//       const existingChunk = await getChunk(chunkKey);

//       if (!existingChunk) {

//         let retries = 0;
//         let success = false;

//         while (!success && retries < MAX_RETRIES) {
//           try {
//         const response = await fetch(
//           // `http://localhost:5000/api/files/${fileId}/chunk?start=${start}&end=${end}`,
//           // { credentials: "include" }
          
//             `http://localhost:5000/api/files/${fileId}/chunk?start=${start}&end=${end}`,
//              {
//               //  headers: {
//               //  Authorization: `Bearer ${token}`,
//               credentials: "include",
//               //           },
//               }
//         );


//          if (!response.ok) throw new Error(`Chunk ${chunkIndex} failed`);

//         const blob = await response.blob();

//         await saveChunk(chunkKey, blob);

//          success = true;
//           } catch (err) {
//             retries++;
//             console.warn(`Retry ${retries}/${MAX_RETRIES} for chunk ${chunkIndex}`);
//             if (retries === MAX_RETRIES) throw err;
//           }
//         }
//       }

//       // Update progress
//       setDownloadProgress(prev => ({
//         ...prev,
//         [fileId]: Math.min(100, Math.round(((start + CHUNK_SIZE) / totalSize) * 100))
//       }));

//       start += CHUNK_SIZE;
//       chunkIndex++;
//     }

//     // Merge chunks
//     const chunks: Blob[] = [];

//     for (let i = 0; i < chunkIndex; i++) {
//       const chunk = await getChunk(`${fileId}-${i}`);
//       if (chunk) chunks.push(chunk);
//     }

//     const finalBlob = new Blob(chunks);

//     const url = window.URL.createObjectURL(finalBlob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     a.click();

//     window.URL.revokeObjectURL(url);

//   // Step 4: Cleanup IndexedDB chunks
//     for (let i = 0; i < chunkIndex; i++) {
//       await deleteChunk(`${fileId}-${i}`);
//     }

//     // Remove progress entry
//     setDownloadProgress(prev => {
//       const copy = { ...prev };
//       delete copy[fileId];
//       return copy;
//     });

//   } catch (err) {
//     console.error("Download failed:", err);
//     alert("Failed to download file. Please try again.");
//   }
// };








const handleDownload = async (file: FileData) => {
  const fileId = file.id;
  const fileName = file.filename;
  const CHUNK_SIZE = 1024 * 1024;
  const MAX_RETRIES = 3;
  //const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // To this:
  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");


  try {

     // ✅ Step 1: Try to get metadata from IndexedDB first (for true resume)
    let totalSize: number = 0;
    let totalChunks: number = 0;

    const savedMeta = await getMetadata(fileId);

    if (savedMeta) {
      // Resume: use saved metadata, no need to hit server
      totalSize = savedMeta.totalSize;
      totalChunks = savedMeta.totalChunks;
      console.log("📦 Resuming from saved metadata");
    } else {
    // Step 1: Get total file size
    const head = await fetch(
      `${BASE_URL}/api/files/${fileId}/chunk?start=0&end=0`,
      { 
        credentials: "include",
      }
    );



    // 👇 ADD THESE LOGS TEMPORARILY
console.log("Head status:", head.status);
console.log("Content-Range:", head.headers.get("Content-Range"));
console.log("All headers:", [...head.headers.entries()]);


    const contentRange = head.headers.get("Content-Range");
    if (!contentRange) throw new Error("Could not get file size.");

    totalSize = parseInt(contentRange.split("/")[1]);
    totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

      console.log("totalSize:", totalSize);
      console.log("CHUNK_SIZE:", CHUNK_SIZE);
      console.log("totalChunks:", totalChunks);

    // ADD THIS:
  await saveMetadata(fileId, { totalSize, totalChunks, fileName });
  console.log("🆕 Fresh download started");
    }
    // Step 2: Find where to resume from (skip already-saved chunks)
    let resumeChunkIndex = 0;
    for (let i = 0; i < totalChunks; i++) {
      const existing = await getChunk(`${fileId}-${i}`);
      if (existing) {
        resumeChunkIndex = i + 1; // this chunk is done, move to next
      } else {
        break; // first missing chunk — start here
      }
    }

    console.log(`Resuming from chunk ${resumeChunkIndex} / ${totalChunks}`);

    // Step 3: Download missing chunks
    for (let i = resumeChunkIndex; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
      const chunkKey = `${fileId}-${i}`;
      // Create a helper using your base URL
      //const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      // To this:
      //const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");


      let retries = 0;
      let success = false;

      while (!success && retries < MAX_RETRIES) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/files/${fileId}/chunk?start=${start}&end=${end}`,
            { credentials: "include" }
          );
          if (!response.ok) throw new Error(`Chunk ${i} failed`);
          const blob = await response.blob();
          await saveChunk(chunkKey, blob);
          success = true;
        } catch (err) {
          retries++;
          if (retries === MAX_RETRIES) throw err;
          await new Promise(r => setTimeout(r, 1000 * retries)); // backoff
        }
      }

      // Update progress
      setDownloadProgress(prev => ({
        ...prev,
        [fileId]: Math.round(((i + 1) / totalChunks) * 100),
      }));
    }





    // // Step 4: Merge all chunks in order
    // const chunks: Blob[] = [];
    // for (let i = 0; i < totalChunks; i++) {
    //   const chunk = await getChunk(`${fileId}-${i}`);
    //   if (!chunk) throw new Error(`Missing chunk ${i} during merge!`);
    //   chunks.push(chunk);
    // }

    // const finalBlob = new Blob(chunks);
    // const url = window.URL.createObjectURL(finalBlob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = fileName;
    // a.click();
    // window.URL.revokeObjectURL(url);

    // // Step 5: Cleanup
    // for (let i = 0; i < totalChunks; i++) {
    //   await deleteChunk(`${fileId}-${i}`);
    // }


   // ✅ REPLACE WITH THIS:
//const fileStream = streamSaver.createWriteStream(fileName, { size: totalSize });
//const writer = fileStream.getWriter();


 // Step 4: Merge and save file
    const chunks: Blob[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = await getChunk(`${fileId}-${i}`);
      if (!chunk) throw new Error(`Missing chunk ${i} during save!`);
      chunks.push(chunk);
      await deleteChunk(`${fileId}-${i}`);
    }

    const finalBlob = new Blob(chunks);
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);


    await deleteMetadata(fileId); // 🧹 clean up metadata from IndexedDB
    //await deletePaused(fileId); // ✅ ADD


    setDownloadProgress(prev => {
      const copy = { ...prev };
      delete copy[fileId];
      return copy;
    });

            // ✅ ADD THIS — clear paused state on successful completion
      setPausedDownloads(prev => {
        const copy = { ...prev };
        delete copy[fileId];
        return copy;
      });

  // } catch (err) {
  //   console.error("Download failed:", err);
  //   // ✅ Clear progress bar so paused message can show
  //   setDownloadProgress(prev => {
  //     const copy = { ...prev };
  //     delete copy[fileId];
  //     return copy;
  //   });
  //   setPausedDownloads(prev => ({ ...prev, [fileId]: true }));
  //   alert("Download failed. Your progress is saved — click download again to resume.");
  // }

  } catch (err) {
  console.error("Download failed:", err);

  setDownloadProgress(prev => {
    const copy = { ...prev };
    delete copy[fileId];
    return copy;
  });

  setPausedDownloads(prev => ({ ...prev, [fileId]: true }));
}
};



  return (
    <div 
    style={{ backgroundColor: "#F7F7F7" }}
    className="min-h-screen text-black p-3">
      <h1 className="text-2xl font-bold mb-6">📂 Download Files</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search files by name, keyword or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white border border-gray-700 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>



      {/* this is for the multi filter  */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

  {/* File Name */}
  <select
    value={filterFilename}
    onChange={(e) => setFilterFilename(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Files</option>
    {uniqueFilenames.map(name => (
      <option key={name} value={name}>{name}</option>
    ))}
  </select>

  {/* Bank */}
  <select
    value={filterBank}
    onChange={(e) => setFilterBank(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Banks</option>
    {/* {uniqueBanks.map(bank => (
      <option key={bank} value={bank}>{bank}</option> */}
      {uniqueBanks.map((bank, i) => (
  <option key={`${bank}-${i}`} value={bank}>
    {bank}
  </option>
    ))}
  </select>

  {/* Machine Type */}
  <select
    value={filterMachineType}
    onChange={(e) => setFilterMachineType(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Machine Types</option>
    {/* {uniqueMachineTypes.map(type => (
      <option key={type} value={type}>{type}</option> */}
      {uniqueMachineTypes.map((type, i) => (
        <option key={`type-${i}`} value={type}>{type}</option>
    ))}
  </select>

  {/* Machine Mode */}
  <select
    value={filterMachineMode}
    onChange={(e) => setFilterMachineMode(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Machine Modes</option>
    {/* {uniqueMachineModes.map(mode => (
      <option key={mode} value={mode}>{mode}</option> */}

      {uniqueMachineModes.map((mode, i) => (
        <option key={`mode-${i}`} value={mode}>{mode}</option>

    ))}
  </select>

  {/* File Type */}
  <select
    value={filterFileType}
    onChange={(e) => setFilterFileType(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Types</option>
    {/* {uniqueFileTypes.map(type => (
      <option key={type} value={type}>{type}</option> */}
                {uniqueFileTypes.map((type, i) => (
            <option key={`ftype-${i}`} value={type}>{type}</option>

    ))}
  </select>






  {/* File Status */}
  <select
    value={filterFileStatus}
    onChange={(e) => setFilterFileStatus(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Status</option>
    {/* {uniqueFileTypes.map(type => (
      <option key={type} value={type}>{type}</option> */}
                {uniqueFileStatus.map((status, i) => (
            <option key={`fstatus-${i}`} value={status}>{status}</option>

    ))}
  </select>

</div>


      {/* Files Table - internal horizontal scroll on small screens */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-800 rounded-lg">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className= "sticky top-0 bg-gray-900 z-10">
            <tr className="bg-white text-left">
              <th className="p-3 border-b border-gray-700">File Name</th>
              <th className="p-3 border-b border-gray-700">Bank Name</th>
              <th className="p-3 border-b border-gray-700">Machine Type</th>
              <th className="p-3 border-b border-gray-700">Machine Mode</th>
              <th className="p-3 border-b border-gray-700">Type</th>
              <th className="p-3 border-b border-gray-700">Keyword</th>
              <th className="p-3 border-b border-gray-700">Note</th>
              <th className="p-3 border-b border-gray-700">Status</th>
              <th className="p-3 border-b border-gray-700 text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.length > 0 ? (
              currentFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-white transition-colors"
                >
                  {/* <td className="p-3 border-b border-gray-700">{file.filename}</td> */}
                  <td className="p-3 border-b border-gray-700 relative">
                      <div className="group inline-block cursor-pointer text-blue-600">
                            {file.filename}

             {/* Hover details */}
                      <div className="absolute left-0 top-full mt-2 w-80 hidden group-hover:block 
                                bg-white border border-gray-300 rounded-lg shadow-lg 
                                p-4 z-50 text-sm text-black">

                            <p><strong>Uploaded By:</strong> {file.uploadedBy.fullname}</p>
                        
                          <hr className="my-2" />

                        <p><strong>OS:</strong> {file.operatingSystem}</p>
                        <p><strong>Unified Agent:</strong> {file.unifiedAgent?.name || "—"}</p>
                        <p><strong>SWD:</strong> {file.swd?.name || "—"}</p>
                        <p><strong>Advance NDC:</strong> {file.advanceNdc?.name || "—"}</p>
                        <p><strong>XFS:</strong> {file.xfs?.name || "—"}</p>

                    <hr className="my-2" />

                        <p className="text-xs text-gray-500">
                            Uploaded on {new Date(file.createdAt).toLocaleString()}
                        </p>
                    </div>
                   </div>
                  </td>

                  <td className="p-3 border-b border-gray-700">{file.bank.name}</td>
                  <td className="p-3 border-b border-gray-700">{file.machineType.name}</td>
                  <td className="p-3 border-b border-gray-700">{file.machineMode.name}</td>
                  <td className="p-3 border-b border-gray-700">{getFileType(file.filename)}</td>
                  <td className="p-3 border-b border-gray-700">{file.keywords}</td>
                  {/* <td className="p-3 border-b border-gray-700">{file.notes}</td> */}
                  

                  <td className="p-3 border-b border-gray-700 relative text-center">
                        <div className="group inline-block cursor-pointer">
                              <FileText size={20} className="text-black-500 hover:text-blue-700" />

                      {/* Tooltip */}
                               <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 hidden group-hover:block 
                                       bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-64 text-sm text-black z-50">
                                       {file.notes || "No notes available."}
                                </div>
                        </div>
                  </td>



                <td className="p-3 border-b border-gray-700 text-center">
                      <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold border
                            ${getStatusStyles(file.status)}
                            `}
                            disabled
                          >
                            {file.status}
                      </button>
                </td>


                <td className="p-3 border-b border-gray-700 text-center">
  {downloadProgress[file.id] !== undefined ? (
    <div className="flex flex-col items-center gap-1">
      <div className="w-24 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${downloadProgress[file.id]}%` }}
        />
      </div>
      <span className="text-xs text-blue-600 font-medium">
        {downloadProgress[file.id]}%
      </span>
    </div>
  ) : pausedDownloads[file.id] ? (
    <span className="text-xs text-red-500 font-semibold">⏸ Paused</span>
  ) : (
    <button
      onClick={() => handleDownload(file)}
      className="text-blue-400 hover:text-blue-600"
    >
      <Download size={20} />
    </button>
  )}
</td>


                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-400"
                >
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>





{/* Pagination Controls */}
<div className="flex justify-between items-center mt-4 text-black">
        <p>
          Page {currentPage} of {totalPages || 1}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md border border-gray-700 hover:bg-gray-800 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 rounded-md border border-gray-700 hover:bg-gray-800 ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DownloadPage;
