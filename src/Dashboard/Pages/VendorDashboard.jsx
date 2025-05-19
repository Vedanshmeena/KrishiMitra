import React, { useContext, useState, useEffect } from "react";
import bannerimg from "../../assets/bannerimg.jpeg";
import logo from "../../assets/logo.png";
import SellRent from "../Components/SellRent/SellRent";
import {
  PowerIcon,
  ShoppingBagIcon,
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import CropRecommend from "../Components/CropRecommend/CropRecommend";
import VendorDash from "../Components/VendorDash/VendorDash";
import VendorItem from "../Components/VendorItem/VendorItem";
import UserOrdersTable from "../Components/UserOrdersTable/UserOrdersTable";
import myContext from "../../context/data/myContext";
import OrderManagement from "../Components/OrderManagement/OrderManagement";

const Sidebar = ({ activeComponent, setComponent }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      name: "orders",
      label: "Order Management",
      icon: <ShoppingBagIcon className="h-5 w-5" />,
    },
    {
      name: "vendorItem",
      label: "Products & Services",
      icon: <PlusCircleIcon className="h-5 w-5" />,
    },
    {
      name: "sellRent",
      label: "Sell/Rent Land",
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
    {
      name: "analytics",
      label: "Analytics",
      icon: <ArrowTrendingUpIcon className="h-5 w-5" />,
    },
    {
      name: "settings",
      label: "Settings",
      icon: <CogIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-screen">
      <div className="h-full w-72 pb-10 transition-all duration-300">
        <div className="flex h-full flex-grow flex-col overflow-y-auto rounded-xl bg-white pt-5 shadow-xl">
          <div className="flex justify-center items-center px-4 mb-6">
            <img
              src={logo}
              alt="KrishiMitra Logo"
              className="h-14 object-contain"
            />
          </div>

          <div className="px-4 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Menu
            </span>
          </div>

          <div className="flex-1 flex-col px-3">
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setComponent(item.name)}
                  className={`flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeComponent === item.name
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      activeComponent === item.name
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {activeComponent === item.name && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <PowerIcon className="mr-3 h-5 w-5 text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Metrics Dashboard for the Dashboard view
const MetricsDashboard = ({ user }) => {
  // Get real product count or use dummy data
  const productCount = user?.products?.length || 8;

  // Get real order count or use dummy data
  const orderCount = user?.orders?.length || 12;

  // Calculate metrics with fallback to dummy data
  const metrics = {
    // Mix real revenue with dummy data
    revenue:
      user?.orders?.reduce((sum, order) => sum + (order.amount || 0), 0) ||
      42500,

    // Real orders count or dummy data
    orders: orderCount,

    // Calculate pending orders or use dummy data
    pendingOrders:
      user?.orders?.filter((order) => order.status === "pending")?.length || 3,

    // Product count (real or dummy)
    products: productCount,

    // Growth percentages (dummy)
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Revenue Card */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h4 className="mt-2 text-2xl font-semibold text-gray-800">
              ₹{metrics.revenue.toLocaleString()}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className={`mr-1 text-green-600`}>
                ↑ {metrics.revenueGrowth}%
              </span>
              vs last month
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h4 className="mt-2 text-2xl font-semibold text-gray-800">
              {metrics.orders}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className={`mr-1 text-green-600`}>
                ↑ {metrics.ordersGrowth}%
              </span>
              vs last month
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShoppingBagIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Pending Orders Card */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <h4 className="mt-2 text-2xl font-semibold text-gray-800">
              {metrics.pendingOrders}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Needs immediate attention
            </p>
          </div>
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <BellIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Products Listed</p>
            <h4 className="mt-2 text-2xl font-semibold text-gray-800">
              {metrics.products}
            </h4>
            <p className="text-xs text-gray-500 mt-1">Active in marketplace</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <PlusCircleIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  // Dummy data for analytics with realistic values
  const analyticsData = {
    monthlySales: [
      12500, 9800, 15200, 18700, 22400, 19800, 23500, 28900, 25600, 31200,
      29800, 35400,
    ],
    productCategories: [
      { name: "Seeds", value: 35, color: "bg-blue-500", growth: 8 },
      { name: "Fertilizers", value: 25, color: "bg-green-500", growth: 12 },
      { name: "Tools", value: 20, color: "bg-yellow-500", growth: -3 },
      { name: "Machinery", value: 15, color: "bg-purple-500", growth: 15 },
      { name: "Other", value: 5, color: "bg-red-500", growth: 2 },
    ],
    customers: {
      retention: 78,
      newCustomers: 42,
      totalCustomers: 184,
      repeatPurchase: 65,
      topLocations: ["Indore", "Bhopal", "Ujjain", "Gwalior", "Jabalpur"],
    },
    orderMetrics: {
      totalOrders: 247,
      averageValue: 3850,
      completionRate: 92,
      cancellationRate: 3,
      returnsRate: 5,
    },
    growthMetrics: {
      revenue: 18.5,
      orders: 12.3,
      customers: 15.7,
      averageOrderValue: 5.2,
    },
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Revenue Growth
              </p>
              <h4 className="mt-2 text-2xl font-semibold text-gray-800">
                {analyticsData.growthMetrics.revenue}%
              </h4>
              <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Growth</p>
              <h4 className="mt-2 text-2xl font-semibold text-gray-800">
                {analyticsData.growthMetrics.orders}%
              </h4>
              <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Customer Growth
              </p>
              <h4 className="mt-2 text-2xl font-semibold text-gray-800">
                {analyticsData.growthMetrics.customers}%
              </h4>
              <p className="text-xs text-gray-500 mt-1">vs. last quarter</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg. Order Value
              </p>
              <h4 className="mt-2 text-2xl font-semibold text-gray-800">
                ₹{analyticsData.orderMetrics.averageValue}
              </h4>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="mr-1 text-green-600">
                  ↑ {analyticsData.growthMetrics.averageOrderValue}%
                </span>
                vs. last quarter
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Sales Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Monthly Sales Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {analyticsData.monthlySales.map((amount, index) => {
                const normalizedHeight =
                  (amount / Math.max(...analyticsData.monthlySales)) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    <div
                      className="w-full bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors group-hover:bg-green-600"
                      style={{ height: `${normalizedHeight}%` }}
                    ></div>
                    <span className="text-xs mt-1">
                      {
                        [
                          "J",
                          "F",
                          "M",
                          "A",
                          "M",
                          "J",
                          "J",
                          "A",
                          "S",
                          "O",
                          "N",
                          "D",
                        ][index]
                      }
                    </span>
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                      ₹{amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              Product Category Performance
            </h3>
            <div className="w-full max-w-xs mx-auto">
              {analyticsData.productCategories.map((item, index) => (
                <div key={index} className="mb-5">
                  <div className="flex justify-between mb-1 items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span
                        className={`ml-2 text-xs ${
                          item.growth >= 0 ? "text-green-600" : "text-red-600"
                        } font-medium`}
                      >
                        {item.growth >= 0
                          ? `↑ ${item.growth}%`
                          : `↓ ${Math.abs(item.growth)}%`}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Customer Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-6">Customer Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Total Customers</p>
                <h4 className="text-xl font-semibold">
                  {analyticsData.customers.totalCustomers}
                </h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">New Customers</p>
                <h4 className="text-xl font-semibold">
                  {analyticsData.customers.newCustomers}
                </h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Retention Rate</p>
                <h4 className="text-xl font-semibold">
                  {analyticsData.customers.retention}%
                </h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Repeat Purchase</p>
                <h4 className="text-xl font-semibold">
                  {analyticsData.customers.repeatPurchase}%
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-6">Top Customer Locations</h3>
            <div className="space-y-4">
              {analyticsData.customers.topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="ml-3 font-medium">{location}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.floor(30 - index * 5)}% of orders
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Performance */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Order Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-bold text-green-600">
                {analyticsData.orderMetrics.completionRate}%
              </h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${analyticsData.orderMetrics.completionRate}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-500">Cancellation Rate</p>
              <h3 className="text-2xl font-bold text-red-600">
                {analyticsData.orderMetrics.cancellationRate}%
              </h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${analyticsData.orderMetrics.cancellationRate}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-500">Return Rate</p>
              <h3 className="text-2xl font-bold text-amber-600">
                {analyticsData.orderMetrics.returnsRate}%
              </h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-amber-500 h-2.5 rounded-full"
                style={{
                  width: `${analyticsData.orderMetrics.returnsRate}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-medium text-blue-700 mb-2">
              Growth Opportunity
            </h3>
            <p className="text-sm text-blue-600">
              Consider expanding your fertilizer product line, as this category
              shows 12% growth month over month.
            </p>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-medium text-amber-700 mb-2">
              Attention Needed
            </h3>
            <p className="text-sm text-amber-600">
              Tools category is showing a 3% decline. Review pricing and
              marketing strategies for this category.
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-medium text-green-700 mb-2">
              Customer Retention
            </h3>
            <p className="text-sm text-green-600">
              Your customer retention rate of 78% is above industry average.
              Continue offering quality products and service.
            </p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-medium text-purple-700 mb-2">
              Market Expansion
            </h3>
            <p className="text-sm text-purple-600">
              Consider targeting customers in Jabalpur, which shows growing
              demand for agricultural products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Settings component
const Settings = () => {
  // Get stored user data or use dummy data
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [formData, setFormData] = useState({
    businessName: storedUser.businessName || "Green Agro Solutions",
    email: storedUser.email || "vendor@example.com",
    phone: storedUser.phone || "+91 98765 43210",
    location: storedUser.location || "Indore, Madhya Pradesh",
    notifications: {
      orders: true,
      marketing: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name.split(".")[1]]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="Your business name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="City, State"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="order-notifications"
                name="notifications.orders"
                type="checkbox"
                checked={formData.notifications.orders}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="order-notifications"
                className="ml-2 block text-sm text-gray-700"
              >
                Order notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="marketing-notifications"
                name="notifications.marketing"
                type="checkbox"
                checked={formData.notifications.marketing}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="marketing-notifications"
                className="ml-2 block text-sm text-gray-700"
              >
                Marketing emails
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorDashboard = () => {
  const location = useLocation();
  const [component, setComponent] = useState("dashboard");
  const context = useContext(myContext);
  const { user } = context;
  const navigate = useNavigate();

  // Check if user exists and is a vendor
  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user")) || {};
    if (!userObj.uid || userObj.userType !== "vendor") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="sticky top-0 z-10 h-screen">
          <Sidebar activeComponent={component} setComponent={setComponent} />
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="relative rounded-2xl h-48 overflow-hidden shadow-md">
              <img
                src={bannerimg}
                alt="Dashboard Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-800/80 via-green-700/60 to-transparent flex items-center">
                <div className="px-8">
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {user?.businessName || "Vendor"}
                  </h1>
                  <p className="text-green-100 mt-1 max-w-xl">
                    Manage your agricultural business in one place. Track
                    orders, manage products, and grow your business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add metrics dashboard to the main dashboard view */}
          {component === "dashboard" && (
            <>
              <MetricsDashboard user={user} />
              <VendorDash />
            </>
          )}
          {component === "sellRent" && <SellRent />}
          {component === "vendorItem" && <VendorItem />}
          {component === "orders" && (
            <OrderManagement userEmail={user?.email} />
          )}
          {component === "analytics" && <Analytics />}
          {component === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
