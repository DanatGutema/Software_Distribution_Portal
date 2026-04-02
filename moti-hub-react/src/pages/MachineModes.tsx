import React, { useEffect, useState } from "react";
import api from "@/api/axios";

interface MachineType {
  id: number;
  name: string;
}


interface MachineMode {
  id: number;
  name: string;
}

const ManageMachineModes: React.FC = () => {
  const [types, setTypes] = useState<MachineType[]>([]);
  const [modes, setModes] = useState<MachineMode[]>([]);
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [newMode, setNewMode] = useState("");
  const [selectedModeId, setSelectedModeId] = useState<number | null>(null);

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





  
  //fetch machine type
  // useEffect(() => {
  //   axios.get("http://localhost:5000/api/machine-types")
  //     .then(res => setTypes(res.data))
  //     .catch(err => console.error(err));
  // }, []);
  useEffect(() => {
  const fetchTypes = async () => {
    try {
      const res = await api.get("/machine-types");
      setTypes(res.data);
    } catch (err) {
      console.error("Error fetching machine types:", err);
    }
  };
  fetchTypes();
}, []);


  //fetch machine mode for the selected machine type
  const fetchModes = async (typeId: number) => {
    try{
    //const res = await axios.get(`http://localhost:5000/api/machine-modes/${typeId}`);
    //const data = await res.json();
    const res = await api.get(`/machine-modes/${typeId}`);
    setModes(res.data);
    } catch (error) {
      console.error("Error fetching machine modes", error);
    }
  };

  const handleTypeChange = (typeId: number) => {
    setSelectedType(typeId);
    setSelectedModeId(null);
    fetchModes(typeId);
  };

  const addMode = async () => {
     if (!newMode.trim() || !selectedType) return;

    try{ 
  
      // await axios.post("http://localhost:5000/api/machine-modes", {
      //   name: newMode,
      //   machineTypeId: selectedType,
      // });
      await api.post("/machine-modes", { 
        name: newMode, 
        machineTypeId: selectedType 
      });
    setNewMode("");
    fetchModes(selectedType);
  } catch (error) {
    console.error("Error adding the machine mode", error);
  }
  };



  const editMode = async () => {
    if (selectedModeId === null) return;
    const modeToEdit = modes.find((m) => m.id === selectedModeId);
    if (!modeToEdit) return;


    const newName = prompt("Enter new machine mode name:", modeToEdit.name);
    if (!newName || !newName.trim()) return;
    

   try {
      // await axios.put(`http://localhost:5000/api/machine-modes/${selectedModeId}`, {
      //   name: newName.trim(),
      // });
      await api.put(`/machine-modes/${selectedModeId}`, { name: newName.trim() });
      fetchModes(selectedType as number);
    } catch (err) {
      console.error("Failed to update machine mode:", err);
    }
  };


  

   const deleteMode = async () => {
    if (selectedModeId === null) {
      alert("Please select a machine mode to delete.");
      return;
    }

    const confirmed = window.confirm(
      "Do you want to delete this machine mode?"
    );
    if (!confirmed) return;

    try {
      // await axios.delete(
      //   `http://localhost:5000/api/machine-modes/${selectedModeId}`
      // );
      await api.delete(`/machine-modes/${selectedModeId}`);
      setSelectedModeId(null);
      fetchModes(selectedType as number);
    } catch (error) {
      console.error("Error deleting mode", error);
    }
  };






  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-3">Manage Machine Modes</h2>

      <select
        value={selectedType}
        onChange={(e) => handleTypeChange(Number(e.target.value))}
        className="border p-2 rounded mb-3"
      >
        <option value="">Select Machine Type</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {selectedType && (
        <>
          <table className="w-full border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID Number</th>
                <th className="border p-2">Machine Mode</th>
              </tr>
            </thead>
            <tbody>
              {modes.map((m, i) => (
                <tr 
                key={m.id}
                   onClick={() =>
                    setSelectedModeId(prev =>
                      prev === m.id ? null : m.id
                    )
                  }
                  className={`cursor-pointer ${
                    selectedModeId === m.id ? "bg-yellow-100" : ""
                  }`}
                >
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{m.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2">
            <input
              value={newMode}
              onChange={(e) => setNewMode(e.target.value)}
              placeholder="New Machine Mode"
              className="border p-2 rounded"
            />
            <button
              onClick={addMode}
              // style={{ backgroundColor: "#242481" }}
              className="bg-blue-900 text-white px-8 py-2 rounded"
            >
              Add
            </button>




            <button
              onClick={editMode}
              disabled={selectedModeId === null}
              className={`px-6 py-2 rounded text-white ${
                selectedModeId === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-400"
              }`}
            >
              Edit
            </button>


            <button
              onClick={deleteMode}
              disabled={selectedModeId === null}
              className={`px-6 py-2 rounded text-white ${
                selectedModeId === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-400"
              }`}
            >
              Delete
            </button>



          </div>
        </>
      )}
    </div>
  );
};

export default ManageMachineModes;
