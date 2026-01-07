import React, { useEffect } from "react";
import { useAuth } from "../../store/auth.store";
import { Outlet, useLocation, Navigate } from "react-router";
import { USER_ROLES } from "@/constants/entities";

const AuthProvider = () => {
  const { isAuthenticated, getUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, user: getUser() });
  }, [isAuthenticated]);

  if (isAuthenticated === undefined || isAuthenticated === null) return null;

  if (isAuthenticated && location.pathname === "/") {
    const user = getUser();
    const redirectPath = user?.role === USER_ROLES.ADMIN ? "/admin" : "/vendor";
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthProvider;
