import React, { useEffect, useState } from "react";
import AddItem from "./AddItem";
import { fireDB } from "../../../Firebase/FirebaseConfig";
import { doc, getDoc, deleteDoc, collection } from "firebase/firestore";
import VendorProductCard from "./VendorProductCard";
import AddCouponCode from "./AddCouponCode";

const VendorItem = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy products if none are found
  const dummyProducts = [
    {
      id: "prod1",
      productName: "Organic Fertilizer - Premium Mix",
      description:
        "Nutrient-rich organic fertilizer, perfect for all types of crops. Enhances soil fertility and promotes healthy plant growth.",
      price: 1200,
      category: "Fertilizers",
      imageUrl:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "prod2",
      productName: "High-Yield Wheat Seeds (5kg)",
      description:
        "Disease-resistant wheat variety with exceptional yield potential. Suitable for various soil types.",
      price: 850,
      category: "Seeds",
      imageUrl:
        "https://images.unsplash.com/photo-1635188557601-91802a1693a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VlZHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "prod3",
      productName: "Drip Irrigation System - Small Farm Kit",
      description:
        "Complete drip irrigation system for up to 1 acre. Water-efficient and easy to install.",
      price: 7500,
      category: "Irrigation",
      imageUrl:
        "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXJyaWdhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "prod4",
      productName: "Advanced Soil Testing Kit",
      description:
        "Professional-grade soil testing kit. Tests for pH, nitrogen, phosphorus, and potassium levels.",
      price: 3200,
      category: "Tools",
      imageUrl:
        "https://images.unsplash.com/photo-1611001724840-883060063e05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29pbCUyMHRlc3Rpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
  ];

  useEffect(() => {
    if (user?.uid) {
      fetchVendorProducts();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const vendorRef = doc(fireDB, "users", user.uid);
      const vendorSnapshot = await getDoc(vendorRef);

      if (vendorSnapshot.exists()) {
        const vendorData = vendorSnapshot.data();
        const productIds = vendorData.products || [];

        if (productIds.length > 0) {
          const products = await Promise.all(
            productIds.map(async (productId) => {
              const productRef = doc(fireDB, "products", productId);
              const productSnapshot = await getDoc(productRef);
              return productSnapshot.exists()
                ? { ...productSnapshot.data(), id: productId }
                : null;
            })
          );
          setProducts(products.filter(Boolean)); // Remove any null values
        } else {
          console.log("No products found for this vendor, using dummy data");
          setProducts(dummyProducts);
        }
      } else {
        console.log("Vendor document not found, using dummy data");
        setProducts(dummyProducts);
      }
    } catch (error) {
      console.error("Error getting vendor products: ", error);
      setError("Failed to load products");
      setProducts(dummyProducts); // Fallback to dummy data on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(fireDB, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Product Management
          </h1>
          <div className="flex gap-4">
            <AddItem onSuccess={fetchVendorProducts} />
            <AddCouponCode />
          </div>
        </div>

        {/* Search and View Toggle Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
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
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
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
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div
            className={`
            ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          `}
          >
            {filteredProducts.map((product) => (
              <VendorProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onDelete={handleDeleteProduct}
                onUpdate={fetchVendorProducts}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start by adding some products"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorItem;
