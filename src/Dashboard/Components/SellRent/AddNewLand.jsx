import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { fireDB, fireStorage } from '../../../Firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';

const AddNewLand = ({ onClose, editData }) => {
  const [formData, setFormData] = useState({
    district: "",
    state: "",
    area: "",
    price: "",
    status: "sale", // 'sale' or 'rent'
    description: "",
    features: []
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get both the stored user data and current auth state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const auth = getAuth();
  
  useEffect(() => {
    // If editing, populate form with existing data
    if (editData) {
      setFormData({
        district: editData.district || "",
        state: editData.state || "",
        area: editData.area || "",
        price: editData.price || "",
        status: editData.status || "sale",
        description: editData.description || "",
        features: editData.features || []
      });
      if (editData.imageUrl) {
        setPreviewUrl(editData.imageUrl);
      }
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Clear error when new image is selected
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.area || formData.area <= 0) newErrors.area = "Valid area is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!image && !editData?.imageUrl) newErrors.image = "Land image is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadError = (error) => {
    console.error("Error uploading image: ", error);
    setIsLoading(false);
    
    if (error.code === 'storage/unauthorized') {
      console.log("Auth state during error:", {
        currentUser: auth.currentUser,
        storedUser: storedUser,
        token: auth.currentUser?.getIdToken ? "Available" : "Not available"
      });
      
      toast.error(
        "Permission denied. Please try logging out and logging back in."
      );
    } else if (error.code === 'storage/canceled') {
      toast.error("Upload was cancelled. Please try again.");
    } else if (error.code === 'storage/retry-limit-exceeded') {
      toast.error("Poor network connection. Please check your internet and try again.");
    } else {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check both auth states
    if (!auth.currentUser || !storedUser?.uid) {
      console.log("Auth check failed:", {
        currentUser: auth.currentUser,
        storedUser: storedUser
      });
      toast.error("Please log in again to add land listings");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = editData?.imageUrl;

      // Only upload new image if one is selected
      if (image) {
        // Ensure we have a fresh token
        const token = await auth.currentUser.getIdToken(true);
        console.log("Got fresh token:", token ? "Yes" : "No");

        // Create a unique filename using timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const filename = `${timestamp}-${randomString}`;
        
        // Upload image to Firebase Storage
        const imageRef = ref(fireStorage, `lands/${auth.currentUser.uid}/${filename}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            reject,
            async () => {
              try {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      const landData = {
        district: formData.district,
        state: formData.state,
        area: parseFloat(formData.area),
        price: parseFloat(formData.price),
        status: formData.status,
        description: formData.description,
        features: formData.features,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
        imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editData) {
        // Update existing document
        const landRef = doc(fireDB, "lands", editData.id);
        await updateDoc(landRef, landData);
        toast.success("Land listing updated successfully!");
      } else {
        // Create new document
        landData.createdAt = new Date().toISOString();
        const landRef = collection(fireDB, "lands");
        await addDoc(landRef, landData);
        toast.success("Land listing added successfully!");
      }

      onClose();
    } catch (error) {
      console.error("Error saving land data: ", error);
      toast.error(
        error.code === 'permission-denied' 
          ? "You don't have permission to manage land listings. Please contact support."
          : "Failed to save land information. Please try again."
      );
    }
    setIsLoading(false);
  };

  const availableFeatures = [
    "Irrigation System",
    "Water Source",
    "Electricity",
    "Storage Facility",
    "Road Access",
    "Fencing",
    "Soil Testing",
    "Farm Equipment"
  ];

  return (
    <div className="fixed inset-0 text-black flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 overflow-y-auto py-4">
      <div className="relative max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4 w-64">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                    <div 
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
                    ></div>
                  </div>
                  <div className="text-center text-sm text-blue-600 mt-1">
                    Uploading... {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editData ? 'Edit Land Listing' : 'Add New Land'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Enter your agriculture land details</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.district ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter district name"
                  />
                  {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter state name"
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.area ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter area in hectares"
                  />
                  {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/hectare)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter price per hectare"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'status', value: 'sale' } })}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.status === 'sale'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'status', value: 'rent' } })}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.status === 'rent'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    For Rent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Describe your land (soil type, water availability, etc.)"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Land Image</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition-colors`}>
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="relative w-full h-48 mb-4">
                        <img
                          src={previewUrl}
                          alt="Land preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImage(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Land' : 'Add Land')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLand;
