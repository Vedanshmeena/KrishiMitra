import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { fireDB, fireStorage } from "../../../Firebase/FirebaseConfig";
import { toast } from "react-toastify";
import myContext from "../../../context/data/myContext";
import AddNewLand from "./AddNewLand";

const SellRent = () => {
  const [lands, setLands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'sale', 'rent'

  const context = useContext(myContext);
  const { user } = context;

  // Dummy land listings if none are found
  const dummyLands = [
    {
      id: "land1",
      district: "Indore",
      state: "Madhya Pradesh",
      area: 4.5,
      price: 1250000,
      status: "sale",
      description:
        "Prime agricultural land with black soil, perfect for cotton and soybean cultivation. Good road access and water availability.",
      features: ["Black soil", "Road access", "Water availability"],
      imageUrl:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    },
    {
      id: "land2",
      district: "Bhopal",
      state: "Madhya Pradesh",
      area: 3.2,
      price: 15000,
      status: "rent",
      description:
        "Fertile farmland available for seasonal leasing. Suitable for vegetable farming with easy access to local markets.",
      features: ["Irrigation facilities", "Fertile soil", "Market access"],
      imageUrl:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    },
    {
      id: "land3",
      district: "Ujjain",
      state: "Madhya Pradesh",
      area: 6.8,
      price: 2100000,
      status: "sale",
      description:
        "Large agricultural plot with existing infrastructure including storage facility and farm equipment shed. Suitable for commercial farming.",
      features: [
        "Storage facility",
        "Equipment shed",
        "Electricity connection",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    },
  ];

  const fetchLands = async () => {
    try {
      const landsQuery = query(
        collection(fireDB, "lands"),
        where("ownerId", "==", user?.uid)
      );

      const querySnapshot = await getDocs(landsQuery);
      const fetchedLands = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (fetchedLands.length > 0) {
        setLands(fetchedLands);
      } else {
        console.log("No lands found for this user, using dummy data");
        setLands(dummyLands);
      }
    } catch (error) {
      console.error("Error fetching lands:", error);
      toast.error("Failed to fetch lands");
      setLands(dummyLands); // Use dummy data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchLands();
    }
  }, [user]);

  const handleDelete = async (landId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this land listing?")) {
      return;
    }

    setLoading(true);
    try {
      // First try to delete the document from Firestore
      await deleteDoc(doc(fireDB, "lands", landId));

      // Then try to delete the image if it exists
      if (imageUrl) {
        try {
          const imageRef = ref(fireStorage, imageUrl);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error("Error deleting image:", storageError);
          // Don't throw here - we still deleted the document successfully
          toast.warning(
            "Land listing deleted, but failed to delete the image. Please contact support if this persists."
          );
        }
      }

      // Update local state
      setLands(lands.filter((land) => land.id !== landId));
      toast.success("Land listing deleted successfully");
    } catch (error) {
      console.error("Error deleting land:", error);
      if (error.code === "storage/unauthorized") {
        toast.error(
          "Permission denied. Please make sure you're logged in and own this listing."
        );
      } else {
        toast.error("Failed to delete land listing: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (land) => {
    setEditingLand(land);
    setIsAddModalOpen(true);
  };

  const handleStatusChange = async (landId, newStatus) => {
    try {
      await updateDoc(doc(fireDB, "lands", landId), {
        status: newStatus,
      });

      // Update local state
      setLands(
        lands.map((land) =>
          land.id === landId ? { ...land, status: newStatus } : land
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredLands = lands.filter((land) => {
    if (filterStatus === "all") return true;
    return land.status === filterStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Land Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your land listings for sale or rent
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg ${
                    viewMode === "table"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Listings</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              <button
                onClick={() => {
                  setEditingLand(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Land
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredLands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={land.imageUrl}
                        alt={`Land in ${land.district}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            land.status === "sale"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          For {land.status === "sale" ? "Sale" : "Rent"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {land.district}, {land.state}
                      </h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">
                          Area: {land.area} hectares
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{land.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(land)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(land.id, land.imageUrl)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLands.map((land) => (
                      <tr key={land.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={land.imageUrl}
                              alt={`Land in ${land.district}`}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {land.district}
                              </p>
                              <p className="text-sm text-gray-500">
                                {land.state}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {land.area} hectares
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{land.price.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={land.status}
                            onChange={(e) =>
                              handleStatusChange(land.id, e.target.value)
                            }
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleEdit(land)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(land.id, land.imageUrl)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredLands.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No land listings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new land listing.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setEditingLand(null);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Land
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isAddModalOpen && (
        <AddNewLand
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingLand(null);
            fetchLands();
          }}
          editData={editingLand}
        />
      )}
    </div>
  );
};

export default SellRent;
