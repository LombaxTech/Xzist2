import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Link from "next/link";
import React, { Fragment, useContext, useState } from "react";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAtom } from "jotai";
import { sidebarCollapsedAtom } from "@/atoms/sidebarCollapseAtom";

const provider = new GoogleAuthProvider();

export default function Navbar({
  showLogo,
  showCollapseIcon,
}: {
  showLogo: boolean;
  showCollapseIcon?: boolean;
}) {
  const { user, userLoading, userSetupComplete } = useContext(AuthContext);
  const router = useRouter();

  const signout = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
      router.push("/");
    } catch (error) {
      console.log("error signing out...");
      console.log(error);
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div
      className={`p-4 flex items-center border-b ${
        showLogo || showCollapseIcon ? "justify-between" : "justify-end"
      }`}
    >
      {showLogo && (
        <h1 className="font-bold italic">
          <Link href={"/"}>XZIST</Link>
        </h1>
      )}
      {showCollapseIcon && (
        <div className="cursor-pointer" onClick={toggleSidebar}>
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </div>
      )}
      <ul className="flex items-center gap-4">
        {!user && (
          <Link href={"signin"}>
            <button className="btn btn-primary btn-sm">Login</button>
          </Link>
        )}

        {user && !userSetupComplete && (
          <li className="cursor-pointer" onClick={signout}>
            Sign Out
          </li>
        )}

        {user && userSetupComplete && (
          <>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="w-10 h-10 rounded-full flex justify-center items-center bg-primary text-white"
              >
                <span className="">{user.name[0]}</span>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                {/* <li>
                  <Link href={`/my-profile`}>Profile</Link>
                </li> */}
                <li onClick={signout}>
                  <span>Sign Out</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </ul>
    </div>
  );
}
