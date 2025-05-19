import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { fireDB } from "../../Firebase/FirebaseConfig";
import { toast } from "react-toastify";

const RequestForm = ({ Close }) => {
  const [hoverOn, sethoverOn] = useState(false);

  const toggle = () => {
    sethoverOn(!hoverOn);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(fireDB, "requests"), formData);
      toast.success("We'll Connect With You Very Soon");
      Close();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center bg-gray-200 bg-opacity-65 justify-center z-50">
      <div className="sm:w-[38rem] mx-auto my-8 overflow-hidden rounded-2xl bg-white shadow-lg sm:max-w-lg">
        <div className="bg-[#FF5139] px-10 py-8 text-center text-white">
          <p className="font-serif text-2xl font-semibold tracking-wider">
            Submit your request
          </p>
          <p className="text-center text-blue-100">We'll Contact You Soon</p>
        </div>
        <div className="space-y-4 px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block" htmlFor="name">
              <p className="text-gray-600">Name</p>
              <input
                className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </label>
            <label className="block" htmlFor="email">
              <p className="text-gray-600">Email Address</p>
              <input
                className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </label>
            <label className="block" htmlFor="request">
              <p className="text-gray-600">Request</p>
              <textarea
                className="h-32 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="Enter your request"
              ></textarea>
            </label>
            <div>
              <button
                onMouseEnter={toggle}
                onMouseLeave={toggle}
                className={`${
                  hoverOn
                    ? "mt-4 w-[50%] bg-white px-10 py-2 font-semibold text-[#FF5139] border-[1px] rounded-l-md border-[#FF5139]"
                    : "mt-4 w-[50%] bg-[#FF5139] px-10 py-2 font-semibold text-white rounded-l-md"
                }`}
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={Close}
                className={`${
                  hoverOn
                    ? "mt-4 w-[50%] bg-[#FF5139] px-10 py-2 font-semibold text-white rounded-r-md"
                    : "mt-4 w-[50%] bg-white px-10 py-2 font-semibold text-[#FF5139] border-[1px] border-[#FF5139] rounded-r-md"
                }`}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
