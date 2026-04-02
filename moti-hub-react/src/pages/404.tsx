import React from "react";
import { useNavigate, useLocation } from "react-router-dom";




interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}



const ErrorPage: React.FC<ErrorPageProps> = ({ 
  statusCode = 404,
  message,}) => {
  const navigate = useNavigate();
    const getDefaultMessage = () => {
    switch (statusCode) {
      case 401:
        return "Unauthorized access. Please login.";
      case 404:
        return "Page not found.";
      default:
        return "Something went wrong.";
    }
  };

  const isUnauthorized = statusCode === 401;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "72px", marginBottom: "10px" }}>
        {statusCode}
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        {/* Unauthorized access. Please login to continue. */}
         {message || getDefaultMessage()}
      </p>

      <button
        onClick={() => navigate("/", { replace: true })}
        style={{
          padding: "10px 30px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#18105e",
          color: "#fff",
        }}
      >
        OK
      </button>
    </div>
  );
};

export default ErrorPage;
