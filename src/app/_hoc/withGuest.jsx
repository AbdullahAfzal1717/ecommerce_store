// src/hoc/withGuest.js
import { Navigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const withGuest = (Component) => {
  return () => {
    const { isAuthenticated} = useAuth();

    

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  };
};

export default withGuest;