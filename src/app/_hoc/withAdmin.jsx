import React from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

const withAdmin = (Component) => {
  return (props) => {
    const { authUser, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!loading) {
        if (!isAuthenticated || authUser?.role !== "admin") {
          navigate("/"); // Boot them to home if not admin
        }
      }
    }, [isAuthenticated, authUser, loading, navigate]);

    if (loading || !isAuthenticated || authUser?.role !== "admin") {
      return null; // Or a loader
    }

    return <Component {...props} />;
  };
};

export default withAdmin;
