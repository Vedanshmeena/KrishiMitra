import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { auth, fireDB } from "../Firebase/FirebaseConfig";
// import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    console.log(userType);
  };

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log(userType);
    e.preventDefault();
    try {
      const users = await createUserWithEmailAndPassword(auth, email, password);
      const userId = users.user.uid;

      const user = {
        uid: userId,
        email: users.user.email,
        time: Timestamp.now(),
        userType: userType,
      };

      const userRef = doc(fireDB, "users", userId);
      await setDoc(userRef, user);

      setEmail("");
      setPassword("");
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user type
      if (userType === "vendor") {
        navigate("/vendordashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center text-gray-600">
      <div className="relative">
        {/* Background Patterns */}
        <div className="hidden sm:block h-56 w-56 text-red-200 absolute -z-10 -left-20 -top-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="a"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
                patternTransform="scale(0.6) rotate(0)"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path
                  d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                  strokeWidth="1"
                  stroke="none"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="800%"
              height="800%"
              transform="translate(0,0)"
              fill="url(#a)"
            />
          </svg>
        </div>
        <div className="hidden sm:block h-28 w-28 text-red-200 absolute -z-10 -right-20 -bottom-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="b"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
                patternTransform="scale(0.5) rotate(0)"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path
                  d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                  strokeWidth="1"
                  stroke="none"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width="800%"
              height="800%"
              transform="translate(0,0)"
              fill="url(#b)"
            />
          </svg>
        </div>
        {/* Signup */}
        <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
          <div className="flex-auto p-6">
            {/* Logo */}
            <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
              <Link
                to={"/"}
                className="flex cursor-pointer items-center gap-2 text-[#FF5139] no-underline hover:text-[#FF5139]"
              >
                <img src={logo} alt="" className="h-[4rem]" />
              </Link>
            </div>
            {/* /Logo */}
            <h4 className="mb-2 font-medium text-gray-700 xl:text-xl">
              Join Krishimitra!
            </h4>
            <p className="mb-6 text-gray-500">
              Please create an account to get started
            </p>
            <form className="mb-4" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-white py-2 px-3 text-sm outline-none focus:border-[#FF5139] focus:bg-white focus:text-gray-600 focus:shadow"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 inline-block text-xs font-medium uppercase text-gray-700">
                  User Type
                </label>

                <div className="flex gap-x-4">
                  <div className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                    <input
                      type="radio"
                      id="farmer"
                      name="user-type"
                      value="farmer"
                      checked={userType === "farmer"}
                      onChange={handleUserTypeChange}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="farmer"
                      className="peer-checked:border-red-200 peer-checked:bg-red-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                    >
                      {" "}
                    </label>
                    <div className="peer-checked:border-transparent peer-checked:bg-red-200 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 ring-red-200 ring-offset-2"></div>
                    <span className="pointer-events-none z-10">Farmer</span>
                  </div>
                  <div className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                    <input
                      type="radio"
                      id="vendor"
                      name="user-type"
                      value="vendor"
                      checked={userType === "vendor"}
                      onChange={handleUserTypeChange}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="vendor"
                      className="peer-checked:border-red-200 peer-checked:bg-red-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                    >
                      {" "}
                    </label>
                    <div className="peer-checked:border-transparent peer-checked:bg-red-200 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 ring-red-200 ring-offset-2"></div>
                    <span className="pointer-events-none z-10">Vendor</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-white py-2 px-3 text-sm outline-none focus:border-[#FF5139] focus:bg-white focus:text-gray-600 focus:shadow"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-white py-2 px-3 text-sm outline-none focus:border-[#FF5139] focus:bg-white focus:text-gray-600 focus:shadow"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                />
              </div>
              <div className="mb-4">
                <button
                  onClick={handleSubmit}
                  className="grid w-full cursor-pointer select-none rounded-md border border-[#FF5139] bg-[#FF5139] py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-[#FF5139] hover:bg-white focus:border-[#FF5139] hover:text-black focus:bg-[#FF5139] focus:text-white focus:shadow-none"
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </form>
            <p className="mb-4 text-center">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="cursor-pointer text-[#FF5139] no-underline hover:text-[#FF5139]"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        {/* /Signup */}
      </div>
    </div>
  );
};

export default Signup;
