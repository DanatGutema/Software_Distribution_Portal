import React, {useEffect, useState } from "react";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  inactive: "bg-gray-400 text-black-800",

};

const roleLabels: Record<number, string> = {
  0: "User",
  1: "Manager",
  2: "Admin",
};





interface User {
  id: number;
  fullname: string;
  email: string;
  role: number | string; // depends on your backend
  status: string;
  createdAt: string;
}




const AdminDashboard: React.FC = () => {
  const { isLoading } = useAuth(); // ✅ replaces old role check
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);







  //   const [role, setRole] = useState<number | null>(null);
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



  // 🔽 PUT IT RIGHT HERE
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2_000);

    return () => clearTimeout(timer);
  }, [message]);


    // Fetch users from backend
  const fetchUsers = async () => {


    try {
    // const res = await fetch("http://localhost:5000/api/admin/users", {
    //   credentials: "include",
    // });
    // const data = await res.json();

    const res = await api.get("/admin/users");
    const data = res.data;


    console.log(data); // <-- check what role and status look like
    
    
      
    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      setMessage(data.message || "Failed to fetch users");
      setUsers([]); // prevent crashing
      return;
    }

    
    
    setUsers(data);

  } catch (error) {
    console.error(error);
    setMessage("Error fetching users");
  }



  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleApprove = async (id:number) => {
    // await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
    //   method: "PUT",
    //   credentials: "include",
    // });
    await api.put(`/admin/users/${id}/approve`);
    fetchUsers();
  };




  const handlePromote = async (user: User, newRole: number) => {

      const normalizedStatus = user.status.toLowerCase(); // ✅ define here

  // block the promotion if not approved
  if (normalizedStatus  !== "approved") {
    setMessage("User must be approved before promotion.");
    return;
  }



    // await fetch(`http://localhost:5000/api/admin/users/${user.id}/promote`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ role: newRole }),
    //   credentials: "include",
    // });
    await api.put(`/admin/users/${user.id}/promote`, {
      role: newRole,
    });
    setMessage("");
    fetchUsers();
  };






   const handleDelete = async (id: number) => {
    // await fetch(`http://localhost:5000/api/admin/users/${id}`, {
    //   method: "DELETE",
    //   credentials: "include",
    // });
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };


    const handleDeactivate = async (id:number) => {
    // await fetch(`http://localhost:5000/api/admin/users/${id}/inactive`, {
    //   method: "PUT",
    //   credentials: "include",
    // });
    await api.put(`/admin/users/${id}/inactive`);
    fetchUsers();
  };

      const handleActivate = async (id:number) => {
    // await fetch(`http://localhost:5000/api/admin/users/${id}/active`, {
    //   method: "PUT",
    //   credentials: "include",
    // });
    await api.put(`/admin/users/${id}/active`);
    fetchUsers();
  };



   // ✅ Show loading while auth is checked
  //if (isLoading) return <p className="p-6">Checking authentication...</p>;


 return (
    <div
    style={{ backgroundColor: "#F7F7F7" }}
    className="flex-1 p-8 min-w-0">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard - Users</h1>


    {message && (
       <div className="mb-4 text-red-600 font-medium">
           {message}
       </div>
    )}


      {/* Table with internal horizontal scroll so sider stays fixed */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-[900px] table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Signup Date</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
               const normalizedStatus = user.status.toLowerCase();
            
            
            return (  
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700 font-medium">{user.fullname}</td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                {/* <td className="px-6 py-4 text-gray-500">{user.role}</td> */}
 
                <td className="px-6 py-4 text-gray-500">
                      {typeof user.role === "number"
                            ? roleLabels[user.role] || "Unknown"
                            : user.role}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      statusColors[normalizedStatus ] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {normalizedStatus}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap max-w-[900px] overflow-x-auto">


                {/* <div className="flex justify-end gap-2 flex-nowrap overflow-x-auto"> */}
                <div className="flex flex-col items-end">

  {/* Dropdown Trigger Button */}
  <button
    className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-blue-700"
    onClick={() =>
      setOpenDropdown(openDropdown === user.id ? null : user.id)
    }
  >
    Actions
  </button>

  {/* Dropdown Menu */}
  {openDropdown === user.id && (
    <div className="right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
      
                       <div className="flex flex-col py-2 text-sm text-gray-700 space-y-1">
                    {normalizedStatus === "pending" && (


                    <button
                      className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600"
                      onClick={() => handleApprove(user.id)}
                    >
                      approve
                    </button>
                  )}




                  {
                    user.role === 0 && (

                  <button
                    // style={{ backgroundColor: "#242481" }}
                    className="bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-800"
                    onClick={() => handlePromote(user, 1)}
                  >
                    Promote to Manager
                  </button>
                    )
                  }



                  {/* {
                    user.role === 2 && (

                       <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => handlePromote(user, 1)}
                  >
                    Promote to Manager
                  </button>
                    )
                  } */}




                  {
                    user.role === 0 && (
                      <button

                      // style={{ backgroundColor: "#ae1cedff" }}
                    className="bg-purple-400 text-white px-2 py-1 rounded hover:bg-purple-600"
                    onClick={() => handlePromote(user, 2)}
                  >
                    Promote to Admin
                  </button>
                    )
                  }



                  {
                    user.role === 1 && (
                      <button
                    className="bg-purple-400 text-white px-2 py-1 rounded hover:bg-purple-600"
                    onClick={() => handlePromote(user, 2)}
                  >
                    Promote to Admin
                  </button>
                    )
                  }


                     {/* ======================to deactivate the account ============================== */}
                   
                    {normalizedStatus === "approved" && (


                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      onClick={() => handleDeactivate(user.id)}
                    >
                      deactivate acc
                    </button>
                  )}
                 

{/* 
=======================================to activate the account======= */}

              
{/* =======================================show the delete button when the user is pending only==== */}


{normalizedStatus === "pending" && (
                  <button
                    className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>



)}
                </div>

 </div>

)}


 </div>






              </td>
              </tr>
            )})}
          </tbody>

        </table>
      </div>
    </div>
  );
};


export default AdminDashboard;
