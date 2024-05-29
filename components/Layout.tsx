import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaUser } from "react-icons/fa";
import { FaGear, FaPencil } from "react-icons/fa6";
import Navbar from "./Navbar";
import TasksReminder from "./TasksReminder";
import { useAtom } from "jotai";
import { sidebarCollapsedAtom } from "@/atoms/sidebarCollapseAtom";

export default function Layout({ children }: { children: any }) {
  const router = useRouter();
  const { pathname } = router;
  const isLoginPage = pathname === "/login";

  const { user, userLoading, userSetupComplete, signout } =
    useContext(AuthContext);

  // SIDEBAR LAYOUT IF USER IS SIGNED IN
  if (user && userSetupComplete)
    return <UserSetupCompleteLayout>{children}</UserSetupCompleteLayout>;

  return (
    <div className="flex flex-col min-h-screen">
      {isLoginPage ? null : <Navbar showLogo />}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

const UserSetupCompleteLayout = ({ children }: { children: any }) => {
  const { user, userLoading, userSetupComplete, signout } =
    useContext(AuthContext);

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  // const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex w-screen h-screen max-h-screen overflow-hidden">
      {/* SIDE BAR */}
      <div
        className={`max-h-screen duration-200 ${
          collapsed ? "w-[100px]" : "w-[200px]"
        } bg-white border-r flex flex-col`}
      >
        <div className={`p-4 px-8 ${collapsed ? "hidden" : "none"}`}>
          {!collapsed && (
            <Link href={"/"}>
              {/* <h1 className="text-2xl font-bold text-center m-4">XZIST</h1> */}
              <img src={"/xzist-logo.jpg"} className="flex-1" />
            </Link>
          )}
        </div>
        <ul className="flex-1 overflow-y-auto">
          {/* <Link
            href={"/"}
            className="px-8 py-4 hover:bg-blue-200 flex items-center gap-4"
          >
            <FaHome size={20} />
            <span className="">Dashboard</span>
          </Link> */}
          <Link
            href={"/tasks"}
            className={`px-8 py-4 hover:bg-blue-200 flex items-center gap-4 ${
              collapsed ? "flex justify-center" : ""
            }`}
          >
            <FaPencil size={20} />
            {!collapsed && <span className="">Tasks</span>}
          </Link>
          <div
            className="flex flex-col"
            onMouseEnter={() => setShowCustomerDropdown(true)}
            onMouseLeave={() => setShowCustomerDropdown(false)}
          >
            <Link
              href={"/customers"}
              className={`px-8 py-4 hover:bg-blue-200 flex items-center gap-4 ${
                collapsed ? "flex justify-center" : ""
              }`}
            >
              <FaUser size={20} />
              {!collapsed && <span className="">Customers</span>}
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
          <Link
            href={"/settings"}
            className={`px-8 py-4 hover:bg-blue-200 flex items-center gap-4 ${
              collapsed ? "flex justify-center" : ""
            }`}
          >
            <FaGear size={20} />
            {!collapsed && <span className="">Settings</span>}
          </Link>
        </ul>

        <div
          className="px-8 py-4 cursor-pointer text-center font-medium border-t"
          onClick={signout}
        >
          Sign Out
        </div>
      </div>

      {/* CONTEXT V2 */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <TasksReminder />
          <Navbar showLogo={false} showCollapseIcon />
          <div className="flex flex-col overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
