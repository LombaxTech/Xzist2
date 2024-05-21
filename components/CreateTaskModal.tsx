import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection } from "firebase/firestore";
import { Fragment, useContext, useState } from "react";

export default function CreateTaskModal() {
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [assignedTo, setAssignedTo] = useState<any>(null);

  const createTask = async () => {
    const newTask = {
      description,
      dueDate,
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
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Customer: </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Assigned To: </label>
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
