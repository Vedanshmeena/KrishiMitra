import React, { useState, useEffect, useContext } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { fireDB } from "../../../Firebase/FirebaseConfig";
import { toast } from "react-toastify";
import myContext from "../../../context/data/myContext";

const OrderManagement = () => {
  const context = useContext(myContext);
  const { user } = context;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy orders for when real orders don't exist
  const dummyOrders = [
    {
      orderId: "order123456",
      user: {
        fullName: "Rajesh Kumar",
        city: "Indore",
        state: "MP",
      },
      products: [{ productName: "Premium Rice Seeds (10kg package)" }],
      amount: 4500,
      status: "pending",
      createdAt: { seconds: Date.now() / 1000 },
    },
    {
      orderId: "order789012",
      user: {
        fullName: "Ananya Singh",
        city: "Bhopal",
        state: "MP",
      },
      products: [{ productName: "Advanced Soil Testing Kit" }],
      amount: 2200,
      status: "processing",
      createdAt: { seconds: Date.now() / 1000 - 86400 }, // Yesterday
    },
    {
      orderId: "order345678",
      user: {
        fullName: "Prakash Sharma",
        city: "Gwalior",
        state: "MP",
      },
      products: [
        { productName: "Drip Irrigation System - Small Farm" },
        { productName: "Water Pump 1HP" },
      ],
      amount: 12500,
      status: "shipped",
      createdAt: { seconds: Date.now() / 1000 - 172800 }, // 2 days ago
    },
  ];

  console.log("Current user context:", user);

  // Use orders from user context
  useEffect(() => {
    console.log("useEffect triggered with user orders:", user?.orders);
    if (user?.orders && user.orders.length > 0) {
      // Sort orders by creation time if available, otherwise keep original order
      const sortedOrders = [...user.orders].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
      console.log("Sorted orders:", sortedOrders);
      setOrders(sortedOrders);
    } else {
      // Use dummy orders if no real orders exist
      console.log("No real orders found, using dummy data");
      setOrders(dummyOrders);
    }
    setLoading(false);
  }, [user]);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      // 1. Update in orders collection
      const orderRef = doc(fireDB, "order", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();

      await updateDoc(orderRef, {
        status: newStatus,
        statusHistory: arrayUnion({
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Order ${newStatus} by vendor`,
        }),
      });

      // 2. Update in farmer's document
      if (orderData.email) {
        const farmerRef = doc(fireDB, "users", orderData.email);
        const farmerDoc = await getDoc(farmerRef);

        if (farmerDoc.exists()) {
          const farmerData = farmerDoc.data();
          const updatedFarmerOrders = farmerData.orders.map((order) => {
            if (order.orderId === orderId) {
              return {
                ...order,
                status: newStatus,
              };
            }
            return order;
          });

          await updateDoc(farmerRef, {
            orders: updatedFarmerOrders,
          });
        }
      }

      // 3. Update in vendor's document
      if (user?.uid) {
        const vendorRef = doc(fireDB, "users", user.uid);
        const vendorDoc = await getDoc(vendorRef);

        if (vendorDoc.exists()) {
          const vendorData = vendorDoc.data();
          const updatedVendorOrders = vendorData.orders.map((order) => {
            if (order.orderId === orderId) {
              return {
                ...order,
                status: newStatus,
              };
            }
            return order;
          });

          await updateDoc(vendorRef, {
            orders: updatedVendorOrders,
          });

          // Update local state
          setOrders(updatedVendorOrders);
        }
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {console.log("Rendering with orders:", orders)}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and track your customer orders
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderId.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.city}, {order.user?.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.products.map((product, index) => (
                        <div key={index} className="mb-1">
                          {product.productName.slice(0, 30)}...
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[order.status || "pending"]
                      }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={order.status || "pending"}
                      onChange={(e) =>
                        updateOrderStatus(order.orderId, e.target.value)
                      }
                      disabled={loading}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't received any orders yet.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
