// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles?: number[];
// }

// const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
//   const { isLoading, isAuthenticated, role } = useAuth();

//   if (isLoading) return null;

//   if (!isAuthenticated) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(Number(role))) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;



import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ErrorPage from "@/pages/404";

const PUBLIC_PATHS = ["/", "/signup", "/unauthorized"];

const ProtectedRoute = ({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: number[];}) => {


  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  // Show loading until auth is determined (avoids flash then 404 when token is valid)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If user is NOT authenticated (tokens removed / logged out)
  if (!isAuthenticated) {
    if (PUBLIC_PATHS.includes(location.pathname)) {
      return <>{children}</>;
    }
    // Show 404 for protected pages when not authenticated (back/forward/refresh after logout)
    return <ErrorPage statusCode={404} message="Page not found." />;
  }

  // Role check: no access for this role → 404
  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <ErrorPage statusCode={404} message="Page not found." />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
