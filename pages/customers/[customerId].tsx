import AddCustomerNodeModal from "@/components/AddCustomerNoteModal";
import CreateTaskModal from "@/components/CreateTaskModal";
import SidebarPageLayout from "@/components/SidebarPageLayout";
import Task from "@/components/Task";
import { db } from "@/firebase";
import { formatDate } from "@/lib/helperFunctions";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function CustomerPage() {
  const router = useRouter();

  const { customerId } = router.query;

  const [customer, setCustomer] = useState<any>(null);
  const [notes, setNotes] = useState<any>([]);
  const [company, setCompany] = useState<any>(null);
  const [tasks, setTasks] = useState<any>([]);

  useEffect(() => {
    if (!customerId) return;

    const init = async () => {
      let customerDoc = await getDoc(
        doc(db, "customers", customerId as string)
      );
      setCustomer({ id: customerDoc.id, ...customerDoc.data() });

      let customer = customerDoc.data();

      if (customer?.type === "individual" && customer?.companyId) {
        let companyDoc = await getDoc(
          doc(db, "customers", customer?.companyId as string)
        );
        setCompany({ id: companyDoc.id, ...companyDoc.data() });
      }

      let notesQuery = query(
        collection(db, "notes"),
        where("customerId", "==", customerId)
      );

      onSnapshot(notesQuery, (snapshot) => {
        let notes: any = [];
        snapshot.forEach((doc) => notes.push({ id: doc.id, ...doc.data() }));
        setNotes(notes);
      });

      // GET TASKS
      let tasksSnapshot = await getDocs(
        query(collection(db, "tasks"), where("customer.id", "==", customerId))
      );
      let tasks: any = [];
      tasksSnapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));
      setTasks(tasks);
    };

    init();
  }, [customerId]);

  const isCompany = customer?.type === "company";

  if (customerId && customer)
    return (
      <SidebarPageLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Page</h1>
        </div>
        {/* TABLE OF CUSTOMER BASIC INFO */}
        <div className="overflow-x-auto mt-6 mb-6">
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

        {/* COMAPNY INFO IF CUSTOMER IS INDIVIDUAL */}
        {!isCompany && (
          <>
            {company ? (
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-medium">Company Name:</h1>
                <Link href={`/customers/${company.id}`}>
                  <span className="flex items-center gap-2">
                    <span>{company.name}</span>
                    <FaExternalLinkAlt size={15} />
                  </span>
                </Link>
              </div>
            ) : (
              "Customer does not belong to a company"
            )}
          </>
        )}

        {/* TASKS */}
        <div className="flex flex-col gap-2 my-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-medium">Tasks</h1>
            <CreateTaskModal />
          </div>

          {tasks.length === 0 ? "No Tasks" : ""}
          {tasks &&
            tasks.map((task: any, i: number) => {
              return <Task task={task} key={i} />;
            })}
        </div>

        {/* USERS INFO IF CUSTOMER IS COMPANY */}
        {isCompany && (
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium">Company Members</h1>
            <div className="flex flex-col gap-1">
              {customer?.users &&
                customer?.users?.map((u: any, i: number) => {
                  return (
                    <div key={i} className="p-2">
                      <Link href={`/customers/${u.id}`}>
                        <span className="flex items-center gap-2">
                          <span>{u.name}</span>
                          <FaExternalLinkAlt size={15} />
                        </span>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* NOTES ON CUSTOMER */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium mt-4 mb-4">Notes</h1>
          <AddCustomerNodeModal customerId={customerId as string} />
        </div>
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
