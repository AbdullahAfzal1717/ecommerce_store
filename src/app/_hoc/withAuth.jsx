import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Spinner } from "@app/_shared";
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "@app/_components/_core/MessageProvider"; // Added import

const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      toast.info("Please login to access this page"); // Added notification
      return <Navigate to="/auth/login-1" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
