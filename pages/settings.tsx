import SidebarPageLayout from "@/components/SidebarPageLayout";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

export default function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <SidebarPageLayout>
      <h1 className="text-2xl font-bold">Settings</h1>

      <TasksSettings />
      <OrganisationSettings />
    </SidebarPageLayout>
  );
}

const TasksSettings = () => {
  const { user } = useContext(AuthContext);

  const [organisation, setOrganisation] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      let orgDoc = await getDoc(doc(db, "organisations", user.organisation.id));
      setOrganisation({ id: orgDoc.id, ...orgDoc.data() });
    };

    if (user) init();
  }, [user]);

  const [categoryName, setCategoryName] = useState("");

  const addCategory = async () => {
    try {
      await updateDoc(doc(db, "organisations", organisation.id), {
        categories: arrayUnion(categoryName),
      });

      console.log("added category");

      setOrganisation({
        ...organisation,

        categories: [...(organisation.categories || []), categoryName],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (category: string) => {
    try {
      await updateDoc(doc(db, "organisations", organisation.id), {
        categories: arrayRemove(category),
      });

      console.log("added category");

      setOrganisation({
        ...organisation,

        categories: organisation.categories.filter((c: any) => c !== category),
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (organisation)
    return (
      <div className="flex flex-col gap-4 w-4/12 mt-8">
        <h2 className="text-xl font-medium">Task Categories</h2>

        <ul className="">
          {organisation.categories &&
            organisation.categories.map((category: any, i: number) => {
              return (
                <li className="flex items-center" key={i}>
                  <span className="w-4/12">{category}</span>
                  <span
                    className="text-sm underline cursor-pointer"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </span>
                </li>
              );
            })}
        </ul>

        <input
          type="text"
          className="p-2 rounded-md border"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New Category Name"
        />
        <button
          className="btn btn-primary"
          disabled={!categoryName}
          onClick={addCategory}
        >
          Add Category
        </button>
      </div>
    );
};

const OrganisationSettings = () => {
  const { user } = useContext(AuthContext);

  const [organisation, setOrganisation] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      let orgDoc = await getDoc(doc(db, "organisations", user.organisation.id));
      setOrganisation({ id: orgDoc.id, ...orgDoc.data() });
    };

    if (user) init();
  }, [user]);

  if (user && organisation)
    return (
      <div className="flex flex-col gap-4 w-4/12 mt-8">
        <h2 className="text-xl font-medium">Organisation</h2>

        <div className="flex items-center gap-2">
          <label>Name: </label>
          <span className="">{organisation.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Passcode: </label>
          <span className="">{organisation.passcode}</span>
        </div>
        <label>Members: </label>
        <div className="flex flex-col gap-1">
          {organisation?.users &&
            organisation?.users?.map((u: any, i: number) => {
              return (
                <div className="p-2 border shadow-sm flex" key={i}>
                  <span className="">{u.name}</span>
                </div>
              );
            })}
        </div>
      </div>
    );
};
