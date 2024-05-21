import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection } from "firebase/firestore";
import { Fragment, useContext, useState } from "react";

export default function CreateCustomerModal() {
  const { user } = useContext(AuthContext);

  const [createCustomerModalOpen, setCreateCustomerModalOpen] = useState(false);

  const closeModal = () => setCreateCustomerModalOpen(false);
  const openModal = () => setCreateCustomerModalOpen(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const createCustomer = async () => {
    const newCustomer = {
      name,
      email,
      phoneNumber,
      type: "individual",
      createdAt: new Date(),
      createdBy: {
        id: user.uid,
      },
    };

    try {
      await addDoc(collection(db, "customers"), newCustomer);
      console.log("made new customer");
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
      <Transition appear show={createCustomerModalOpen} as={Fragment}>
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
                      Create Customer
                    </h1>
                    <span className="cursor-pointer underline">
                      Switch to company customer
                    </span>
                  </div>

                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="">Name: </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Email: </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="">Phone Number: </label>
                      <input
                        type="text"
                        className="p-2 rounded-md border-2"
                        placeholder=""
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={createCustomer}
                      disabled={!name || !email}
                    >
                      Create Customer
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
