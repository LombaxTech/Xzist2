import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useContext, useState } from "react";

export default function SuperAdminControlCenter() {
  const { user, userLoading } = useContext(AuthContext);

  const [collectionName, setCollectionName] = useState("");
  const [collectionDeleteSuccess, setCollectionDeleteSuccess] = useState(false);

  const logStuff = async () => {
    console.log(user);
  };

  const removeAllUsersExceptSuperAdmin = async () => {
    try {
      // remove all users;

      let users: any = [];

      let usersSnapshot = await getDocs(collection(db, "users"));
      usersSnapshot.forEach((userDoc) => {
        if (userDoc.data().type !== "superadmin")
          users.push({ id: userDoc.id });
      });

      for (const userToDelete of users) {
        await deleteDoc(doc(db, "users", userToDelete.id));
      }

      console.log("deleted all users except superadmin");
    } catch (error) {
      console.log(error);
    }
  };

  const removeOtherStuff = async () => {
    try {
      // let collectionName = "schools";
      // collectionName = "invites";

      let stuffArray: any = [];

      let snapshot = await getDocs(collection(db, collectionName));
      snapshot.forEach((doc) => stuffArray.push({ id: doc.id }));

      for (const stuff of stuffArray) {
        await deleteDoc(doc(db, collectionName, stuff.id));
      }

      console.log("deleted all members of " + collectionName);
    } catch (error) {
      console.log(error);
    }
  };

  // if (user?.type === "superadmin")
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Control Center</h1>
      <button className="btn btn-primary btn-sm" onClick={logStuff}>
        Log stuff
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={removeAllUsersExceptSuperAdmin}
      >
        Remove all users except superadmin
      </button>
      <input
        type="text"
        className="p-2"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
        placeholder="Collection Name"
      />
      <button className="btn btn-secondary btn-sm" onClick={removeOtherStuff}>
        Remove other stuff
      </button>
    </div>
  );
}
