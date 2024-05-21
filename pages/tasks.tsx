import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { db } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState<any>([]);

  // useEffect(() => {
  //   const init = async () => {
  //     let tasksRef = collection(db, "tasks");
  //     onSnapshot(tasksRef, (snapshot: any) => {
  //       let tasks: any = [];
  //       snapshot.forEach((doc: any) =>
  //         tasks.push({ id: doc.id, ...doc.data() })
  //       );
  //       setTasks(tasks);
  //     });
  //   };

  //   init();
  // }, []);

  return (
    <SidebarPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskModal />
      </div>

      <div className="flex gap-4 mt-8">
        {/* FILTERS */}
        <div className="p-4 px-16 shadow-md flex flex-col gap-2">
          <h2 className="text-xl font-medium">Filters</h2>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {tasks.length === 0 ? "No Tasks" : ""}
          {tasks &&
            tasks.map((task: any, i: number) => {
              return (
                <div
                  key={i}
                  className="p-2 shadow-md flex items-center justify-between"
                >
                  <span className="">{task?.description}</span>
                  <EditTaskModal task={task} />
                </div>
              );
            })}
        </div>
      </div>
    </SidebarPageLayout>
  );
}
