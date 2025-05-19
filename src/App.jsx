import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import MyState from "./context/data/myState";
import Property from "./Pages/Property";
import ProductServicePage from "./Pages/ProductServicePage";
import Education from "./Pages/Education";
import Insurance from "./Pages/Insurance";
import GovSchemes from "./Pages/GovSchemes";
import FarmerDashboard from "./Dashboard/Pages/FarmerDashboard";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./Pages/Signup";
import VendorDashboard from "./Dashboard/Pages/VendorDashboard";
import Cart from "./Dashboard/Pages/Cart";
import Chatbot from "./components/Chatbot";
import ChatWelcome from "./components/ChatWelcome";
import { ChatProvider } from "./context/ChatContext";
import OrderStatus from "./Dashboard/Pages/OrderStatus";

function App() {
  return (
    <>
      <MyState>
        <ChatProvider>
          <Router>
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Login />} path="/login" />
              <Route element={<Signup />} path="/signup" />
              <Route element={<Property />} path="/property" />
              <Route element={<Education />} path="/education" />
              <Route element={<GovSchemes />} path="/govschemes" />
              <Route element={<Insurance />} path="/insurance" />
              <Route element={<Cart />} path="/cart" />
              <Route element={<OrderStatus />} path="/order-status" />
              <Route
                element={<ProductServicePage />}
                path="/productServicePage"
              />

              {/* Dashboar */}
              <Route element={<FarmerDashboard />} path="/dashboard" />
              <Route element={<VendorDashboard />} path="/Vendordashboard" />
            </Routes>
            <Chatbot />
            <ChatWelcome />
            <ToastContainer />
          </Router>
        </ChatProvider>
      </MyState>
    </>
  );
}

export default App;
