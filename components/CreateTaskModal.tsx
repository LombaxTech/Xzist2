import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Dialog, Transition } from "@headlessui/react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { Fragment, useContext, useEffect, useState } from "react";

export default function CreateTaskModal() {
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const [organisation, setOrganisation] = useState<any>(null);
  const [customers, setCustomers] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let customersQuery = query(
        collection(db, "customers"),
        where("createdBy.id", "==", user?.uid)
      );

      let snapshot = await getDocs(customersQuery);

      let customers: any = [];
      snapshot.forEach((doc: any) =>
        customers.push({ id: doc.id, ...doc.data() })
      );
      setCustomers(customers);

      let orgDoc = await getDoc(doc(db, "organisations", user.organisation.id));
      setOrganisation({ id: orgDoc.id, ...orgDoc.data() });
    };

    if (user) init();
  }, [user]);

  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [assignedTo, setAssignedTo] = useState<any>(null);

  const createTask = async () => {
    const newTask = {
      description,
      dueDate: new Date(dueDate),
      customer,
      assignedTo,
      createdAt: new Date(),
      createdBy: {
        id: user.uid,
      },
    };

    try {
      await addDoc(collection(db, "tasks"), newTask);

      console.log("made new task");

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Create New
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Customer
                  </Dialog.Title> */}
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-medium leading-6 text-gray-900">
                      Create New Task
                    </h1>
                  </div>

                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="">Description: </label>
                      <textarea
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Due Date: </label>
                      <input
                        type="date"
                        className="p-2 rounded-md border-2"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    {/* CUSTOMER TASK IS FOR */}
                    <div className="flex flex-col gap-1">
                      <label className="">Customer: </label>
                      <select
                        className="outline-none border-2 p-2 rounded-md"
                        onChange={(e) => {
                          const customerId = e.target.value;
                          setCustomer(
                            customers.find((c: any) => c.id === customerId)
                          );
                        }}
                      >
                        <option>None</option>
                        {customers.map((customer: any, i: number) => {
                          return (
                            <option key={i} value={customer.id}>
                              {customer.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {/* ORGANISATION USER TASK IS FOR */}
                    <div className="flex flex-col gap-1">
                      <label className="">Assigned To: </label>
                      <select
                        className="outline-none border-2 p-2 rounded-md"
                        onChange={(e) => {
                          const userId = e.target.value;
                          setAssignedTo(
                            organisation?.users?.find(
                              (u: any) => u.id === userId
                            )
                          );
                        }}
                      >
                        {organisation?.users &&
                          organisation?.users?.map(
                            (orgUser: any, i: number) => {
                              return (
                                <option key={i} value={orgUser.id}>
                                  {orgUser.name}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </div>

                    {/* TASK CATEGORY */}
                    <div className="flex flex-col gap-1">
                      <label className="">Category: </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      />
                    </div>
                    <h1 className="font-bold text-xs">
                      Need to get customers as a drop down and assigned to
                    </h1>

                    <button
                      className="btn btn-primary"
                      onClick={createTask}
                      disabled={!description}
                    >
                      Create Task
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
