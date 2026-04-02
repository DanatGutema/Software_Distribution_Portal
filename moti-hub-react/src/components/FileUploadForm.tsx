import React, { useState, useEffect } from "react";
import api from "@/api/axios"; // ✅ use your axios instance


interface User {
  name: string;
  email: string;
}


interface MachineType {
  id: number;
  name: string;
}

interface MachineMode {
  id: number;
  name: string;
}

interface Bank {
  id: number;
  name: string;
}




interface UnifiedAgent {
  id: number;
  name: string;
}

interface SWD {
  id: number;
  name: string;
}

interface AdvancedNDC {
  id: number;
  name: string;
}

interface XFS {
  id: number;
  name: string;
}



const FileUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
   const [fileInputKey, setFileInputKey] = useState(Date.now()); // ✅ ADD THIS
  const [keywords, setKeywords] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  

  // New states
  const [banks, setBanks] = useState<Bank[]>([]);
  const [machineType, setMachineType] = useState("");
  const [machineMode, setMachineMode] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");

//it is specifically for the dropdown of unified agent, swd, advance ndc and xfs
  // const [unifiedAgent, setUnifiedAgent] = useState("");
  // const [swd, setSwd] = useState("");
  // const [advanceNdc, setAdvanceNdc] = useState("");
  // const [xfs, setXfs] = useState("");
const [unifiedAgent, setUnifiedAgent] = useState<UnifiedAgent[]>([]);
const [swd, setSwd] = useState<SWD[]>([]);
const [advanceNdc, setAdvanceNdc] = useState<AdvancedNDC[]>([]);
const [xfs, setXfs] = useState<XFS[]>([]);

