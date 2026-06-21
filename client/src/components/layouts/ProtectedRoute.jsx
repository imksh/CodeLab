import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../Loading";

const ProtectedRoute = ({ children, role }) => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Loading />;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
