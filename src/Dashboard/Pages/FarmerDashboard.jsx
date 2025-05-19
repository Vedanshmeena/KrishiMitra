import React, { useContext, useState, useEffect } from "react";
import bannerimg from "../../assets/bannerimg.jpeg";
import logo from "../../assets/logo.png";
import FarmerDash from "../Components/FarmerDash/FarmerDash";
import SellRent from "../Components/SellRent/SellRent";
import {
  PowerIcon,
  ShoppingBagIcon,
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  BeakerIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import CropRecommend from "../Components/CropRecommend/CropRecommend";
import UserOrdersTable from "../Components/UserOrdersTable/UserOrdersTable";
import myContext from "../../context/data/myContext";

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
      label: "My Orders",
      icon: <ShoppingBagIcon className="h-5 w-5" />,
    },
    {
      name: "sellRent",
      label: "Sell/Rent Land",
      icon: <MapIcon className="h-5 w-5" />,
    },
    {
      name: "cropRecommend",
      label: "Crop Recommendation",
      icon: <BeakerIcon className="h-5 w-5" />,
    },
    {
      name: "calendar",
      label: "Crop Calendar",
      icon: <CalendarIcon className="h-5 w-5" />,
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
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      activeComponent === item.name
                        ? "text-emerald-700"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {activeComponent === item.name && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-600"></span>
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
  // Sample data for demonstration
  const metrics = {
    totalLands: user?.lands?.length || 0,
    totalArea:
      user?.lands?.reduce((sum, land) => sum + (land.area || 0), 0) || 0,
    totalOrders: user?.orders?.length || 0,
    expectedRevenue: Math.round(
      user?.orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
    ),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"></div>
  );
};

// Simple Calendar component for the crop calendar
const CropCalendar = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Crop Calendar</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Seasonal Planting Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-green-700 mb-2">
              Summer Season (March-June)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Rice, Maize, Cotton, Sugarcane</li>
              <li>Vegetables: Bottle gourd, Okra, Ridge gourd</li>
              <li>Fruits: Watermelon, Muskmelon</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-blue-700 mb-2">
              Monsoon Season (June-September)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Rice, Maize, Jowar, Bajra, Pulses</li>
              <li>Vegetables: Okra, Cucumber, Bitter gourd</li>
              <li>Oilseeds: Soybean, Groundnut</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-amber-700 mb-2">
              Winter Season (October-February)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Wheat, Barley, Oats, Chickpea</li>
              <li>Vegetables: Cauliflower, Cabbage, Carrot</li>
              <li>Oilseeds: Mustard, Sunflower</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-purple-700 mb-2">Annual Crops</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Sugarcane (12-18 months)</li>
              <li>Turmeric (8-10 months)</li>
              <li>Banana (10-12 months)</li>
              <li>Papaya (9-10 months)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FarmerDashboard = () => {
  const location = useLocation();
  const [component, setComponent] = useState("dashboard");
  const context = useContext(myContext);
  const { user } = context;
  const navigate = useNavigate();

  useEffect(() => {
    // Extract component from URL path if present
    const path = location.pathname.split("/");
    const lastSegment = path[path.length - 1];

    if (lastSegment && lastSegment !== "dashboard") {
      setComponent(lastSegment);
    }
  }, [location]);

  // Check if user exists and is a farmer
  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user")) || {};
    if (!userObj.uid || userObj.userType !== "farmer") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="sticky top-0 z-10 h-screen">
          <Sidebar activeComponent={component} setComponent={setComponent} />
        </div>

        <div className="flex-1 p-6 ">
          <div className="mb-6">
            <div className="relative rounded-2xl h-48  overflow-hidden shadow-md">
              <img
                src={bannerimg}
                alt="Dashboard Banner"
                className="w-full h-full object-cover opacity-90 saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/80 via-emerald-700/60 to-transparent flex items-center">
                <div className="px-8 w-auto">
                  <h1 className="text-3xl max-w-sm p-2  shadow-lg z-50 backdrop-blur-2xl font-bold text-white">
                    Welcome back, {user?.name || "Farmer"}
                  </h1>
                  <p className="text-emerald-100 mt-1 max-w-xl shadow-sm z-50">
                    Manage your farm, track your crops, and optimize your
                    agricultural activities all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add metrics dashboard to the main dashboard view */}
          {component === "dashboard" && (
            <>
              <MetricsDashboard user={user} />
              <FarmerDash />
            </>
          )}
          {component === "sellRent" && <SellRent />}
          {component === "cropRecommend" && <CropRecommend />}
          {component === "orders" && (
            <UserOrdersTable userEmail={user?.email} />
          )}
          {component === "calendar" && <CropCalendar />}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
