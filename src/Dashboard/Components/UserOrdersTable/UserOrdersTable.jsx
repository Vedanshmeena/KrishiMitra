import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { fireDB } from '../../../Firebase/FirebaseConfig';

const OrderStatusTimeline = ({ status }) => {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
          }`}>
            <svg
              className={`w-4 h-4 ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {index < currentStep ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
              )}
            </svg>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-1 w-full ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

const UserOrdersTable = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get order amount from multiple possible fields
  const getOrderAmount = (order) => {
    // Check different possible fields for the amount
    const amount = order.totalAmount || order.amount || 
      (order.cartProducts || []).reduce((sum, product) => sum + (product.price || 0), 0);
    
    return amount || 0; // Return 0 if no amount found
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders for email:", userEmail);
      
      const ordersQuery = query(
        collection(fireDB, "order"),
        where("email", "==", userEmail)
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          orderId: doc.id,
          // Calculate total if not present
          totalAmount: getOrderAmount({ ...data, orderId: doc.id })
        };
      });

      // Sort orders manually by createdAt timestamp
      const sortedOrders = fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      console.log("Fetched and sorted orders:", sortedOrders);
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  // Add a message about index building
  const [showIndexMessage, setShowIndexMessage] = useState(true);

  useEffect(() => {
    if (showIndexMessage) {
      const timer = setTimeout(() => {
        setShowIndexMessage(false);
      }, 10000); // Hide after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [showIndexMessage]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
          {showIndexMessage && (
            <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-sm rounded">
              System optimization in progress. Order list performance will improve shortly.
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {order.orderId.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.date}
                        </span>
                      </div>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {order.cartProducts.map((product, index) => (
                          <div key={index} className="flex items-center mb-2 last:mb-0">
                            <img
                              src={product.imageUrl}
                              alt={product.productName}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                              <p className="text-xs text-gray-500">Qty: 1</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{getOrderAmount(order).toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                          })}
                        </span>
                        {order.cartProducts?.length > 1 && (
                          <span className="text-xs text-gray-500">
                            {order.cartProducts.length} items
                          </span>
                        )}
                      </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                  </td>
                    <td className="px-6 py-4">
                      <OrderStatusTimeline status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrdersTable;
