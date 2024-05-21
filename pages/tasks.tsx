import CreateTaskModal from "@/components/CreateTaskModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { db } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let tasksRef = collection(db, "tasks");
      onSnapshot(tasksRef, (snapshot: any) => {
        let tasks: any = [];
        snapshot.forEach((doc: any) =>
          tasks.push({ id: doc.id, ...doc.data() })
        );
        setTasks(tasks);
      });
    };

    init();
  }, []);

  return (
    <SidebarPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskModal />
      </div>

      <div className="flex flex-col gap-2 mt-8">
        {tasks.length === 0 ? "No Tasks" : ""}
        {tasks &&
          tasks.map((task: any, i: number) => {
            return (
              <div key={i} className="p-2 shadow-md">
                {task.description}
              </div>
            );
          })}
      </div>
    </SidebarPageLayout>
  );
}
