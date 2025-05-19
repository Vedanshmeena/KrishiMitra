import firebase from "firebase/compat/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { fireDB } from "../../../Firebase/FirebaseConfig";
import { toast } from "react-toastify";
import { EyeIcon } from "@heroicons/react/16/solid";

const ViewCouponsModal = ({ coupons, onClose, onDelete }) => {
    const handleDelete = async (couponId) => {
      try {
        await onDelete(couponId);
      } catch (error) {
        console.error("Error deleting coupon: ", error);
        toast.error("Error deleting coupon");
      }
    };
  
    return (
      <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="my-4 max-w-screen-md border px-4 shadow-xl sm:mx-4 sm:rounded-xl bg-white sm:px-4 sm:py-4 md:mx-auto">
          <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
            <div className="shrink-0 mr-auto sm:py-3">
              <p className="font-medium">All Coupons</p>
              <p className="text-sm text-gray-600">
                List of all available coupons
              </p>
            </div>
            <button
              className="ml-auto rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200"
              onClick={()=>{onClose()}}
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.couponCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  

const AddCouponCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [value, setvalue] = useState("");

  const [coupons, setCoupons] = useState([]);

  const handleCouponOpen = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "coupons"));
      const couponsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(couponsData);
      setIsCouponOpen(true);
    } catch (error) {
      console.error("Error fetching coupons: ", error);
      toast.error("Error fetching coupons");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteDoc(doc(fireDB, "coupons", couponId));
      toast.success("Coupon deleted successfully!");
      const updatedCoupons = coupons.filter((coupon) => coupon.id !== couponId);
      setCoupons(updatedCoupons);
    } catch (error) {
      console.error("Error deleting coupon: ", error);
      toast.error("Error deleting coupon");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddCoupon = async () => {
    try {
      const couponData = {
        couponCode: couponCode,
        value: value,
      };
      const couponRef = doc(fireDB, "coupons", couponCode);
      await setDoc(couponRef, couponData); 
      toast.success("Coupon added successfully!");
      handleClose();
    } catch (error) {
      toast.error("Error adding coupon: ", error);
      console.log("Error adding coupon: ", error);
    }
  };
  

  return (
    <div>
      <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
        <button
          onClick={handleOpen}
          className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
        >
          Add New Coupon Code
        </button>

        <button
        onClick={handleCouponOpen}
          className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
          title="View Orders"
        >
          <EyeIcon className="w-4"/>
        </button>
      </span>
      {isOpen && (
        <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="my-4 max-w-screen-md border px-4 shadow-xl sm:mx-4 sm:rounded-xl bg-white sm:px-4 sm:py-4 md:mx-auto">
            <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
              <div className="shrink-0 mr-auto sm:py-3">
                <p className="font-medium">Add New Coupon Code</p>
                <p className="text-sm text-gray-600">
                  Add details for your new coupon code
                </p>
              </div>
              <button
                className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoupon}
                className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white sm:inline focus:outline-none focus:ring hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex items-center flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium">Coupon Code</p>
              <input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 sm:mr-4 sm:mb-0 focus:ring-1"
              />
            </div>
            <div className="flex items-center flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium">Value</p>
              <input
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setvalue(e.target.value)}
                className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex justify-end py-4 sm:hidden">
              <button
                className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoupon}
                className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {isCouponOpen && <ViewCouponsModal coupons={coupons} onClose={setIsCouponOpen} onDelete={handleDeleteCoupon} />}
    </div>
  );
};

export default AddCouponCode;
