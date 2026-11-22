
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      setUser(firebaseUser);

      try {
        const savedProfile = JSON.parse(
          localStorage.getItem("userProfile") || "null"
        );

        setProfile(savedProfile);
      } catch (error) {
        console.error("Invalid user profile:", error);
        setProfile(null);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  const updateProfile = (data) => {

    localStorage.setItem(
      "userProfile",
      JSON.stringify(data)
    );

    setProfile(data);

  };

  const logoutProfile = () => {

    localStorage.removeItem("userProfile");
    setProfile(null);
    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        updateProfile,
        logoutProfile
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}
