import { focusTaskIdAtom } from "@/atoms/taskAtoms";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  areDatesEqual,
  formatDate,
  formatDateAsInputValue,
} from "@/lib/helperFunctions";
import { Dialog, Transition } from "@headlessui/react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { Fragment, useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

export default function EditTaskModal({ task }: { task: any }) {
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
        where("createdBy.organisation.id", "==", user?.organisation?.id)
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

  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState<any>(new Date(task.dueDate?.toDate()));
  const [customerId, setCustomerId] = useState<any>(task.customer?.id);
  const [assignedToId, setAssignedToId] = useState<any>(task.assignedTo?.id);
  const [category, setCategory] = useState<any>(task.category);
  const [focusTaskId, setFocusTaskId] = useAtom(focusTaskIdAtom);

  const saveChanges = async () => {
    let assignedTo = organisation.users.find((u: any) => u.id === assignedToId);
    let customer = customers.find((c: any) => c.id === customerId);

    const updatedTask = {
      description,
      ...(assignedTo && { assignedTo }),
      ...(customer && { customer }),
    };

    try {
      await updateDoc(doc(db, "tasks", task.id as string), updatedTask);
      closeModal();

      console.log("updated task");

      setChangesExist(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [changesExist, setChangesExist] = useState(false);

  useEffect(() => {
    if (
      description !== task.description ||
      assignedToId !== task.assignedTo?.id ||
      customerId !== task.customer?.id ||
      !areDatesEqual(new Date(dueDate), new Date(task.dueDate.toDate()))
    ) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [description, dueDate, customerId, assignedToId]);

  const toggleComplete = async () => {
    await updateDoc(doc(db, "tasks", task.id), {
      complete: isTaskComplete ? false : true,
    });
    closeModal();
  };

  let isTaskComplete = task.complete ? true : false;

  const focusOnTask = () => {
    setFocusTaskId(task.id);
    closeModal();
  };

  return (
    <>
      <h3 className="cursor-pointer underline" onClick={openModal}>
        Edit
      </h3>

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
                      Edit Task
                    </h1>
                    <FaEye
                      size={25}
                      className="cursor-pointer"
                      onClick={focusOnTask}
                    />
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
                        defaultValue={formatDateAsInputValue(
                          new Date(task.dueDate.toDate())
                        )}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                      {/* <span className="">{formatDate(dueDate)}</span> */}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Customer: </label>
                      <select
                        value={customerId}
                        className="outline-none border-2 p-2 rounded-md"
                        onChange={(e) => setCustomerId(e.target.value)}
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
                    <div className="flex flex-col gap-1">
                      <label className="">Assigned To: </label>
                      <select
                        className="outline-none border-2 p-2 rounded-md"
                        value={assignedToId}
                        onChange={(e) => setAssignedToId(e.target.value)}
                      >
                        <option></option>;
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

                    <div className="flex flex-col gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={toggleComplete}
                      >
                        {isTaskComplete
                          ? "Mark as incomplete"
                          : "Mark as completed"}
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={saveChanges}
                        disabled={!changesExist}
                      >
                        Save
                      </button>
                    </div>
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
