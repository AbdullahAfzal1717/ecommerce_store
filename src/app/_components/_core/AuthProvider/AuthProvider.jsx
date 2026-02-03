import React from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import axios from "axios";
import { toast } from "@app/_components/_core/MessageProvider"; // Ensure this path is correct
import api from "@app/_services/api";

const loginService = async (login, password) => {
  try {
    const response = await api.post("/auth/login", { login, password });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Invalid email or password";
    throw new Error(message);
  }
};

const signupService = async (userData) => {
  try {
    const formData = new FormData();
    formData.append("username", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Signup failed.";
    throw new Error(message);
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [authUser, setAuthUser] = React.useState(null);

  const handleAuthSuccess = (response) => {
    if (response.token) {
      const authData = {
        token: response.token,
        user: response.user,
      };

      const authUserSr = encodeURIComponent(JSON.stringify(authData));
      setCookie("auth-user", authUserSr, 1);

      setAuthUser(authData.user);
      setIsAuthenticated(true);

      // SUCCESS MESSAGE
      toast.success(`Welcome back, ${authData.user.username}!`);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await loginService(email, password);
      handleAuthSuccess(response.data);
    } catch (error) {
      // ERROR MESSAGE
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    setLoading(true);
    try {
      const response = await signupService(data);
      handleAuthSuccess(response.data);
      toast.success("Account created successfully!");
    } catch (error) {
      // ERROR MESSAGE
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAuthUser = (updatedUser) => {
    const authUserSr = getCookie("auth-user");
    if (authUserSr) {
      const decoded = JSON.parse(decodeURIComponent(authUserSr));
      decoded.user = updatedUser; // Update the user object

      const newCookieValue = encodeURIComponent(JSON.stringify(decoded));
      setCookie("auth-user", newCookieValue, 1);
      setAuthUser(updatedUser); // Update local state
    }
  };

  const logout = () => {
    eraseCookie("auth-user");
    setAuthUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out.");
  };
  React.useEffect(() => {
    let authUserSr = getCookie("auth-user");
    if (authUserSr) {
      try {
        // Decode the URI component back to a standard JSON string
        const decodedData = JSON.parse(decodeURIComponent(authUserSr));

        // Set both states
        setAuthUser(decodedData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing auth cookie:", error);
        eraseCookie("auth-user"); // Clean up corrupt cookie
      }
    }
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authUser,
        loading,
        login,
        logout,
        signup,
        updateAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
