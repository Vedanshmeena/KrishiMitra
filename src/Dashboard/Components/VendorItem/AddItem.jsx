import firebase from "firebase/compat/app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { fireDB, fireStorage } from "../../../Firebase/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from 'react-toastify';

export const AddNewItem = ({ onClose, product }) => {
  const [productName, setProductName] = useState(product ? product.productName : "");
  const [description, setDescription] = useState(product ? product.description : "");
  const [price, setPrice] = useState(product ? product.price.toString() : "");
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(product ? product.imageUrl : null);

  useEffect(() => {
    if (product) {
      setProductName(product.productName);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImagePreview(product.imageUrl);
    }
  }, [product]);

  const user = JSON.parse(localStorage.getItem("user"));

  const validateForm = () => {
    if (!productName.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!product && !image) {
      toast.error("Please select an image");
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    try {
      setError(null);
      if (!validateForm()) return;

      setIsLoading(true);
      
      let imageUrl = product ? product.imageUrl : null;

      if (image) {
        try {
          const imageRef = ref(fireStorage, `products/${user.uid}/${Date.now()}`);
          const uploadTask = uploadBytesResumable(imageRef, image);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => {
                console.error("Error uploading image: ", error);
                toast.error("Failed to upload image. Please try again.");
                reject(error);
              },
              async () => {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              }
            );
          });
        } catch (error) {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image. Please check your permissions and try again.");
          setIsLoading(false);
          return;
        }
      }

      const productData = {
        productName: productName.trim(),
        description: description.trim(),
        price: parseFloat(price),
        vendorId: user.uid,
        imageUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (product) {
        const productRef = doc(fireDB, "products", product.id);
        await updateDoc(productRef, productData);
        toast.success("Product updated successfully!");
      } else {
        const productRef = collection(fireDB, "products");
        const docRef = await addDoc(productRef, {
          ...productData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        const vendorRef = doc(fireDB, "users", user.uid);
        await updateDoc(vendorRef, {
          products: arrayUnion(docRef.id),
        });
        toast.success("Product added successfully!");
      }

      onClose();
    } catch (error) {
      console.error("Error handling product: ", error);
      setError("Failed to save product. Please try again.");
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4">
      <div className="relative w-full max-w-screen-md max-h-[90vh] overflow-y-auto border shadow-xl sm:rounded-xl bg-white">
        <div className="sticky top-0 bg-white border-b z-10 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="shrink-0 mr-auto">
              <h2 className="text-2xl font-semibold text-gray-900">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {product ? "Update your product details" : "Add details for your new product"}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-3">
              <button
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {product ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  product ? "Update Product" : "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                      <button
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold inline-block text-blue-600">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddItem = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
        <button
          onClick={handleOpen}
          className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
        >
          Add New Item
        </button>

        <button
          className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
          title="View Orders"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg>
        </button>
      </span>
      {isOpen && <AddNewItem onClose={handleClose} />}
    </div>
  );
};

export default AddItem;
