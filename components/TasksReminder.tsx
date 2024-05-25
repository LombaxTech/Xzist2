import { getKeyForDayMonthYear } from "@/lib/helperFunctions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function TasksReminder() {
  const [show, setShow] = useState(false);

  const dayMonthYear = getKeyForDayMonthYear();

  useEffect(() => {
    let reminderShow: any = localStorage.getItem(
      `task-reminder-show-${dayMonthYear}`
    );

    if (!reminderShow) {
      // clear out previous data, might cause other bugs in long term so make this work better
      localStorage.clear();
      localStorage.setItem(`task-reminder-show-${dayMonthYear}`, "true");
      setShow(true);
    }

    if (reminderShow) {
      if (reminderShow === "false") return setShow(false);
      return setShow(true);
    }

    // localStorage.setItem(
    // 	`words-${monthYear}`,
    // 	JSON.stringify(updatedWordsThisMonth)
    // );
  }, []);

  const hideReminder = () => {
    localStorage.setItem(`task-reminder-show-${dayMonthYear}`, "false");

    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="p-4 border-b-2 text-center bg-primary text-white">
      <Link href={`/tasks`} className="text-lg font-medium">
        Remember To Check Out Your Tasks
      </Link>
      <span
        className="ml-10 cursor-pointer hover:underline"
        onClick={hideReminder}
      >
        {" "}
        Hide
      </span>
    </div>
  );
}
