import { Navigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { ROLE_HOME } from "./paths";

export const RequireAuth = ({ children }) => {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  return children;
};

export const RedirectToRoleHome = () => {
  const { role } = useApp();
  return <Navigate to={role ? ROLE_HOME[role] : "/login"} replace />;
};
