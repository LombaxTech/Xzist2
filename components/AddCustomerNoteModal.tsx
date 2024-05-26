import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection } from "firebase/firestore";
import { Fragment, useContext, useState } from "react";

const noteTypes = ["General", "Call", "Email", "Face To Face", "Message"];

export default function AddCustomerNodeModal({
  customerId,
}: {
  customerId: string;
}) {
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const [text, setText] = useState("");
  const [type, setType] = useState("General");

  const createNote = async () => {
    const newNote = {
      text,
      type,
      createdAt: new Date(),
      createdBy: {
        user: {
          id: user.uid,
        },
        organisation: {
          id: user.organisation.id,
        },
      },
      customerId,
    };

    try {
      await addDoc(collection(db, "notes"), newNote);

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Add Note
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
                      Create Note
                    </h1>
                  </div>

                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="">Note Type </label>
                      <select
                        className="outline-none border-2 p-2 rounded-md"
                        onChange={(e) => setType(e.target.value)}
                      >
                        {noteTypes.map((noteType: string, i: number) => {
                          return (
                            <option key={i} value={noteType}>
                              {noteType}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Note Text </label>
                      <textarea
                        className="p-2 outline-none rounded-md border-2"
                        placeholder=""
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={createNote}
                      disabled={!text}
                    >
                      Create Note
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
