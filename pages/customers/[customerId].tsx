import AddCustomerNodeModal from "@/components/AddCustomerNoteModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import { db } from "@/firebase";
import { formatDate } from "@/lib/helperFunctions";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function CustomerPage() {
  const router = useRouter();

  const { customerId } = router.query;

  const [customer, setCustomer] = useState<any>(null);
  const [notes, setNotes] = useState<any>([]);

  useEffect(() => {
    if (!customerId) return;

    const init = async () => {
      let customerDoc = await getDoc(
        doc(db, "customers", customerId as string)
      );
      setCustomer({ id: customerDoc.id, ...customerDoc.data() });

      let notesQuery = query(
        collection(db, "notes"),
        where("customerId", "==", customerId)
      );

      onSnapshot(notesQuery, (snapshot) => {
        let notes: any = [];
        snapshot.forEach((doc) => notes.push({ id: doc.id, ...doc.data() }));
        setNotes(notes);
      });
    };

    init();
  }, [customerId]);

  if (customerId && customer)
    return (
      <SidebarPageLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Page</h1>
          <AddCustomerNodeModal customerId={customerId as string} />
        </div>
        {/* TABLE OF CUSTOMER BASIC INFO */}
        <div className="overflow-x-auto mt-6">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-0">
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>
                  {customer.type === "individual" ? "Individual" : "Company"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* NOTES ON CUSTOMER */}
        <h1 className="text-xl font-medium mt-8 mb-4">Notes</h1>
        <div className="flex flex-col gap-2">
          {notes &&
            notes.map((note: any, i: number) => {
              return (
                <div
                  key={i}
                  className="p-2 border shadow-md flex items-center justify-between"
                >
                  <p className="">{note.text}</p>
                  <span className="text-sm font-light">
                    {formatDate(note.createdAt.toDate())}
                  </span>
                </div>
              );
            })}

          {notes.length === 0 ? "There are no notes" : ""}
        </div>
      </SidebarPageLayout>
    );
}
