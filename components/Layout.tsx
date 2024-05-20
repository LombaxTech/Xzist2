import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import Navbar from "./Navbar";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading, userSetupComplete, signout } =
    useContext(AuthContext);

  // SIDEBAR LAYOUT IF USER IS SIGNED IN
  if (user && userSetupComplete)
    return (
      <div className="flex w-screen h-screen max-h-screen overflow-hidden">
        {/* SIDE BAR */}
        <div className="max-h-screen w-[220px] bg-white border-r-2 flex flex-col">
          {/* LOGO */}
          <div className="border-b-2">
            <h1 className="text-2xl font-bold text-center m-4">XZIST</h1>
          </div>
          {/* LINKS */}
          <ul className="flex-1 overflow-y-auto">
            <Link
              href={"/"}
              className="px-8 py-4 hover:bg-red-200 flex items-center gap-4"
            >
              <FaTasks size={20} />
              <span className="">Dashboard</span>
            </Link>
            <Link
              href={"/tasks"}
              className="px-8 py-4 hover:bg-red-200 flex items-center gap-4"
            >
              <FaTasks size={20} />
              <span className="">Tasks</span>
            </Link>
          </ul>

          <div
            className="px-8 py-4 cursor-pointer text-center font-medium border-t-2"
            onClick={signout}
          >
            Sign Out
          </div>
        </div>

        {/* CONTENT V1 WITH BAVBAR */}
        {/* <div className="flex-1 bg-white flex flex-col">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <Navbar />
            <div className="flex flex-col flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div> */}

        {/* CONTEXT V2 */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
