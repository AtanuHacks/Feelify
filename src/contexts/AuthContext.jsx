import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite"; // Imports your connection
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is logged in on load
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

  // 2. Login
  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    await checkUserStatus();
  };

  // 3. Signup
  const signup = async (email, password, name) => {
    // Create account
    await account.create(ID.unique(), email, password, name);
    // Auto-login after signup
    await login(email, password);
  };

  // 4. Logout
  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
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