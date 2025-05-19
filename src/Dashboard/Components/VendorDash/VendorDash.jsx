import React, { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import myContext from "../../../context/data/myContext";
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const LocationCard = ({ land }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
  >
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-900">
          {land.district}, {land.state}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{land.area} hectares</p>
      </div>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          land.status === "sale"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        For {land.status === "sale" ? "Sale" : "Rent"}
      </span>
    </div>
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-900">
        ₹{land.price.toLocaleString("en-IN")}
      </p>
    </div>
  </motion.div>
);

const SimpleMap = ({ lands = [] }) => {
  if (lands.length === 0) {
    return (
      <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No Properties Listed
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first property to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm bg-white p-4 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lands.map((land, index) => (
          <LocationCard key={index} land={land} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  trend,
  description,
  color = "blue",
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4 transition-all duration-300"
  >
    <div
      className={`rounded-lg p-3 bg-${color}-100 transition-colors duration-300`}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-1 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-2 text-sm font-medium text-${
              trend > 0 ? "green" : "red"
            }-600`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-gray-600 text-sm">{description}</p>
      )}
    </div>
  </motion.div>
);

const RevenueChart = ({ orders = [] }) => {
  const monthlyRevenue = new Array(12).fill(0);

  orders.forEach((order) => {
    const month = new Date(order.createdAt?.seconds * 1000).getMonth();
    monthlyRevenue[month] += order.amount || 0;
  });

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue Trend",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

const ProductDistribution = ({ products = [] }) => {
  const productTypes = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(productTypes),
    datasets: [
      {
        data: Object.values(productTypes),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[200px] flex items-center justify-center">
      <Doughnut data={data} />
    </div>
  );
};

const VendorDash = () => {
  const context = useContext(myContext);
  const { user } = context;
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sample dummy data for empty states
  const dummyOrders = [
    {
      orderId: "ORD8273612",
      amount: 12500,
      status: "delivered",
      createdAt: { seconds: Date.now() / 1000 - 86400 },
      customerName: "Rajesh Kumar",
      products: [
        { productName: "Organic Fertilizer" },
        { productName: "Premium Seeds" },
      ],
    },
    {
      orderId: "ORD7391245",
      amount: 8700,
      status: "processing",
      createdAt: { seconds: Date.now() / 1000 - 172800 },
      customerName: "Anjali Sharma",
      products: [{ productName: "Drip Irrigation Kit" }],
    },
    {
      orderId: "ORD6104892",
      amount: 5300,
      status: "pending",
      createdAt: { seconds: Date.now() / 1000 - 259200 },
      customerName: "Vikram Singh",
      products: [{ productName: "Soil Testing Kit" }],
    },
  ];

  const dummyProducts = [
    {
      id: "PRD001",
      productName: "Organic Fertilizer",
      price: 1200,
      category: "Fertilizers",
    },
    {
      id: "PRD002",
      productName: "Premium Seeds",
      price: 450,
      category: "Seeds",
    },
    {
      id: "PRD003",
      productName: "Drip Irrigation Kit",
      price: 8700,
      category: "Irrigation",
    },
    {
      id: "PRD004",
      productName: "Soil Testing Kit",
      price: 5300,
      category: "Tools",
    },
    {
      id: "PRD005",
      productName: "Pesticide Spray",
      price: 890,
      category: "Pesticides",
    },
  ];

  const dummyLands = [
    {
      id: "LND001",
      district: "Indore",
      state: "Madhya Pradesh",
      area: 4.5,
      price: 1250000,
      status: "sale",
    },
    {
      id: "LND002",
      district: "Bhopal",
      state: "Madhya Pradesh",
      area: 3.2,
      price: 15000,
      status: "rent",
    },
  ];

  useEffect(() => {
    const calculateStats = async () => {
      setLoading(true);
      try {
        // Use real orders if available, otherwise use dummy orders
        const ordersData =
          user?.orders && user.orders.length > 0 ? user.orders : dummyOrders;

        const total = ordersData.reduce(
          (sum, order) => sum + (order.amount || 0),
          0
        );
        setTotalRevenue(total);

        const currentMonth = new Date().getMonth();
        const currentMonthOrders = ordersData.filter(
          (order) =>
            new Date(order.createdAt?.seconds * 1000).getMonth() ===
            currentMonth
        );
        const lastMonthOrders = ordersData.filter(
          (order) =>
            new Date(order.createdAt?.seconds * 1000).getMonth() ===
            currentMonth - 1
        );

        const currentMonthRevenue = currentMonthOrders.reduce(
          (sum, order) => sum + (order.amount || 0),
          0
        );
        const lastMonthRevenue = lastMonthOrders.reduce(
          (sum, order) => sum + (order.amount || 0),
          0
        );

        // Set a default growth rate if there's no real data
        const growth = lastMonthRevenue
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 12.5;
        setRevenueGrowth(growth);
      } catch (error) {
        console.error("Error calculating stats:", error);
        // Set fallback values
        setTotalRevenue(42500);
        setRevenueGrowth(12.5);
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get effective data (real or dummy)
  const effectiveOrders =
    user?.orders && user.orders.length > 0 ? user.orders : dummyOrders;
  const effectiveProducts =
    user?.products && user.products.length > 0 ? user.products : dummyProducts;
  const effectiveLands =
    user?.lands && user.lands.length > 0 ? user.lands : dummyLands;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          trend={revenueGrowth}
          description="Total earnings from all sales"
          icon={
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="blue"
        />

        <StatCard
          title="Total Orders"
          value={effectiveOrders.length}
          trend={8.3}
          description="Number of orders received"
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
          color="green"
        />

        <StatCard
          title="Products Listed"
          value={effectiveProducts.length}
          description="Active product listings"
          icon={
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
          color="yellow"
        />

        <StatCard
          title="Land Listings"
          value={effectiveLands.length}
          description="Properties for sale/rent"
          icon={
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          }
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Overview
          </h3>
          <RevenueChart orders={effectiveOrders} />
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Distribution
          </h3>
          <ProductDistribution products={effectiveProducts} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Property Locations
            </h3>
            <SimpleMap lands={effectiveLands} />
          </motion.div>
        </div>
        <div className="lg:col-span-1">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {effectiveOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New order received
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{order.amount?.toLocaleString("en-IN")} •{" "}
                      {new Date(
                        order.createdAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorDash;
