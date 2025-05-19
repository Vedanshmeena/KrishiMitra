import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React from "react";
import { fireDB } from "../../Firebase/FirebaseConfig";
import { toast } from "react-toastify";

const ProductOverview = ({ product,onClose }) => {

    const user = JSON.parse(localStorage.getItem("user"));

    const handleAddToCart = async () => {
        try {
          const userRef = doc(fireDB, "users", user.uid);
          await updateDoc(userRef, {
            cart: arrayUnion(product.id),
          });
          const clicksCollection = collection(fireDB, "AddtoCartclicks");
          await addDoc(clicksCollection, { timestamp: serverTimestamp() });
          toast.success("Product Added To Cart")
          onClose();
        } catch (error) {
          console.error("Error adding product to cart: ", error);
        }
      };


    
  return (
    <div className="fixed inset-0 flex items-center bg-gray-200 bg-opacity-65 justify-center z-50">
      <section className="py-12 sm:py-6 w-[70%] shadow-md bg-white rounded-xl h-[90%]">
        <div className="container mx-auto px-4">
          <nav className="flex ml-[1rem]">
            <div className="w-full items-center justify-between">
              <ol role="list" className="flex items-center">
                <li className="text-left">
                  <div className="m-1">
                    <a
                      href="#"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    >
                      {" "}
                      Home{" "}
                    </a>
                  </div>
                </li>

                <li className="text-left">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <div className="-m-1">
                      <a
                        href="#"
                        className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                      >
                        {" "}
                        Products{" "}
                      </a>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            <button onClick={onClose} className="cursor-pointer">
              <MinusCircleIcon className="w-8 h-8" />
            </button>
          </nav>

          <div className="mt-8 gap-[3rem] flex">
            
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      className="h-[25rem] w-[30rem] object-cover"
                      src={product.imageUrl}
                      alt="main"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[45rem]">
              <h1 className="sm:text-xl font-bold text-gray-900 ">
                {product.productName}
              </h1>

              <div className="mt-5 text-sm flex items-center">
                <p>
                  {product.description}
                </p>
              </div>

              <h2 class="mt-4 font-bold text-base text-gray-900">Highlights</h2>
              <div class="mt-3 flex select-none flex-wrap items-center gap-1">
                <p className="flex flex-col ml-[1rem]">
                  <span> • Made with full cotton</span>
                  <span> • Slim fit for any body</span>
                  <span> • Quality control by JC</span>
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between space-y-4 border-t border-b py-2 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-2xl font-bold">₹{product.price}</h1>
                </div>

                <button
                onClick={handleAddToCart}
                  type="button"
                  className="flex justify-center rounded-md border-2 border-transparent bg-[#FF5139] bg-none px-12 py-2 font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-white hover:text-black hover:border-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0 mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to cart
                </button>
              </div>

              <ul className="mt-4  flex items-center justify-between">
                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  <svg
                    className="mr-2 block h-5 w-5 align-middle text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className=""
                    ></path>
                  </svg>
                  PAN INDIA DELIVERY
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductOverview;
