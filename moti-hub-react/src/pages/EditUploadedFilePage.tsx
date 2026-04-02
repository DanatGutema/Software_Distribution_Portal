import React, { useEffect, useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { FileText } from "lucide-react"; // <-- note icon from lucide-react
import { useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import api from "@/api/axios";

import { 
  saveChunk, 
  getChunk, 
  deleteChunk, 
  saveMetadata, 
  getMetadata, 
  deleteMetadata,

} from "@/utils/downloadDB";


// interface FileData {
//   id: number;
//   filename: string;
//   filetype: string;
//   keywords: string;
//   notes: string;
//   fileurl: string;
//   bankName: string;
//   machineType: string;
//   machineMode: string;
// }


interface FileData {
  id: number;
  filename: string;
  keywords: string;
  notes: string;
  fileurl: string;

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




const getFileType = (filename: string | undefined | null): string => {
    if (filename == null || typeof filename !== "string") return "";
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







const EditDownloadPage: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 20;


  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});
  const [pausedDownloads, setPausedDownloads] = useState<{[key: number]: boolean}>({});

  const navigate = useNavigate();
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const MAX_RETRIES = 3;
  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");



  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [editData, setEditData] = useState<Partial<FileData>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);


  const [newFile, setNewFile] = useState<File | null>(null);
  const [filenameTouched, setFilenameTouched] = useState(false);

 // const navigate = useNavigate();



  const handleCancelEdit = () => {
  setEditingFile(null);
  setEditData({});
};



const handleSaveEdit = async (id: number) => {
  try {
    const formData = new FormData();
    const skipKeys = ["swd", "unifiedAgent", "advanceNdc", "xfs", "bank", "machineType", "machineMode", "uploadedBy", "fileurl", "createdAt"];
    Object.entries(editData).forEach(([key, value]) => {
      if (skipKeys.includes(key)) return;
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    // Append relation IDs
    if (editData.swd?.id) formData.append("swd", editData.swd.id.toString());
    if (editData.unifiedAgent?.id) formData.append("unifiedAgent", editData.unifiedAgent.id.toString());
    if (editData.advanceNdc?.id) formData.append("advanceNdc", editData.advanceNdc.id.toString());
    if (editData.xfs?.id) formData.append("xfs", editData.xfs.id.toString());
    if (newFile) {
      formData.append("file", newFile);
    }

   

    const res = await api.put(`/files/${id}`, formData);

    const updatedFile = res.data;

    setFiles((prev) =>
      prev.map((file) =>
        (file.id === id ? updatedFile : file))
    );

    setSaveSuccess(true);
    setEditingFile(null);
    setEditData({});
    setNewFile(null);
    // Show success message, then refresh and stay on this page (ProtectedRoute loading fix avoids 404)
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (err) {
    console.error(err);
    alert("Failed to update file");
  }
};









  // Fetch uploaded files from backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/files/files");
        // const data = await res.json();
        const res = await api.get("/files/files");
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);



  

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
const uniqueFileTypes = [...new Set(files.map(f => getFileType(f?.filename)))];
const uniqueFileStatus = [...new Set(files.map(f => f.status).filter(Boolean))];

const [swdOptions, setSwdOptions] = useState<{id: number, name: string}[]>([]);
useEffect(() => {
  api.get("/swd").then(res => setSwdOptions(res.data)).catch(console.error);
}, []);

const [xfsOptions, setXfsOptions] = useState<{id: number, name: string}[]>([]);
useEffect(() => {
  api.get("/xfs").then(res => setXfsOptions(res.data)).catch(console.error);
}, []);

const [advanceNdcOptions, setAdvanceNdcOptions] = useState<{id: number, name: string}[]>([]);
useEffect(() => {
  api.get("/advanced-ndc").then(res => setAdvanceNdcOptions(res.data)).catch(console.error);
}, []);

const [unifiedAgentOptions, setUnifiedAgentOptions] = useState<{id: number, name: string}[]>([]);
useEffect(() => {
  api.get("/unified-agent").then(res => setUnifiedAgentOptions(res.data)).catch(console.error);
}, []);

 // Filtered files (safe for API shape: optional chaining so no crash after save)
const filteredFiles = files.filter((file) => {
  const lowerSearch = (searchTerm ?? "").toLowerCase();
  const fileType = getFileType(file?.filename);

  const matchesGlobalSearch =
    (file?.filename ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.keywords ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.notes ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.bank?.name ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.machineType?.name ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.machineMode?.name ?? "").toLowerCase().includes(lowerSearch) ||
    (file?.status ?? "").toLowerCase().includes(lowerSearch) ||
    (fileType ?? "").toLowerCase().includes(lowerSearch);

  const matchesFilename =
    !filterFilename || (file?.filename ?? "") === filterFilename;

  const matchesBank =
    !filterBank || (file?.bank?.name ?? "") === filterBank;

  const matchesMachineType =
    !filterMachineType || (file?.machineType?.name ?? "") === filterMachineType;

  const matchesMachineMode =
    !filterMachineMode || (file?.machineMode?.name ?? "") === filterMachineMode;

  const matchesFileType =
    !filterFileType || (fileType ?? "") === filterFileType;


  
  const matchesFileStatus =
    !filterFileStatus || (file?.status ?? "") === filterFileStatus;  

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
  //const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  //const currentFiles = filteredFiles.slice(startIndex, startIndex + filesPerPage);

  // const handleDownload = async (file: FileData) => {
  //   try {
  //   const response = await api.get(
  //    `/files/${file.id}/download`,
  //    { responseType: "blob" }
  //     );
  //   const blob = response.data;
  //   const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = file.filename; // forces browser to download
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //     alert("Failed to download file.");
  //   }
  // };    


const handleDownload = async (file: FileData) => {
    const fileId = file.id;
    const fileName = file.filename;

    try {
      // 1️⃣ Get metadata (or fetch fresh)
      let totalSize = 0;
      let totalChunks = 0;
      const savedMeta = await getMetadata(fileId);

      if (savedMeta) {
        totalSize = savedMeta.totalSize;
        totalChunks = savedMeta.totalChunks;
        console.log("📦 Resuming from saved metadata");
      } else {
        const head = await fetch(`${BASE_URL}/api/files/${fileId}/chunk?start=0&end=0`, { credentials: "include" });
        const contentRange = head.headers.get("Content-Range");
        if (!contentRange) throw new Error("Could not get file size.");
        totalSize = parseInt(contentRange.split("/")[1]);
        totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
        await saveMetadata(fileId, { totalSize, totalChunks, fileName });
        console.log("🆕 Fresh download started");
      }

      // 2️⃣ Find where to resume
      let resumeChunkIndex = 0;
      for (let i = 0; i < totalChunks; i++) {
        const existing = await getChunk(`${fileId}-${i}`);
        if (existing) resumeChunkIndex = i + 1;
        else break;
      }
      console.log(`Resuming from chunk ${resumeChunkIndex} / ${totalChunks}`);

      // 3️⃣ Download missing chunks
      for (let i = resumeChunkIndex; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
        const chunkKey = `${fileId}-${i}`;

        let retries = 0;
        let success = false;
        while (!success && retries < MAX_RETRIES) {
          try {
            const response = await fetch(`${BASE_URL}/api/files/${fileId}/chunk?start=${start}&end=${end}`, { credentials: "include" });
            if (!response.ok) throw new Error(`Chunk ${i} failed`);
            const blob = await response.blob();
            await saveChunk(chunkKey, blob);
            success = true;
          } catch (err) {
            retries++;
            if (retries === MAX_RETRIES) throw err;
            await new Promise(r => setTimeout(r, 1000 * retries));
          }
        }

        // Update progress
        setDownloadProgress(prev => ({
          ...prev,
          [fileId]: Math.round(((i + 1) / totalChunks) * 100),
        }));
      }

      // 4️⃣ Merge chunks
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

      // 5️⃣ Cleanup metadata
      await deleteMetadata(fileId);


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

  // Pagination
  //const totalPages = Math.ceil(files.length / filesPerPage);
  //const currentFiles = files.slice((currentPage - 1) * filesPerPage, currentPage * filesPerPage);

  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const currentFiles = filteredFiles.slice(
  (currentPage - 1) * filesPerPage,
  currentPage * filesPerPage
);
  

  return (
    <div 
    style={{ backgroundColor: "#F7F7F7" }}
    className="min-h-screen text-black p-3">
      <h1 className="text-2xl font-bold mb-6">📂 Edit Uploaded Files</h1>

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

      {/* Success message after save (visible after modal closes, before auto-refresh) */}
      {saveSuccess && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-medium">
          ✅ File updated successfully. 
        </div>
      )}

      {/* Files Table - internal horizontal scroll on small screens */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-800 rounded-lg">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className= "sticky top-0 bg-gray-900 z-10">
            <tr className="bg-white text-left">
              <th className="p-3 border-b border-gray-700">File Name</th>
              <th className="p-3 border-b border-gray-700">Bank Name</th>
              <th className="p-3 border-b border-gray-700">Machine Type</th>
              <th className="p-3 border-b border-gray-700">Machine Mode</th>
              <th className="p-3 border-b border-gray-700">Type</th>
              <th className="p-3 border-b border-gray-700">Keyword</th>
              <th className="p-3 border-b border-gray-700">Note</th>
              <th className="p-3 border-b border-gray-700">Action</th>
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

                  <td className="p-3 border-b border-gray-700 relative">
                      <div className="group inline-block cursor-pointer text-blue-600">
                            {/* {editingId === file.id ? (
                            <input
                            value={editData.filename ?? ""}
                            onChange={(e) =>
                            setEditData({ ...editData, filename: e.target.value })
                           }
                           className="border rounded px-2 py-1 text-sm w-full"
                           />
                        ) : ( */}
                                {file.filename}
                        {/* // )} */}





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


                 


                  <td className="p-3 border-b border-gray-700">
                         {/* {editingId === file.id ? (
                         <input
                         value={editData.keywords ?? ""}
                          onChange={(e) =>
                          setEditData({ ...editData, keywords: e.target.value })
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                           />
                           ) : ( */}
                             {file.keywords}
                          {/* )} */}
                  </td>

                  

                  <td className="p-3 border-b border-gray-700 relative text-center">
                        <div className="group inline-block cursor-pointer">
                              <FileText size={20} className="text-black-500 hover:text-blue-700" />

                    
                               <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 hidden group-hover:block 
                                       bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-64 text-sm text-black z-50">
                                       


                                       {/* {editingId === file.id ? (
                                           <textarea
                                           value={editData.notes ?? ""}
                                           onChange={(e) =>
                                           setEditData({ ...editData, notes: e.target.value })
                                           }
                                           className="border rounded px-2 py-1 w-full"
                                           />
                                        ) : ( */}
                                            {file.notes || "No notes available."}
                                         {/* )} */}

                                </div>
                        </div>
                  </td>
                


                  <td className="p-3 border-b border-gray-700 text-center space-x-2">
                 {/* {editingId === file.id ? (
    <>
      <button
        className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-200 mb-2"
        onClick={() => handleSaveEdit(file.id)}
      >
        Save
      </button>

      <button
        className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-300"
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </>
  ) : (
    <button
      className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-200"
      onClick={() => {
        setEditingId(file.id);
        setEditData({
          filename: file.filename,
          keywords: file.keywords,
          operatingSystem: file.operatingSystem,
          unifiedAgent: file.unifiedAgent,
          notes: file.notes,
          swd: file.swd,
          advanceNdc: file.advanceNdc,
          xfs: file.xfs,

        });
      }}
    >
      Edit
    </button>
  )} */}



                    <button
                    className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-200"
                    onClick={() => {
                      setEditingFile(file);
                      setEditData(file);
                    }}
                  >
                    Edit
                  </button>
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


   {/* ================= MODAL ================= */}

      {editingFile && (
        <div className="fixed inset-0 bg-[rgba(24,16,94,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-900 rounded w-full max-w-lg max-h-[85vh] flex flex-col p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Edit File</h2>


{/* SCROLLABLE CONTENT */}
      <div className="overflow-y-auto pr-2 flex-1 space-y-3">
            {/* <input
              className="w-full mb-2 p-2 border rounded text-white"
              value={editData.filename || ""}
              onChange={e => setEditData({ ...editData, filename: e.target.value })}
            /> */}


            <div className="relative w-full mb-2">
              <p className="text-gray-400">File and File Name</p>
                      <input
                      className="w-full p-2 pr-10 border rounded text-white bg-blue-900"
                      value={editData.filename || ""}
                      onChange={(e) => {

                      setFilenameTouched(true); // 🔥 user has edited
                      setEditData((prev) => ({
                      ...prev, filename: e.target.value, }));
                      }
                    }
  />

  {/* Hidden file input */}
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                        const file = e.target.files?.[0];
      // if (file) {
      //   setNewFile(file);
      //   setEditData({ ...editData, filename: file.name });
      // }

                        if (!file) return;
                        setNewFile(file);
                        setEditData((prev) => ({
                        ...prev, 
                          // 🔥 only auto-fill if user has NOT typed
                        filename: filenameTouched ? prev.filename: file.name, // auto-fill ONCE
                      }));
                    }}
  />

  {/* File icon */}
  <button
    type="button"
    className="absolute right-2 mt-5 -translate-y-1/2 text-white hover:text-green-400"
    onClick={() =>
      document.getElementById("file-upload")?.click()
    }
  >
    <Paperclip size={18} />
  </button>
                             </div>


         <p className="text-gray-400">KeyWords</p>
            <input
              className="w-full mb-2 p-2 border rounded text-white"
              value={editData.keywords || ""}
              onChange={e => setEditData({ ...editData, keywords: e.target.value })}
            />


             {/* <p className="text-gray-400">Operating System</p>
            <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.operatingSystem || ""}
              onChange={e => setEditData({ ...editData, operatingSystem: e.target.value })}
            /> */}


            <p className="text-gray-400">Operating System</p>
            <select
                  className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
                  value={editData.operatingSystem || ""}
                  onChange={e => setEditData({ ...editData, operatingSystem: e.target.value })}
            >
            <option value="">Select OS</option>
            <option value="Microsoft Windows">Microsoft Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
            <option value="Ubuntu">Ubuntu</option>
            <option value="Fedora">Fedora</option>
            <option value="Debian">Debian</option>
            <option value="Chrome OS">Chrome OS</option>
          </select>
             
              {/* <p className="text-gray-400">Unified Agent</p>
            <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.unifiedAgent?.name || ""}
              onChange={e => setEditData({ ...editData, unifiedAgent: {id: 0, name: e.target.value}  })}
            /> */}

        <p className="text-gray-400">Unified Agent</p>
             <select
             className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
             value={editData.unifiedAgent?.id || ""}
             onChange={e => {
             const selected = unifiedAgentOptions.find(s => s.id === Number(e.target.value));
             setEditData({ ...editData, unifiedAgent: selected ? { id: selected.id, name: selected.name } : null });
            }}
          >
        <option value="">Select Unified Agent</option>
        {unifiedAgentOptions.map(s => (
        <option key={s.id} value={s.id}>{s.name}</option>
        ))}
        </select>

              <p className="text-gray-400">Notes</p>
              <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.notes || ""}
              onChange={e => setEditData({ ...editData, notes: e.target.value })}
            />

             {/* <p className="text-gray-400">SWD</p>
              <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.swd?.name || ""}
              onChange={e => setEditData({ ...editData, swd:{ id: 0, name: e.target.value } })}
            /> */}
        <p className="text-gray-400">SWD</p>
            <select
                className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
                value={editData.swd?.id || ""}
                onChange={e => {
                const selected = swdOptions.find(s => s.id === Number(e.target.value));
                setEditData({ ...editData, swd: selected ? { id: selected.id, name: selected.name } : null });
            }}
          >
          <option value="">Select SWD</option>
          {swdOptions.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
        </select>

             {/* <p className="text-gray-400">AdvanceNdc</p>
            <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.advanceNdc?.name || ""}
              onChange={e => setEditData({ ...editData, advanceNdc: { id: 0, name: e.target.value } })}
            /> */}
            <p className="text-gray-400">AdvanceNdc</p>
            <select
                className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
                value={editData.advanceNdc?.id || ""}
                onChange={e => {
                const selected = advanceNdcOptions.find(s => s.id === Number(e.target.value));
                setEditData({ ...editData, advanceNdc: selected ? { id: selected.id, name: selected.name } : null });
            }}
          >
          <option value="">Select AdvanceNdc</option>
          {advanceNdcOptions.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
        </select>

               {/* <p className="text-gray-400">Xfs</p>
            <textarea
              className="w-full mb-4 p-2 border rounded text-white"
              value={editData.xfs?.name || ""}
              onChange={e => setEditData({ ...editData, xfs: { id: 0, name: e.target.value } })}
            /> */}

<p className="text-gray-400">Xfs</p>
            <select
                className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
                value={editData.xfs?.id || ""}
                onChange={e => {
                const selected = xfsOptions.find(s => s.id === Number(e.target.value));
                setEditData({ ...editData, xfs: selected ? { id: selected.id, name: selected.name } : null });
            }}
          >
          <option value="">Select Xfs</option>
          {xfsOptions.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
        </select>

          <p className="text-gray-400">Status</p>
         <select
                required
                className="w-full mb-4 p-2 border rounded text-white bg-blue-900"
                value={editData.status || ""}
                onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              >
             <option value="" >
                   Select status
              </option>
              <option value="active">active</option>
              <option value="archived">archived</option>
          </select>

    
             </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditingFile(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => handleSaveEdit(editingFile.id)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
 


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

export default EditDownloadPage;