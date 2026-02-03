import React from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "@app/_components/_core/MessageProvider"; // Added import

const withAdmin = (Component) => {
  return (props) => {
    const { authUser, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          toast.error("Authentication required"); // Added error toast
          navigate("/auth/login-1");
        } else if (authUser?.role !== "admin") {
          toast.error("Permission Denied: Admin access only"); // Added error toast
          navigate("/");
        }
      }
    }, [isAuthenticated, authUser, loading, navigate]);

    if (loading || !isAuthenticated || authUser?.role !== "admin") {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAdmin;
