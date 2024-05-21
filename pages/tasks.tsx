import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  getDoc,
  onSnapshot,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

export default function Tasks() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState<any>([]);
  const [org, setOrg] = useState<any>(null);
  const [customers, setCustomers] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      // GET TASKS
      let tasksRef = collection(db, "tasks");
      onSnapshot(tasksRef, (snapshot: any) => {
        let tasks: any = [];
        snapshot.forEach((doc: any) =>
          tasks.push({ id: doc.id, ...doc.data() })
        );
        setTasks(tasks);
      });

      // GET ORG
      let orgDoc = await getDoc(
        doc(db, "organisations", user.organisation?.id)
      );
      setOrg({ id: orgDoc.id, ...orgDoc.data() });

      // GET CUSTOMERS
      let customersQuery = query(
        collection(db, "customers"),
        where("createdBy.id", "==", user.uid)
      );
      let snapshot = await getDocs(customersQuery);
      let customers: any = [];
      snapshot.forEach((doc) => customers.push({ id: doc.id, ...doc.data() }));
      setCustomers(customers);
    };

    if (user) init();
  }, [user]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCustomerId, setSelectedCustomerId] = useState("All");
  const [selectedAssignedToId, setSelectedAssignedToId] = useState("All");

  return (
    <SidebarPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskModal />
      </div>

      <div className="flex gap-4 mt-8">
        {/* FILTERS */}
        <div className="p-4 w-[250px] shadow-md flex flex-col gap-2">
          <h2 className="text-xl font-medium">Filters</h2>
          <div className="flex flex-col gap-4 mt-4">
            {org && (
              <div className="flex flex-col gap-1">
                <label className="">Category</label>
                <select
                  className="p-2 border"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All</option>
                  {org?.categories &&
                    org?.categories.map((category: any, i: number) => {
                      return <option value={category}>{category}</option>;
                    })}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="">Customer</label>
              <select
                className="p-2 border"
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option>All</option>
                {customers &&
                  customers.map((customer: any, i: number) => {
                    return <option value={customer.id}>{customer.name}</option>;
                  })}
              </select>
            </div>

            {org && (
              <div className="flex flex-col gap-1">
                <label className="">Assigned To</label>
                <select
                  className="p-2 border"
                  onChange={(e) => setSelectedAssignedToId(e.target.value)}
                >
                  <option>All</option>
                  {org?.users &&
                    org?.users.map((u: any, i: number) => {
                      return <option value={u.id}>{u.name}</option>;
                    })}
                </select>
              </div>
            )}
          </div>
          <button
            className="btn"
            onClick={() => {
              console.log(`selected customer id: ${selectedCustomerId}`);
              console.log(`selected assignedto id: ${selectedAssignedToId}`);
              console.log(`selected category: ${selectedCategory}`);
            }}
          >
            Log
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {tasks.length === 0 ? "No Tasks" : ""}
          {tasks &&
            tasks.map((task: any, i: number) => {
              if (
                selectedCategory !== "All" &&
                selectedCategory !== task.category
              )
                return null;

              if (
                selectedCustomerId !== "All" &&
                selectedCustomerId !== task.customer?.id
              )
                return null;

              if (
                selectedAssignedToId !== "All" &&
                selectedAssignedToId !== task.assignedTo?.id
              )
                return null;

              return (
                <div
                  key={i}
                  className="p-2 shadow-md flex items-center justify-between"
                >
                  <span className="">{task.description}</span>
                  <EditTaskModal task={task} />
                </div>
              );
            })}
        </div>
      </div>
    </SidebarPageLayout>
  );
}
