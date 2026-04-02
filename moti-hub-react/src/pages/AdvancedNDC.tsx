import React, { useEffect, useState } from "react";
import api from "@/api/axios";



interface AdvancedNDC {
  id: number;
  name: string;
  remark: string;  // ✅ add this
}



const ManageAdvancedNDC: React.FC = () => {
  const [types, setTypes] = useState<AdvancedNDC[]>([]);
  const [newType, setNewType] = useState("");
  const [editName, setEditName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [editingRemarkId, setEditingRemarkId] = useState<number | null>(null);
  const [remarkValue, setRemarkValue] = useState("");






const saveRemark = async (id: number) => {
  try {
    const type = types.find(t => t.id === id);
    await api.put(`/advanced-ndc/${id}`, { name: type!.name, remark: remarkValue });
    setEditingRemarkId(null);
    fetchTypes();
  } catch (err) {
    console.error("Failed to save remark:", err);
  }
};







  const fetchTypes = async () => {
    try {
     const res = await api.get("/advanced-ndc");
    setTypes(res.data);
  } catch (error) {
    console.error("Error fetching advanced ndc:", error);
  }
};

  const addType = async () => {
    if (!newType.trim()) return; // prevent empty name
    try {
    await api.post("/advanced-ndc", { name: newType });
    setNewType("");
    fetchTypes();
  } catch (error) {
    console.error("Error adding advanced ndc", error);
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


    const newName = prompt("Enter new advanced ndc name:", typeToEdit.name);
    if (!newName || !newName.trim()) return;


    try {
      //await axios.put(`http://localhost:5000/api/machine-types/${selectedTypeId}`, { name: newName.trim() });
      await api.put(`/advanced-ndc/${selectedTypeId}`, { name: newName.trim(), remark: typeToEdit.remark ?? "" });
      fetchTypes();
    } catch (err) {
      console.error("Failed to update advanced ndc:", err);
    }
  };





  // to delete the added machine type
  const deleteType = async () => {
    if (selectedTypeId === null) return alert("Please select a machine type to delete.");
    const confirmed = window.confirm("Do you want to delete this machine type? All the related machine modes will be deleted.");
    if (!confirmed) return;

    try {
      //await axios.delete(`http://localhost:5000/api/machine-types/${selectedTypeId}`);
      await api.delete(`/advanced-ndc/${selectedTypeId}`);
      setSelectedTypeId(null);
      fetchTypes();
    } catch (error) {
      console.error("Error deleting advanced ndc:", error);
    }
  };




  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-3">Manage Advanced NDC</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-50">ID Number</th>
            <th className="border p-2 w-100">Advanced NDC</th>
            <th className="border p-2">Remark</th>
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
              <td className="border p-2">   {/* ✅ Remark column now works */}
      {editingRemarkId === t.id ? (
        <div className="flex gap-2">
          <input
            className="border rounded p-1 text-sm flex-1"
            value={remarkValue}
            onChange={e => setRemarkValue(e.target.value)}
            onClick={e => e.stopPropagation()} // prevent row click
          />
          <button
            className="text-xs bg-green-500 text-white px-2 rounded"
            onClick={e => { e.stopPropagation(); saveRemark(t.id); }}
          >Save</button>
          <button
            className="text-xs bg-gray-400 text-white px-2 rounded"
            onClick={e => { e.stopPropagation(); setEditingRemarkId(null); }}
          >✕</button>
        </div>
      ) : (
        <span
          className="text-sm text-gray-600 cursor-pointer hover:text-blue-500"
          onClick={e => {
            e.stopPropagation();
            setEditingRemarkId(t.id);
            setRemarkValue(t.remark || "");
          }}
        >
          {t.remark || "Click to add remark"}
        </span>
      )}
    </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New advanced ndc name"
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

export default ManageAdvancedNDC;
