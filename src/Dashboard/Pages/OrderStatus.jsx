import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("OrderStatus: Location state received:", location.state);
  
  const { success, orderId, error } = location.state || { 
    success: false, 
    error: "No order information found" 
  };

  console.log("OrderStatus: Parsed values:", { success, orderId, error });

  // If no state is present, show an error
  if (!location.state) {
    console.log("OrderStatus: No state found in location");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
              <XCircleIcon className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Invalid Access</h1>
            <p className="mt-2 text-gray-600">
              This page can only be accessed after placing an order.
            </p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("OrderStatus: Rendering status page for orderId:", orderId);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        {success ? (
          <div className="text-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Successful!</h1>
            <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
            <p className="mt-1 text-sm text-gray-500">Order ID: {orderId}</p>
            
            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  console.log("OrderStatus: Navigating to dashboard");
                  navigate('/dashboard');
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Order Status
              </button>
              <button
                onClick={() => {
                  console.log("OrderStatus: Navigating to home");
                  navigate('/');
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <XCircleIcon className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Failed</h1>
            <p className="mt-2 text-gray-600">
              {error || "There was an error processing your order."}
            </p>
            
            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  console.log("OrderStatus: Navigating back to cart");
                  navigate('/cart');
                }}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Return to Cart
              </button>
              <button
                onClick={() => {
                  console.log("OrderStatus: Navigating to home");
                  navigate('/');
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus; 