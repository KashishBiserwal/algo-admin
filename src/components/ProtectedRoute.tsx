import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <Spinner /> Replace with your actual spinner component */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // You might want to pass the current location to redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}