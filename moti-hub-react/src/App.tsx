import React, { useEffect, useState } from "react";
import Sider from "./components/Sidebar";
import SiderUser from "./components/Siderbar2";
import Dashboard  from "./pages/Dashboardpage";
import UserDashboard  from "./pages/UserDashboardPage";
import AdminDashboard  from "./pages/AdminDashboardPage";
import LoginPages from "./pages/LoginPage";
import SignupPages from "./pages/SignupPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DownloadPage from "./pages/DownloadPage";
import SettingsPage from "./pages/SettingsPage";
// import EditProfilePage from "./pages/EditProfilePage";
import ManageMachineTypes from "./pages/MachineTypes";
import ManageMachineModes from "./pages/MachineModes";
import ManageBanksName from "./pages/ManageBanks";
import ProfilePage from "./pages/Profile";
//import { Navigate } from "react-router-dom";
import EditDownloadPage from "./pages/EditUploadedFilePage";
import api from "./api/axios"; // replace fetch with this
import type { ReactNode } from "react";
import ErrorPage from "./pages/404";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import ManageAdvancedNDC from "./pages/AdvancedNDC";
import ManageAdvancedNDCXFS from "./pages/XFS";
import ManageAdvancedNDCSWD from "./pages/SWD";
import ManageAdvancedNDCUnifiedAgent from "./pages/UnifiedAgent";

/** Avoids 404 blink on refresh: show Loading until auth is ready, then 404 for unknown path. */
function NotFoundOrLoading() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  return <ErrorPage statusCode={404} message="Page not found." />;
}
//import { Divide } from "lucide-react";
// import CustomizePage from "./pages/CustomizePage";

//import { useAuth } from "./context/AuthContext";
import {Navigate, useLocation, useNavigate } from "react-router-dom";




const App: React.FC = () => {
  const { role, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [minLoadDone, setMinLoadDone] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 400);
    return () => clearTimeout(t);
  }, []);

// const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const isAuthenticated = role !== null; // Check if the role is set

//   return isAuthenticated ? children : <Navigate to="/" replace />;
// };



  //const [role, setRole] = useState<number | null>(null);
    //  useEffect(() => {
    //   const fetchRole = async () => {
    //     try {
    //       const { data } = await api.get("/auth/me"); // uses baseURL + withCredentials
    //       // 🔥 LOG EVERYTHING
    //       console.log("🔥 /api/me response for the app.tsx page:", data);
  
    //       setRole(data.role);
    //     } catch(err) {
    //       console.error("❌ /api/me response for the app.tsx page:", err);
    //       setRole(null);
    //     }
    //     };
    //       fetchRole();
    // }, []);
  

  const UserDownloadsLayout = () => (
  <div className="flex bg-gray-50 min-h-screen">
    <div className="fixed left-0 top-0 z-10 h-screen w-[280px] flex-shrink-0">
      <SiderUser />
    </div>
    <div className="min-h-screen flex-1 min-w-0 pl-[280px] overflow-auto">
      <DownloadPage />
    </div>
  </div>
);






const AdminManagerDownloadsLayout = () => (
  <div className="flex bg-gray-50 min-h-screen">
    <div className="fixed left-0 top-0 z-10 h-screen w-[280px] flex-shrink-0">
      <Sider />
    </div>
    <div className="min-h-screen flex-1 min-w-0 pl-[280px] overflow-auto">
      <DownloadPage />
    </div>
  </div>
);







//     // Run this effect whenever the route changes
//   useEffect(() => {
//     const checkToken = async () => {
//       if (!isAuthenticated) {
//         // If user is not logged in, and they try to go back/forward
//         if (location.pathname !== "/" && location.pathname !== "/signup") {
//           navigate("/unauthorized", { state: { from: location.pathname }, replace: true });
//         }
//       }
//     };

//     checkToken();
//   }, [isAuthenticated, location.pathname, navigate]);


//     useEffect(() => {
//   const justLoggedIn = localStorage.getItem("justLoggedIn");
//   if (justLoggedIn) {
//     console.log("🔁 Page reloaded after login");
//     localStorage.removeItem("justLoggedIn"); // clear the flag
//   }
// }, []);



// useEffect(() => {
//   const handleNavigation = async () => {
//     if (!isAuthenticated && location.pathname !== "/" && location.pathname !== "/signup") {
//       if (justLoggedOut) {
//         setJustLoggedOut(false); // reset flag
//         navigate("/unauthorized", { state: { from: location.pathname }, replace: true });
//       }
//     }
//   };

//   handleNavigation();
// }, [isAuthenticated, location.pathname, navigate, justLoggedOut]);









  // This effect watches for back/forward navigation after logout
// useEffect(() => {
//   if (!isLoading) {
//     // Only check if user is not authenticated
//     if (!isAuthenticated) {
//       if (location.pathname !== "/" && location.pathname !== "/signup") {
//         if (justLoggedOut) {
//           setJustLoggedOut(false);
//         }
//         navigate("/unauthorized", { state: { from: location.pathname }, replace: true });
//       }
//     }
//   }
// }, [isLoading, isAuthenticated, location.pathname, navigate, justLoggedOut]);

