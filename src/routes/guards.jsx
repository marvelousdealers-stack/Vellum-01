import { Navigate, Outlet } from "react-router";
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

// Signed out → /login. Signed in with another role → that role's own home.
// Wraps children, or renders <Outlet /> when used as a route-group element.
export const RequireRole = ({ role: allowed, children }) => {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  if (role !== allowed) return <Navigate to={ROLE_HOME[role]} replace />;
  return children ?? <Outlet />;
};
