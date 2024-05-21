import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { generatePassword } from "@/lib/helperFunctions";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function SetupAccount() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [passcode, setPasscode] = useState("");

  const [error, setError] = useState<any>("");

  const [mode, setMode] = useState<"join-org" | "create-org">("create-org");

  const finishProfileSetup = async () => {
    setError("");

    const firestoreUser = {
      name,
      email: user.email,
    };

    if (mode === "create-org") {
      const newOrg = {
        name: orgName,
        passcode: generatePassword(8),
        createdAt: new Date(),
        createdBy: {
          userId: user.uid,
          name,
        },
        users: [
          {
            id: user.uid,
            ...firestoreUser,
          },
        ],
      };
      let orgDoc = await addDoc(collection(db, "organisations"), newOrg);

      let userDoc = await setDoc(doc(db, "users", user.uid), {
        ...firestoreUser,
        organisation: {
          id: orgDoc.id,
          name: orgName,
        },
      });

      let finalUser = {
        ...user,
        ...firestoreUser,
        organisation: {
          id: orgDoc.id,
          name: orgName,
        },
        setup: true,
      };

      setUser(finalUser);
    } else if (mode === "join-org") {
      // CHECK IF ORG EXISTS & PASSCODE IS ACCURATE
      let snapshot = await getDocs(collection(db, "organisations"));
      let orgDoc: any = null;
      snapshot.forEach((doc) => {
        if (doc.data().name === orgName) {
          orgDoc = { id: doc.id, ...doc.data() };
        }
      });
      if (!orgDoc) return setError("Organisation does not exist");
      if (orgDoc?.passcode !== passcode) return setError("Incorrect Passcode");

      // EXISTS AND PASSCODE CORRECT
      let userDoc = await setDoc(doc(db, "users", user.uid), {
        ...firestoreUser,
        organisation: {
          id: orgDoc.id,
          name: orgName,
        },
      });
      await updateDoc(doc(db, "organisations", orgDoc.id), {
        users: arrayUnion({
          id: user.uid,
          ...firestoreUser,
        }),
      });

      let finalUser = {
        ...user,
        ...firestoreUser,
        organisation: {
          id: orgDoc.id,
          name: orgName,
        },
        setup: true,
      };

      setUser(finalUser);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center pt-16">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-xl">Set up your profile</h1>
        <div className="flex flex-col gap-1">
          <label className="">Your Name</label>
          <input
            type="text"
            className="border outline-none p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
        </div>

        {mode === "create-org" ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="">Organisation Name </label>
              <input
                type="text"
                className="border outline-none p-2"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organisation Name"
              />
            </div>

            <span
              className="cursor-pointer underline text-blue-500 text-sm"
              onClick={() => setMode("join-org")}
            >
              Join existing Organisation
            </span>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label className="">Organisation Name </label>
              <input
                type="text"
                className="border outline-none p-2"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organisation Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="">Organisation Passcode </label>
              <input
                type="text"
                className="border outline-none p-2"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Organisation Passcode"
              />
            </div>
            <span
              className="cursor-pointer underline text-blue-500 text-sm"
              onClick={() => setMode("create-org")}
            >
              Create New Organisation
            </span>
          </>
        )}

        <button
          className="btn btn-primary"
          onClick={finishProfileSetup}
          disabled={!name || !orgName}
        >
          Finish Profile Set Up
        </button>
        {error && (
          <div className="p-2 bg-red-200 text-red-600 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
