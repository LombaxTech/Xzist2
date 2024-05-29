import { formatDate } from "@/lib/helperFunctions";
import React from "react";
import EditTaskModal from "./EditTaskModal";

export default function Task({ task }: { task: any }) {
  return (
    <div className="p-2 bg-white shadow-sm flex items-center border border-l-primary border-l-8">
      <input
        disabled
        checked={task.complete}
        type="checkbox"
        className="mx-6"
      />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-lg">Todo: {task.title}</span>
        <span className="">{task.description}</span>
      </div>
      <div className="flex flex-col w-2/12">
        <span className="font-medium text-lg">Assigned To: </span>
        <span className="">{task.assignedTo.name}</span>
      </div>
      <div className="flex flex-col w-2/12">
        <span className="font-medium text-lg">Complete By: </span>
        <span className="">{formatDate(task.dueDate.toDate())}</span>
      </div>
      <EditTaskModal task={task} />
    </div>
  );
}
