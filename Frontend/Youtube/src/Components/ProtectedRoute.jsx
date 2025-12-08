import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