// App.tsx
// useEffect(() => {
//   if (!isLoading) {
//     // Only redirect if:
//     // 1. User is NOT authenticated
//     // 2. User is NOT on "/" (Login)
//     // 3. User is NOT on "/signup"
//     // 4. User is NOT already on "/unauthorized"
//     if (!isAuthenticated) {
//       const publicPaths = ["/", "/signup", "/unauthorized"];
//       if (!publicPaths.includes(location.pathname)) {
//         navigate("/unauthorized", { 
//           state: { from: location.pathname }, 
//           replace: true 
//         });
//       }
//     }
//   }
// }, [isLoading, isAuthenticated, location.pathname, navigate]);







  

// if (isLoading) {
//   return null; // or spinner
// }


// Show Loading until auth is ready AND minimum time has passed (avoids 404 blink on refresh)
  const showAppLoading = isLoading || !minLoadDone;
  if (showAppLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
      <Routes>
        <Route path="/" element={ <LoginPages /> } />
        <Route path="/signup" element={<SignupPages />} />
      
        <Route path="/settings" element={<SettingsPage />} />
       
        <Route path="/unauthorized" element={<ErrorPage  statusCode={401}/>} />


         {/* <Route 
         path="/downloads" 
         element={
         <div className="flex bg-gray-50 min-h-screen">
           {role === 0 ? <SiderUser /> : <Sider />}
          <div className="flex-1 p-6">
             <DownloadPage />
          </div>
         </div>
        } /> */}

       <Route path="/profile" element={
     <ProtectedRoute>
        <ProfilePage /> 
      </ProtectedRoute>  
       } />

       {/* <Route 
         path="/downloads" 
         element={
         <div className="flex bg-gray-50 min-h-screen">
          <Sider />
          {role === 0 ? <SiderUser /> : <Sider />}
          <div className="flex-1 p-6">
             <DownloadPage />
          </div>
         </div>
        } /> */}
      


      <Route
  path="/downloads"
  element={
     <ProtectedRoute>
    {role === 0
      ? <UserDownloadsLayout />
      : role === 1 || role === 2
      ? <AdminManagerDownloadsLayout />
      : null}
      </ProtectedRoute>
  }
/>




        <Route
         path="/edit-uploaded-files" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen">
              <div className="fixed left-0 top-0 z-10 h-screen w-[280px] flex-shrink-0">
                <Sider />
              </div>
              <div className="min-h-screen flex-1 min-w-0 pl-[280px] overflow-auto">
                <EditDownloadPage />
              </div>
             </div>
             </ProtectedRoute>
         } />



        <Route
         path="/machine-types" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                 <main className="flex-1">
                    <ManageMachineTypes />
                 </main>
             </div>
             </ProtectedRoute>
         } />


      <Route
         path="/machine-modes" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                
                 <main className="flex-1">
                    <ManageMachineModes />
                 </main>
             </div>
             </ProtectedRoute>
      } />




  <Route
         path="/banks" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                     <Sider />
              </aside>
                
                 <main className="flex-1">
                    <ManageBanksName />
                 </main>
             </div>
             </ProtectedRoute>
      } />




        <Route
          path="/dashboard"
          element={
          <ProtectedRoute allowedRoles={[1]}>
            <div className="flex bg-gray-50  min-h-screen items-stretch">
                <aside className="w-70 flex-shrink-0">
                       <Sider />
                </aside>
                <main className="flex-1">
                        <Dashboard /> {/* or any page */}
                </main>
            </div>
        </ProtectedRoute>
          }
        />



          <Route
          path="/user"
          element={
         <ProtectedRoute allowedRoles={[0]}>
            <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                     <SiderUser />
              </aside>
              <main className="flex-1">
                        <UserDashboard />
              </main>
             
            </div>
         </ProtectedRoute>
          }
        />


          <Route
          path="/admin"
          element={
           <ProtectedRoute allowedRoles={[2]}>
            <div className="flex bg-gray-50 min-h-screen">
              <div className="fixed left-0 top-0 z-10 h-screen w-[280px] flex-shrink-0">
                <Sider />
              </div>
              <main className="min-h-screen flex-1 min-w-0 pl-[280px] overflow-auto">
                <AdminDashboard />
              </main>
            </div>
       </ProtectedRoute>
          }
        />






        <Route
         path="/advanced-ndc" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                 <main className="flex-1">
                    <ManageAdvancedNDC />
                 </main>
             </div>
             </ProtectedRoute>
         } />




                 <Route
         path="/swd" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                 <main className="flex-1">
                    <ManageAdvancedNDCSWD />
                 </main>
             </div>
             </ProtectedRoute>
         } />


        <Route
         path="/xfs" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                 <main className="flex-1">
                    <ManageAdvancedNDCXFS />
                 </main>
             </div>
             </ProtectedRoute>
         } />




        <Route
         path="/unified-agent" 
         element={
          <ProtectedRoute>
             <div className="flex bg-gray-50 min-h-screen items-stretch">
              <aside className="w-70 flex-shrink-0">
                    <Sider />
              </aside>
                 <main className="flex-1">
                    <ManageAdvancedNDCUnifiedAgent />
                 </main>
             </div>
             </ProtectedRoute>
         } />




        {/* Catch-all: show Loading until auth ready to avoid 404 blink on refresh */}
        <Route
          path="*"
          element={
            <NotFoundOrLoading />
          }
        />

      </Routes>
  );
};


export default App;