const [unifiedAgentId, setUnifiedAgentId] = useState<number | "">("");
const [swdId, setSwdId] = useState<number | "">("");
const [advanceNdcId, setAdvanceNdcId] = useState<number | "">("");
const [xfsId, setXfsId] = useState<number | "">("");





  // 🔹 DB driven states
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [machineModes, setMachineModes] = useState<MachineMode[]>([]);
  const [machineTypeId, setMachineTypeId] = useState<number | "">("");
  const [machineModeId, setMachineModeId] = useState<number | "">("");
  // const [banks, setBanks] = useState<Bank[]>([]);
  const [bankId, setBankId] = useState<number | null>(null);



  
  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        // const res = await fetch("http://localhost:5000/api/auth/me", {
        //   credentials: "include", // include cookies if using sessions
        // });
        // if (!res.ok) throw new Error("Failed to fetch user");
        // const data = await res.json();


        setCurrentUser({ name: res.data.fullname, email: res.data.email });
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        //window.location.replace("/");
      }
    };
    fetchCurrentUser();
  }, []);




 // ---------------- MACHINE TYPES ----------------
  // useEffect(() => {
  //   fetch("http://localhost:5000/api/machine-types")
  //     .then(res => res.json())
  //     .then(setMachineTypes)
  //     .catch(console.error);
  // }, []);

    useEffect(() => {
    const fetchMachineTypes = async () => {
      try {
        const res = await api.get("/machine-types");
        setMachineTypes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMachineTypes();
  }, []);

  

  // ---------------- MACHINE MODES (DEPENDENT) ----------------
  // useEffect(() => {
  //   if (!machineTypeId) {
  //     setMachineModes([]);
  //     setMachineModeId("");
  //     return;
  //   }

  //   fetch(`http://localhost:5000/api/machine-modes/${machineTypeId}`)
  //     .then(res => res.json())
  //     .then(setMachineModes)
  //     .catch(console.error);
  // }, [machineTypeId]);


    useEffect(() => {
    if (!machineTypeId) {
      setMachineModes([]);
      setMachineModeId("");
      return;
    }

    const fetchMachineModes = async () => {
      try {
        const res = await api.get(`/machine-modes/${machineTypeId}`);
        setMachineModes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMachineModes();
  }, [machineTypeId]);



  //------------------------banks table---------------------------


// useEffect(() => {
//   fetch("http://localhost:5000/api/banks")
//     .then(res => res.json())
//     .then(setBanks);
// }, []);
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await api.get("/banks");
        setBanks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanks();
  }, []);




  //------------------------unified agent, swd, advance ndc and xfs table---------------------------
useEffect(() => {
  const fetchData = async () => {
    try {
      const [ua, swdRes, ndc, xfsRes] = await Promise.all([
        api.get("/unified-agent"),
        api.get("/swd"),
        api.get("/advanced-ndc"),
        api.get("/xfs"),
      ]);

      setUnifiedAgent(ua.data);
      setSwd(swdRes.data);
      setAdvanceNdc(ndc.data);
      setXfs(xfsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);




//=========================================&&==========
  // this part will delete the sucess message after 30 seconds
  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 3000); // 1 minute = 60,000 ms

  return () => clearTimeout(timer); // cleanup
}, [message]);


  // thids is to reset all the input fields after successful uploading of the file
const resetForm = () => {
  setFile(null);
  setKeywords("");
  setNotes("");
  // setBank("");
  setBankId(null);   // ✅ THIS
  setMachineType("");
  setMachineMode("");

  setOperatingSystem("");

  setUnifiedAgentId("");
  setSwdId("");
  setAdvanceNdcId("");
  setXfsId("");

  // reset dropdown logic
  setMachineTypeId("");
  setMachineModeId("");
  setMachineModes([]);

  setFileInputKey(Date.now()); // ✅ ADD THIS LINE

  // optional: clear message after reset
   //setMessage("");
};






   // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!file || !currentUser) return;
    if (!file || !currentUser || !bankId) {
  setMessage("Please select a bank");
  return;
}


    const formData = new FormData();
    formData.append("file", file);
    formData.append("keywords", keywords);
    formData.append("notes", notes);
    // formData.append("uploadedBy", currentUser.name);
    // formData.append("uploaderEmail", currentUser.email);


    // Append new fields
    // formData.append("bankName", bank);
    formData.append("bankId", bankId.toString());
    // formData.append("machineTypeId", machineTypeId.toString());
    // formData.append("machineModeId", machineModeId.toString());
    formData.append("machineTypeId", machineTypeId.toString());
    formData.append("machineModeId", machineModeId.toString());
    formData.append("operatingSystem", operatingSystem);
    formData.append("unifiedAgent", unifiedAgentId.toString());
    formData.append("swd", swdId.toString());
    formData.append("advanceNdc", advanceNdcId.toString());
    formData.append("xfs", xfsId.toString());

    try {
      // const response = await fetch("http://localhost:5000/api/files/upload", {
      //   method: "POST",
      //   body: formData,
      //   credentials: "include", // send cookies if auth required
      // });

      // const data = await response.json();

        const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

       if (res.status === 200) {
      setMessage("File uploaded successfully ✅");
      resetForm(); // ✅ THIS IS THE KEY
      setTimeout(() => window.location.reload(), 100);
    } else {
      setMessage(res.data.message || "Upload failed");
    }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (


    <div className="min-h-screen flex items-center justify-center p-6 ">

    <form onSubmit={handleSubmit} 
    //  style={{ backgroundColor: "#242481" }}
    className="flex flex-col gap-3">
      <input
        key={fileInputKey} // ✅ ADD THIS
        type="file"
        style={{backgroundColor: "#e6e1e1", color: "#242481"}}
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        className="border p-2 rounded placeholder-gray-500"
      />



      <input
        type="text"
        placeholder="Keywords"
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border p-2 rounded placeholder-gray-500"
      />




      <select
        value={bankId ?? ""}
        onChange={(e) => setBankId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                    {bank.name} 
                     {/* this is what the user see */}
              </option>
  ))}
      </select>

        
        

      {/* <select
        value={machineTypeId}
        onChange={(e) => setMachineTypeId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      > */}
      <select
      value={machineTypeId}
      onChange={(e) => {
      const selectedId = Number(e.target.value);
      setMachineTypeId(selectedId);

      const selectedType = machineTypes.find(t => t.id === selectedId);
      setMachineType(selectedType ? selectedType.name : "");
      }}
      style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
      className="border p-2 rounded text-white placeholder-gray-500"
      >

        <option value="">Select Machine Type</option>
        {machineTypes.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
      </select>


      <select
        value={machineModeId}
        // onChange={(e) => setMachineModeId(Number(e.target.value))}
        onChange={(e) => {
        const selectedId = Number(e.target.value);
        setMachineModeId(selectedId);

        const selectedMode = machineModes.find(m => m.id === selectedId);
        setMachineMode(selectedMode ? selectedMode.name : "");
        }}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select Machine Mode</option>
        {machineModes.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
      </select>


      {/* <input
        type="text"
        placeholder="Operating System"
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        value={operatingSystem}
        onChange={(e) => setOperatingSystem(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      /> */}






      <select
        value={operatingSystem}
        onChange={(e) => setOperatingSystem(e.target.value)}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
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




      {/* <input
        type="text"
        placeholder="Unified Agent"
        value={unifiedAgent}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        onChange={(e) => setUnifiedAgent(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      /> */}


      <select
        value={unifiedAgentId}
        onChange={(e) => setUnifiedAgentId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select Unified Agent</option>
                {unifiedAgent.map((item) => (
              <option key={item.id} value={item.id}>
                    {item.name} 
                     {/* this is what the user see */}
              </option>
  ))}  
      </select>




      {/* <input
        type="text"
        placeholder="SWD"
        value={swd}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        onChange={(e) => setSwd(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      /> */}


      <select
        value={swdId}
        onChange={(e) => setSwdId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select SWD</option>
                {swd.map((item) => (
              <option key={item.id} value={item.id}>
                    {item.name} 
                     {/* this is what the user see */}
              </option>
         ))}  
      </select>

      {/* <input
        type="text"
        placeholder="Advance NDC"
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        value={advanceNdc}
        onChange={(e) => setAdvanceNdc(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      /> */}




      <select
        value={advanceNdcId}
        onChange={(e) => setAdvanceNdcId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select Advanced NDC</option>
                {advanceNdc.map((item) => (
              <option key={item.id} value={item.id}>
                    {item.name} 
                     {/* this is what the user see */}
              </option>
  ))}  
      </select>


{/*       
      <input
        type="text"
        placeholder="XFS"
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        value={xfs}
        onChange={(e) => setXfs(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      /> */}





      <select
        value={xfsId}
        onChange={(e) => setXfsId(Number(e.target.value))}
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        className="border p-2 rounded text-white placeholder-gray-500"
      >
        <option value="">Select XFS</option>
                {xfs.map((item) => (
              <option key={item.id} value={item.id}>
                    {item.name} 
                     {/* this is what the user see */}
              </option>
  ))}  
      </select>



      {/* <input
        type="text"
        placeholder="Keywords"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border p-2 rounded"
      /> */}

      <textarea
        placeholder="Notes about the file"
        style={{ backgroundColor: "#e6e1e1", color: "#242481"}}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 rounded text-white placeholder-gray-500"
      />


      
      <button
        type="submit"
        style={{ backgroundColor: "#e6e1e1", color: "#242481" }}
        className="py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
      {message && <p className="text-green-500">{message}</p>}
    </form>
    </div>
  );
};

export default FileUploadForm;
