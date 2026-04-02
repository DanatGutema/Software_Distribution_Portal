import React, { useEffect, useState } from "react";
import api from "@/api/axios";



interface MachineType {
  id: number;
  name: string;
}



const ManageMachineTypes: React.FC = () => {
  const [types, setTypes] = useState<MachineType[]>([]);
  const [newType, setNewType] = useState("");
  const [editName, setEditName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);






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










  const fetchTypes = async () => {
    try {
    // const res = await axios.get("http://localhost:5000/api/machine-types");
    //const data = await res.json();
     const res = await api.get("/machine-types");
    setTypes(res.data);
  } catch (error) {
    console.error("Error fetching machine types:", error);
  }
};

  const addType = async () => {
    if (!newType.trim()) return; // prevent empty name
    try {
    // await fetch("http://localhost:5000/api/machine-types", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: newType }),
    // });
    await api.post("/machine-types", { name: newType });
    setNewType("");
    fetchTypes();
  } catch (error) {
    console.error("Error adding machine type", error);
  }
  };

  useEffect(() => {
    fetchTypes();
  }, []);





  //to edit or rename machine type
  const editType = async() =>{
    if (selectedTypeId === null) return;
    const typeToEdit = types.find(t => t.id === selectedTypeId);
    if (!typeToEdit) return;


    const newName = prompt("Enter new machine type name:", typeToEdit.name);
    if (!newName || !newName.trim()) return;


    try {
      //await axios.put(`http://localhost:5000/api/machine-types/${selectedTypeId}`, { name: newName.trim() });
      await api.put(`/machine-types/${selectedTypeId}`, { name: newName.trim() });
      fetchTypes();
    } catch (err) {
      console.error("Failed to update machine type:", err);
    }
  };





  // to delete the added machine type
  const deleteType = async () => {
    if (selectedTypeId === null) return alert("Please select a machine type to delete.");
    const confirmed = window.confirm("Do you want to delete this machine type? All the related machine modes will be deleted.");
    if (!confirmed) return;

    try {
      //await axios.delete(`http://localhost:5000/api/machine-types/${selectedTypeId}`);
      await api.delete(`/machine-types/${selectedTypeId}`);
      setSelectedTypeId(null);
      fetchTypes();
    } catch (error) {
      console.error("Error deleting machine type:", error);
    }
  };




  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-3">Manage Machine Types</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID Number</th>
            <th className="border p-2">Machine Type</th>
          </tr>
        </thead>
        <tbody>
          {types.map((t, i) => (
            <tr 
            key={t.id} 
            onClick={() =>  setSelectedTypeId(prev => (prev === t.id ? null : t.id))}
            className={`cursor-pointer ${selectedTypeId === t.id ? "bg-yellow-100" : ""}`}
            >
              
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{t.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New Machine Type"
          className="border p-2 rounded"
        />
        <button
          onClick={addType}
          // style={{ backgroundColor: "#242481" }}
          className="bg-blue-900 text-white px-8 py-2 rounded"
        >
          Add
        </button>


        <button
          onClick={editType}
          disabled={selectedTypeId === null}
          className={`px-6 py-2 rounded text-white ${
                selectedTypeId === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-400"
              }`}
        >
          Edit
        </button>

 


           <button
          onClick={deleteType}
          disabled={selectedTypeId === null}
          className={`px-6 py-2 rounded text-white ${
                selectedTypeId === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-400"
              }`}
        >
          Delete
        </button>


      </div>
    </div>
  );
};

export default ManageMachineTypes;
