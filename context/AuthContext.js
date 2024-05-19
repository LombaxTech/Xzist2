import { app, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUserLoading(true);

      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);

        try {
          onSnapshot(userRef, (userSnapshot) => {
            if (userSnapshot.exists()) {
              setUser({ ...authUser, ...userSnapshot.data() });
            } else {
              setUser({ ...authUser, setup: false });
            }

            setUserLoading(false);
          });
        } catch (error) {
          console.log("no user found in onauthchange");
          setUser(null);
          setUserLoading(false);
        }
      } else {
        setUser(null);
        setUserLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
