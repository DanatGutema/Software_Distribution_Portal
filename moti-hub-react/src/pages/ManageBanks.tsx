import React, { useEffect, useState } from "react";
import api from "@/api/axios";


interface Bank {
  id: number;
  name: string;
}

const ManageBanksName: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [newBank, setNewBank] = useState("");
  const [editBank, setEditBank] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);






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





  const fetchBanks = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/banks");
      const res = await api.get("/banks");
      setBanks(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const addBank = async () => {
    if (!newBank.trim()) return;
    try {
      // await fetch("http://localhost:5000/api/banks", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json"},
      //   body: JSON.stringify({  name: newBank }),
      // });
      await api.post("/banks", { name: newBank });
      setNewBank("");
      fetchBanks();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };


   useEffect(() => {
    fetchBanks();
  }, []);





  const editBanks = async () => {
    if (selectedBankId === null) return;
    const modeToEdit = banks.find((m) => m.id === selectedBankId);
    if (!modeToEdit) return;


    const newName = prompt("Enter new bank name:", modeToEdit.name);
    if (!newName || !newName.trim()) return;
    

     try {
      // await axios.put(`http://localhost:5000/api/banks/${selectedBankId}`, { name: newName.trim() });
      await api.put(`/banks/${selectedBankId}`, {
              name: newName.trim(),
      });

      fetchBanks();
    } catch (err) {
      console.error("Failed to update machine type:", err);
    }
  };

  // useEffect(() => {
  //   fetchBanks();
  // }, []);


  const deleteBank = async () => {
    if (selectedBankId === null) {
      alert("Please select a bank to delete.");
      return;
    }

    const confirmed = window.confirm("Do you want to delete this bank?");
    if (!confirmed) return;

    try {
      // await axios.delete(
      //   `http://localhost:5000/api/banks/${selectedBankId}`
      // );
      await api.delete(`/banks/${selectedBankId}`);
      setSelectedBankId(null);
      fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
    }
  };

  // useEffect(() => {
  //   fetchBanks();
  // }, []);

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-3">Manage Banks</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Bank ID</th>
            <th className="border p-2">Bank Name</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b, i) => (
            <tr
              key={b.id}
              onClick={() =>
                setSelectedBankId(prev => (prev === b.id ? null : b.id))
              }
              className={`cursor-pointer ${
                selectedBankId === b.id ? "bg-yellow-100" : ""
              }`}
            >
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{b.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <input
          value={newBank}
          onChange={(e) => setNewBank(e.target.value)}
          placeholder="New Bank Name"
          className="border p-2 rounded"
        />

        <button
          onClick={addBank}
          className="bg-blue-900 text-white px-8 py-2 rounded"
        >
          Add
        </button>


        <button
          onClick={editBanks}
          disabled={selectedBankId === null}
          className={`px-6 py-2 rounded text-white ${
            selectedBankId === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-400"
          }`}
        >
          Edit
        </button>



        <button
          onClick={deleteBank}
          disabled={selectedBankId === null}
          className={`px-6 py-2 rounded text-white ${
            selectedBankId === null
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

export default ManageBanksName;
