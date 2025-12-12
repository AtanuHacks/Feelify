// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";
import { ID, OAuthProvider } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPROVED: Login with Error Handling
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUserStatus(); // Update state immediately
    } catch (error) {
      console.error("Login Failed:", error);
      throw error; // Send error back to LoginModal to show user
    }
  };

  // ✅ IMPROVED: Signup with Auto-Login
  const signup = async (email, password, name) => {
    try {
      // 1. Create Account
      await account.create(ID.unique(), email, password, name);
      // 2. Auto-Login immediately
      await login(email, password);
    } catch (error) {
      console.error("Signup Failed:", error);
      throw error;
    }
  };

  // ✅ IMPROVED: Google Login
  const loginWithGoogle = async () => {
    try {
      account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:5173/app', // Redirect here on success
        'http://localhost:5173/'     // Redirect here on failure
      );
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  // ✅ IMPROVED: Safe Logout
  const logout = async () => {
    try {
      // Attempt to delete the session on the server
      await account.deleteSession("current");
    } catch (error) {
      // If session is already gone/invalid, just ignore the error
      console.warn("Logout warning:", error);
    } finally {
      // CRITICAL: Always clear the local state, no matter what happens on the server
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};