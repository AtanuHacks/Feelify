// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // ❌ DELETED

export default function ProtectedRoute({ children }) {
  // const { user } = useAuth(); // ❌ DELETED

  // ✅ TEMPORARY BYPASS: Set to 'true' so you can see your dashboard while coding.
  // When you add Appwrite later, you will replace this with your real user state.
  const user = true; 

  // if user is null, send to landing/login
  if (!user) return <Navigate to="/" replace />;
  return children;
}