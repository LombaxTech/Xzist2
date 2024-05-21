import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function SetupAccount() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");

  const [mode, setMode] = useState<"join-org" | "create-org">("create-org");

  const finishProfileSetup = async () => {
    const firestoreUser = {
      name,
      email: user.email,
    };

    const newOrg = {
      name: orgName,
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
    setUser({ ...user, ...firestoreUser, setup: true });
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

        <button
          className="btn btn-primary"
          onClick={finishProfileSetup}
          disabled={!name || !orgName}
        >
          Finish Profile Set Up
        </button>
      </div>
    </div>
  );
}
