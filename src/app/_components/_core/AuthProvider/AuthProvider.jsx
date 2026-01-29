import React from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import axios from "axios";

const API_URL = "http://localhost:5050/api/v1/auth";

const loginService = async (login, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { login, password });
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
    // We use 'name' from frontend but backend expects 'username' based on your model
    formData.append("username", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Only append avatar if a file was actually selected
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await axios.post(`${API_URL}/register`, formData, {
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
        user: response.user, // Ensure backend sends 'user' object
      };

      // 1. Save to Cookie for persistence
      const authUserSr = encodeURIComponent(JSON.stringify(authData));
      setCookie("auth-user", authUserSr, 1);

      // 2. Save to State for immediate UI update
      setAuthUser(authData.user);
      setIsAuthenticated(true);
    }
  };
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // Simulate a call to an authentication service
      const response = await loginService(email, password);
      handleAuthSuccess(response.data);
    } catch (error) {
      console.error("Login failed", error);
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
    } catch (error) {
      alert(error.message);
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
