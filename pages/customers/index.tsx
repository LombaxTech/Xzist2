import CreateCustomerModal from "@/components/CreateCustomerModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { db } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function CustomersHome() {
  const router = useRouter();

  const [customers, setCustomers] = useState<any>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      let customersRef = collection(db, "customers");
      onSnapshot(customersRef, (snapshot: any) => {
        let customers: any = [];
        snapshot.forEach((doc: any) =>
          customers.push({ id: doc.id, ...doc.data() })
        );
        setCustomers(customers);
      });
    };

    fetchCustomers();
  }, []);

  return (
    <SidebarPageLayout>
      {/* TITLE + CREATE CUSTOMER MODAL */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <CreateCustomerModal />
      </div>

      {/* TABLE OF CUSTOMERS */}
      <div className="overflow-x-auto mt-16">
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
