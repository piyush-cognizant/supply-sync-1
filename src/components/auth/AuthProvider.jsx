import React, { useEffect } from "react";
import { useAuth } from "@/store/auth.store";
import { Outlet, useNavigate } from "react-router";

const AuthProvider = () => {
  
  return <Outlet />;
};

export default AuthProvider;
