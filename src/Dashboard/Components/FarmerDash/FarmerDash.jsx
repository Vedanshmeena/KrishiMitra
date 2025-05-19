import React, { useContext, useState, useEffect } from "react";
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
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import myContext from "../../../context/data/myContext";
import { format } from "date-fns";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const LocationCard = ({ land }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-900">
          {land.district}, {land.state}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{land.area} hectares</p>
        {land.cropType && (
          <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
            {land.cropType}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            land.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {land.status === "active" ? "Active" : "Inactive"}
        </span>
        {land.lastYield && (
          <p className="text-xs text-gray-500 mt-2">
            Last yield: {land.lastYield} quintals
          </p>
        )}
      </div>
    </div>
  </div>
);

const FarmMap = ({ lands }) => {
  if (!lands || lands.length === 0) {
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
            No Farmlands Added
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first farmland to see it here.
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

// Crop Distribution Chart
const CropDistribution = ({ lands }) => {
  // Extract crop data from lands
  const cropTypes = { Maize: 1, Wheat: 2, Rice: 1 };

  const data = {
    labels: Object.keys(cropTypes),
    datasets: [
      {
        label: "Crop Distribution",
        data: Object.values(cropTypes),
        backgroundColor: [
          "rgba(52, 211, 153, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(79, 70, 229, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(52, 211, 153, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(79, 70, 229, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
    },
    cutout: "65%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Doughnut data={data} options={options} />;
};

// Yield History Chart
const YieldHistory = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
  ];

  const data = {
    labels: months,
    datasets: [
      {
        fill: true,
        label: "Crop Yield (Quintals)",
        data: [65, 78, 52, 75, 90, 88, 95, 91, 85],
        borderColor: "rgba(52, 211, 153, 1)",
        backgroundColor: "rgba(52, 211, 153, 0.1)",
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
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
  };

  return <Line data={data} options={options} />;
};

// Stat Card Component
const StatCard = ({ title, value, icon, trend, description, color }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          {trend && (
            <div
              className={`flex items-center text-xs mt-1 ${
                trend > 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              <span className="mr-1">
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>{icon}</div>
      </div>
      {description && (
        <p className="text-gray-500 text-xs mt-3">{description}</p>
      )}
    </div>
  );
};

// Weather Component
const Weather = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl p-5 text-black shadow-sm h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">Weather Today</p>
          <h3 className="text-xl font-medium mt-1">{format(date, "EEEE")}</h3>
          <p className="text-xs opacity-80">{format(date, "dd MMMM, yyyy")}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold">32°C</p>
          <p className="text-xs mt-1 opacity-80">Partly Cloudy</p>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4814/4814268.png"
          alt="Weather"
          className="h-16 w-16"
        />
        <div className="ml-4 text-sm">
          <div className="flex justify-between mb-1">
            <span>Humidity</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Wind</span>
            <span className="font-medium">12 km/h</span>
          </div>
          <div className="flex justify-between">
            <span>Precipitation</span>
            <span className="font-medium">10%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Current Crop Component
const CurrentCrop = ({ user }) => {
  // Get the primary crop (most frequently planted)
  const cropImages = {
    Maize: "https://cdn-icons-png.flaticon.com/512/7622/7622253.png",
    Wheat: "https://cdn-icons-png.flaticon.com/512/3183/3183457.png",
    Rice: "https://cdn-icons-png.flaticon.com/512/5312/5312086.png",
    Cotton: "https://cdn-icons-png.flaticon.com/512/2271/2271208.png",
  };

  const cropInfo = {
    Maize: "Best harvesting time in 45 days",
    Wheat: "Current growth stage: Flowering",
    Rice: "Water level optimal",
    Cotton: "Ready for harvesting",
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">Primary Crop</p>
          <h3 className="text-xl font-semibold mt-1">Maize</h3>
          <p className="text-xs text-gray-500 mt-3">{cropInfo["Maize"]}</p>
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-100 rounded-full">
              <div className="h-2 w-4/5 bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Growth progress: 80%</p>
          </div>
        </div>
        <div>
          <img
            src={cropImages["Maize"]}
            alt="Maize"
            className="h-24 w-24 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

// Orders Summary Component
const OrdersSummary = ({ orders = [] }) => {
  // Sample data in case no orders exist
  const sampleOrders = [
    {
      product: "Fertilizer A",
      date: "2023-05-15",
      amount: 1200,
      status: "Completed",
    },
    {
      product: "Seeds - Maize",
      date: "2023-06-22",
      amount: 3500,
      status: "Processing",
    },
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Recent Orders</h3>
        <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
          {orders?.length || sampleOrders.length} Total
        </span>
      </div>

      <div className="space-y-3 max-h-[12rem] overflow-y-auto">
        {displayOrders.slice(0, 4).map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
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
              <div>
                <p className="text-sm font-medium">{order.product}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">₹{order.amount}</p>
              <p
                className={`text-xs ${
                  order.status === "Completed"
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-center py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
        View all orders
      </button>
    </div>
  );
};

// Main Dashboard Component
const FarmerDash = () => {
  const context = useContext(myContext);
  const { user } = context;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmer Dashboard</h1>
          <p className="text-sm text-gray-500">
            {format(date, "EEEE, MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
            <span className="text-sm text-gray-700">
              Welcome back, {user?.name || "Farmer"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
            {user?.name ? user.name.charAt(0).toUpperCase() : "F"}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Lands"
          value={user?.lands?.length || "0"}
          description="Total land parcels registered"
          trend={5}
          color="bg-emerald-100 text-emerald-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          }
        />
        <StatCard
          title="Total Area"
          value={`${
            user?.lands?.reduce((sum, land) => sum + (land.area || 0), 0) || "0"
          } Acres`}
          description="Combined area of all lands"
          trend={2}
          color="bg-blue-100 text-blue-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Orders"
          value={user?.orders?.length || "0"}
          description="Orders placed for crops"
          trend={8}
          color="bg-amber-100 text-amber-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          }
        />
        <StatCard
          title="Expected Revenue"
          value={`₹${Math.round(
            user?.orders?.reduce(
              (sum, order) => sum + (order.amount || 0),
              0
            ) || 0
          )}`}
          description="Estimated from current orders"
          trend={10}
          color="bg-purple-100 text-purple-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Your Farmlands</h2>
              <button className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">
                View Details
              </button>
            </div>
            <FarmMap lands={user?.lands} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-72">
              <h2 className="font-semibold text-gray-800 mb-2">
                Crop Distribution
              </h2>
              <div className="h-[calc(100%-2rem)]">
                <CropDistribution lands={user?.lands} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-72">
              <h2 className="font-semibold text-gray-800 mb-2">
                Yield History
              </h2>
              <div className="h-[calc(100%-2rem)]">
                <YieldHistory />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Side Panel */}
        <div className="space-y-6">
          <Weather />
          {/* <CurrentCrop user={user} /> */}
          {/* <OrdersSummary orders={user?.orders} /> */}
        </div>
      </div>
    </div>
  );
};

export default FarmerDash;
