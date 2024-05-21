import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import { FaTasks } from "react-icons/fa";
import Link from "next/link";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading, userSetupComplete, signout } =
    useContext(AuthContext);

  // SIDEBAR LAYOUT IF USER IS SIGNED IN
  if (user && userSetupComplete)
    return <UserSetupCompleteLayout>{children}</UserSetupCompleteLayout>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

const UserSetupCompleteLayout = ({ children }: { children: any }) => {
  const { user, userLoading, userSetupComplete, signout } =
    useContext(AuthContext);

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  return (
    <div className="flex w-screen h-screen max-h-screen overflow-hidden">
      {/* SIDE BAR */}
      <div className="max-h-screen w-[220px] bg-white border-r-2 flex flex-col">
        <div className="border-b-2">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold text-center m-4">XZIST</h1>
          </Link>
        </div>
        <ul className="flex-1 overflow-y-auto">
          <Link
            href={"/"}
            className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
          >
            <FaTasks size={20} />
            <span className="">Dashboard</span>
          </Link>
          <Link
            href={"/tasks"}
            className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
          >
            <FaTasks size={20} />
            <span className="">Tasks</span>
          </Link>
          <div
            className="flex flex-col"
            onMouseEnter={() => setShowCustomerDropdown(true)}
            onMouseLeave={() => setShowCustomerDropdown(false)}
          >
            <Link
              href={"/customers"}
              className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
            >
              <FaTasks size={20} />
              <span className="">Customers</span>
            </Link>
            {/* <div
              className={`pl-8 ${
                showCustomerDropdown ? "flex flex-col" : "hidden"
              }`}
            >
              <Link
                href={"/customers"}
                className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
              >
                <FaTasks size={20} />
                <span className="">Individual</span>
              </Link>
              <Link
                href={"/customers"}
                className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
              >
                <FaTasks size={20} />
                <span className="">Companies</span>
              </Link>
            </div> */}
          </div>
        </ul>

        <div
          className="px-8 py-4 cursor-pointer text-center font-medium border-t-2"
          onClick={signout}
        >
          Sign Out
        </div>
      </div>

      {/* CONTEXT V2 */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
