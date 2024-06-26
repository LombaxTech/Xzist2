import CreateCustomerModal from "@/components/CreateCustomerModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function CustomersHome() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState<any>([]);
  const [mode, setMode] = useState<"individual" | "company">("individual");

  useEffect(() => {
    const fetchCustomers = async () => {
      let customersQuery = query(
        collection(db, "customers"),
        where("createdBy.organisation.id", "==", user?.organisation?.id)
      );

      onSnapshot(customersQuery, (snapshot: any) => {
        let customers: any = [];
        snapshot.forEach((doc: any) =>
          customers.push({ id: doc.id, ...doc.data() })
        );
        setCustomers(customers);
      });
    };

    if (user) fetchCustomers();
  }, [user]);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SidebarPageLayout>
      {/* TITLE + CREATE CUSTOMER MODAL */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <CreateCustomerModal />
      </div>

      {/* TABLE OF CUSTOMERS */}
      <div className="mt-4 mb-4">
        <div className="flex items-center gap-4">
          <select
            className="border-2 p-2"
            value={mode}
            // @ts-ignore
            onChange={(e) => setMode(e.target.value)}
          >
            <option value={"individual"}>Individual</option>
            <option value={"company"}>Company</option>
          </select>
          <input
            type="text"
            className="p-2 rounded-md shadow-sm border"
            placeholder="Search for a customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-white p-4 shadow-md">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {customers &&
              customers.map((customer: any, i: number) => {
                if (mode === "individual" && customer.type !== "individual")
                  return null;
                if (mode === "company" && customer.type !== "company")
                  return null;

                if (
                  searchTerm !== "" &&
                  !customer.name.includes(searchTerm) &&
                  !customer.email.includes(searchTerm) &&
                  !customer.phoneNumber.includes(searchTerm)
                )
                  return null;

                return (
                  <tr
                    key={i}
                    className="cursor-pointer"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </SidebarPageLayout>
  );
}
