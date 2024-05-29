import { focusTaskIdAtom } from "@/atoms/taskAtoms";
import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import Task from "@/components/Task";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  formatDate,
  isDateInPast,
  isInCurrentMonth,
  isInCurrentWeek,
  isToday,
} from "@/lib/helperFunctions";
import {
  collection,
  getDoc,
  onSnapshot,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAtom } from "jotai";
import React, { useContext, useEffect, useState } from "react";

const dueOptions = ["All", "Today", "This Week", "This Month", "Overdue"];

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
        where("createdBy.organisation.id", "==", user?.organisation?.id)
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
  const [taskStatus, setTaskStatus] = useState("Incomplete");
  const [dueDate, setDueDate] = useState<
    "All" | "Today" | "This Week" | "This Month" | "Overdue"
  >("All");

  const [focusTaskId, setFocusTaskId] = useAtom(focusTaskIdAtom);

  return (
    <SidebarPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskModal />
      </div>

      <div className="flex gap-4 mt-8">
        {/* FILTERS */}
        <div className="p-4 w-[250px] bg-white shadow-md flex flex-col gap-2">
          <h2 className="text-xl font-medium">Filters</h2>
          <div className="flex flex-col gap-4 mt-4">
            {/* BY CATEGORY */}
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
                      return (
                        <option key={i} value={category}>
                          {category}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
            {/* BY CUSTOMER */}
            <div className="flex flex-col gap-1">
              <label className="">Customer</label>
              <select
                className="p-2 border"
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option>All</option>
                {customers &&
                  customers.map((customer: any, i: number) => {
                    return (
                      <option key={i} value={customer.id}>
                        {customer.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            {/* BY ASSIGNED TO  */}
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
                      return (
                        <option key={i} value={u.id}>
                          {u.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
            {/* BY COMPLETE OR NOT */}
            <div className="flex flex-col gap-1">
              <label className="">Complete</label>
              <select
                className="p-2 border"
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option>Incomplete</option>
                <option>Complete</option>
                <option>All</option>
              </select>
            </div>
            {/* BY DATE */}
            <div className="flex flex-col gap-1">
              <label className="">Due Date</label>
              <select
                className="p-2 border"
                // @ts-ignore
                onChange={(e) => setDueDate(e.target.value)}
              >
                {dueOptions.map((option: any, i: number) => (
                  <option key={i}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm mt-4"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedCustomerId("All");
              setSelectedAssignedToId("All");
            }}
          >
            Clear
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4">
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

              if (
                taskStatus !== "All" &&
                ((taskStatus === "Incomplete" && task.complete) ||
                  (taskStatus === "Complete" && !task.complete))
              )
                return null;

              let taskDueDate = new Date(task.dueDate.toDate());

              if (
                dueDate !== "All" &&
                ((dueDate === "Overdue" && !isDateInPast(taskDueDate)) ||
                  (dueDate === "Today" && !isToday(taskDueDate)) ||
                  (dueDate === "This Week" && !isInCurrentWeek(taskDueDate)) ||
                  (dueDate === "This Month" && !isInCurrentMonth(taskDueDate)))
              )
                return null;

              if (focusTaskId && focusTaskId !== task.id) return null;

              return <Task task={task} key={i} />;
            })}

          {focusTaskId && (
            <h1
              className="text-lg font-medium cursor-pointer underline"
              onClick={() => setFocusTaskId("")}
            >
              Focus Mode is currently on. Turn it off?
            </h1>
          )}
        </div>
      </div>
    </SidebarPageLayout>
  );
}
