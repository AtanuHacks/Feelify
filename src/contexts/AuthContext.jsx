// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // 🔁 Keep Firebase user in sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(firebaseUser.isAnonymous || false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🟩 Login Methods
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsGuest(false);
    } catch (err) {
      console.error("Google login failed:", err.code, err.message);
      alert(`Google login failed: ${err.message}`);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      console.log("Email login successful:", res.user.email);
      setIsGuest(false);
    } catch (err) {
      console.error("Email login failed:", err.code, err.message);
      alert(`Authentication error: ${err.code.replace("auth/", "")}`);
    }
  };
  const signupWithEmail = async (email, password, displayName) => {
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password.trim()
    );

    const user = res.user;
    const nameToSet = displayName?.trim() || email.split("@")[0];

    // ✅ Set name in Firebase
    await updateProfile(user, { displayName: nameToSet });

    // ✅ Update state immediately so Navbar/Profile show correct name
    setUser({ ...user, displayName: nameToSet });
    setIsGuest(false);
    console.log("Signup successful with name:", nameToSet);
  } catch (err) {
    console.error("Signup failed:", err.code, err.message);
    alert(`Signup error: ${err.code.replace("auth/", "")}`);
  }
};
  // 🟦 Continue as Guest
  const continueAsGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      setUser(userCredential.user);
      setIsGuest(true);
      console.log("Guest login successful:", userCredential.user.uid);
    } catch (error) {
      console.error("Guest login failed:", error);
      alert("Unable to continue as guest. Please try again.");
    }
  };

  // 🟥 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  // ✅ Provide to app
  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        continueAsGuest,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}