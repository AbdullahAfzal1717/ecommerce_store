import { Navigate } from "react-router-dom";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "@app/_components/_core/MessageProvider"; // Added import

const withGuest = (Component) => {
  return (props) => {
    // Added props for consistency
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
      // Optional: toast.info("You are already logged in");
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  };
};

export default withGuest;
