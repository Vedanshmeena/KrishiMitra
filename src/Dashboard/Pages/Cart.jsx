import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { fireDB } from "../../Firebase/FirebaseConfig";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import loadRazorpay from "../../utils/loadRazorpay";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";

const Cart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);

  const [userData, setUserData] = useState({
    fullName: "",
    streetAddress: "",
    state: "",
    zip: "",
    city: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const buyNow = async () => {
    console.log("🛒 Cart - Starting buyNow process");
    console.log("🛒 Cart - User data:", {
      ...userData,
      email: user.email,
      uid: user.uid
    });
    console.log("�� Cart - Products to order:", cartProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      vendorId: p.vendorId
    })));
    console.log("🛒 Cart - Total amount:", totalAmount);

    if (
      userData.fullName === "" ||
      userData.city == "" ||
      userData.state == "" ||
      userData.streetAddress == "" ||
      userData.zip == ""
    ) {
      console.log("🛒 Cart - Validation failed - missing fields:", 
        Object.entries(userData)
          .filter(([_, value]) => value === "")
          .map(([key]) => key)
      );
      return toast.error("All fields are required");
    }

    var options = {
      key: "rzp_test_kiFCc60mzpGtPq",
      key_secret: "Td5II29r7HfcAXD2EwhsLDAI",
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      order_receipt: "order_rcptid_" + userData.fullName,
      name: "KrishiMitra",
      description: "purchase",
      handler: async function (response) {
        console.log("💳 Payment - Razorpay response received:", response);
        const paymentId = response.razorpay_payment_id;
        
        if (!paymentId) {
          console.error("💳 Payment - Failed - No payment ID received");
          toast.error("Payment failed");
          navigate('/order-status', {
            state: {
              success: false,
              error: "Payment failed. Please try again."
            }
          });
          return;
        }

        try {
          console.log("📝 Order - Creating order document with payment ID:", paymentId);
          
          const orderInfo = {
            cartProducts,
            userData,
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            email: user.email,
            uid: user.uid,
            paymentId,
            status: "pending",
            statusHistory: [
              {
                status: "pending",
                timestamp: new Date().toISOString(),
                note: "Order placed successfully"
              }
            ],
            totalAmount,
            createdAt: serverTimestamp(),
            vendorId: cartProducts[0].vendorId
          };

          console.log("📝 Order - Full order info:", orderInfo);

          // Add order to Firestore
          const orderRef = collection(fireDB, "order");
          const docRef = await addDoc(orderRef, orderInfo);
          const orderId = docRef.id;
          console.log("📝 Order - Created with ID:", orderId);

          // Create order details for vendor and farmer
          const orderDetails = {
            orderId: orderId,
            user: userData,
            products: cartProducts,
            amount: totalAmount,
            status: "pending",
            createdAt: new Date().toISOString(),
            paymentId
          };

          console.log("📝 Order - Details for user documents:", orderDetails);

          // Update vendor's orders
          console.log("👨‍🌾 Vendor - Updating document for vendor:", cartProducts[0].vendorId);
          const vendorDocRef = doc(fireDB, "users", cartProducts[0].vendorId);
          const vendorDoc = await getDoc(vendorDocRef);
          
          if (vendorDoc.exists()) {
            const currentOrders = vendorDoc.data().orders || [];
            console.log("👨‍🌾 Vendor - Current orders count:", currentOrders.length);
            await updateDoc(vendorDocRef, {
              orders: [...currentOrders, orderDetails]
            });
            console.log("👨‍🌾 Vendor - Orders updated successfully");
          }

          // Update farmer's orders and clear cart
          console.log("👨‍🌾 Farmer - Updating document for farmer:", user.uid);
          const farmerDocRef = doc(fireDB, "users", user.uid);
          const farmerDoc = await getDoc(farmerDocRef);
          
          if (farmerDoc.exists()) {
            const currentOrders = farmerDoc.data().orders || [];
            console.log("👨‍🌾 Farmer - Current orders count:", currentOrders.length);
            await updateDoc(farmerDocRef, {
              orders: [...currentOrders, orderDetails],
              cart: []
            });
            console.log("👨‍🌾 Farmer - Orders updated and cart cleared");
          }

          // Clear local cart state
          setCart([]);
          setCartProducts([]);

          console.log("✅ Success - Order process completed");
          toast.success("Order placed successfully!");
          navigate('/order-status', { 
            state: { 
              success: true,
              orderId: orderId
            }
          });

        } catch (error) {
          console.error("❌ Error - Failed to process order:", {
            message: error.message,
            code: error.code,
            stack: error.stack
          });
          toast.error("Failed to process order: " + error.message);
          navigate('/order-status', {
            state: {
              success: false,
              error: "Failed to process order: " + error.message
            }
          });
        }
      },
      "prefill": {
        "name": userData.fullName,
        "email": user.email,
      },
      "theme": {
        "color": "#3399cc"
      }
    };

    try {
      console.log("Initializing Razorpay...");
      await loadRazorpay();
      console.log("Razorpay loaded successfully");
      
      const clicksCollection = collection(fireDB, "Purchaseclicks");
      await addDoc(clicksCollection, { timestamp: serverTimestamp() });
      console.log("Purchase click recorded");
      
      const razorpay = new window.Razorpay(options);
      console.log("Opening Razorpay payment window");
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error("Failed to initialize payment");
      navigate('/order-status', {
        state: {
          success: false,
          error: "Failed to initialize payment. Please try again."
        }
      });
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const couponDoc = await getDoc(doc(fireDB, "coupons", couponInput));
      if (couponDoc.exists()) {
        const couponData = couponDoc.data();
        setCouponDiscount(couponData.value);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponDiscount(0);
        toast.error("Coupon not found");
      }
    } catch (error) {
      console.error("Error applying coupon: ", error);
      toast.error("Error applying coupon");
    }
  };

  useEffect(() => {
    const subtotalAmount = cartProducts.reduce(
      (acc, product) => acc + product.price,
      0
    );
    setSubtotal(subtotalAmount);

    // Calculate total amount after discount
    const discountedAmount =
      subtotalAmount - (subtotalAmount * couponDiscount) / 100;
    setTotalAmount(discountedAmount);
  }, [cartProducts, couponDiscount]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userDoc = await getDoc(doc(fireDB, "users", user.uid)); // Reference to the current user's document
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.cart) {
            setCart(userData.cart);
          }
        }
      } catch (error) {
        console.error("Error fetching cart: ", error);
      }
    };

    fetchCart();
  }, [user.uid]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const productPromises = cart.map(async (productId) => {
          const productDoc = await getDoc(doc(fireDB, "products", productId));
          if (productDoc.exists()) {
            return productDoc.data();
          }
          return null;
        });
        const products = await Promise.all(productPromises);
        setCartProducts(products.filter((product) => product !== null));
      } catch (error) {
        console.error("Error fetching cart products: ", error);
      }
    };

    if (cart.length > 0) {
      fetchCartProducts();
    }
  }, [cart]);

  const EmptyCart = async () => {
    const userRef = doc(fireDB, "users", user.uid);
  
    try {
      await updateDoc(userRef, {
        cart: []
      });
      setCartProducts([])
      toast.success("Cart emptied successfully.");
    } catch (error) {
      console.error("Error emptying cart: ", error);
    }
  };

  return (
    <Layout>
      <div className="my-4">
        <div className="mx-[9rem] my-4">
          <h1 className="text-2xl font-bold">Cart Page</h1>
          <hr className="border my-3" />
        </div>
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">Order Summary</p>
            <p className="text-gray-400">
              Check your items. And select a suitable shipping method.
            </p>

            <div className="mt-8 w-full">
              <button onClick={EmptyCart} className="flex w-full bg-gray-50 rounded-md py-1 text-gray-500 gap-2 items-center justify-center">
                <TrashIcon className="w-4" color="gray" />
                Empty Cart
              </button>
            </div>
            <div className="space-y-3 mt-2 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {cartProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                >
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={product.imageUrl}
                    alt={product.productName}
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">
                      {product.productName.slice(0, 20) + "..."}
                    </span>
                    <span className="float-right text-gray-400">
                      VendorId: {product.vendorId.slice(0, 7)}
                    </span>
                    <p className="text-lg font-bold">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-lg font-medium">Offer And Coupons</p>
            <form className="mt-5">
              <div className="my-4 flex">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="px-6 py-4 w-[22rem] border rounded-l-md"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                  className="px-8 py-2 bg-[#FF5139] w-[10rem] text-white rounded-r-md"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 rounded-lg bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Address Details</p>
            <p className="text-gray-400">
              Complete your order by providing your address details.
            </p>
            <div className="">
              <label
                htmlFor="full-name"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your full name here"
              />
              <label
                htmlFor="street-address"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Street Address
              </label>
              <input
                type="text"
                id="street-address"
                name="streetAddress"
                value={userData.streetAddress}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Street Address"
              />
              <label
                htmlFor="state"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={userData.state}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="State"
              />
              <label
                htmlFor="city"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="city"
              />

              <label
                htmlFor="zip"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                ZIP
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={userData.zip}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="ZIP"
              />
            </div>

            <div>
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Discount</p>
                  <p className="font-semibold text-gray-900">
                    {couponDiscount}%
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Shipping</p>
                  <p className="font-semibold text-gray-900">₹50.00</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={buyNow}
              className="mt-4 mb-8 w-full rounded-md bg-green-600 px-6 py-3 font-medium text-white"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
