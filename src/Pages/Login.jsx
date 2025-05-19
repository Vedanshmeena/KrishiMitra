import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userId = result.user.uid;

      const userDocRef = doc(fireDB, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userWithType = {
          ...userData,
          uid: userId,
          userType: userData.userType,
        };
        localStorage.setItem("user", JSON.stringify(userWithType));

        // Redirect based on user type
        if (userData.userType === "vendor") {
          navigate("/vendordashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
        {/* Register */}
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
              Welcome to Krishimitra!
            </h4>
            <p className="mb-6 text-gray-500">
              Please sign-in to access your account
            </p>
            <form
              id=""
              className="mb-4"
              action="#"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                >
                  Email or Username
                </label>
                <input
                  type="text"
                  className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-white py-2 px-3 text-sm outline-none focus:border-[#FF5139] focus:bg-white focus:text-gray-600 focus:shadow"
                  id="email"
                  name="email-username"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email or username"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <label
                    className="mb-2 inline-block text-xs font-medium uppercase text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="auth-forgot-password-basic.html"
                    className="cursor-pointer text-[#FF5139] no-underline hover:text-[#FF5139]"
                  >
                    <small>Forgot Password?</small>
                  </a>
                </div>
                <div className="relative flex w-full flex-wrap items-stretch">
                  <input
                    type="password"
                    id="password"
                    className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg-white py-2 px-3 text-sm outline-none focus:border-[#FF5139] focus:bg-white focus:text-gray-600 focus:shadow"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="············"
                  />
                </div>
              </div>
              <div className="mb-4"></div>
              <div className="mb-4">
                <button
                  className="grid w-full cursor-pointer select-none rounded-md border border-[#FF5139] bg-[#FF5139] py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-[#FF5139] hover:bg-white focus:border-[#FF5139] hover:text-black focus:bg-[#FF5139] focus:text-white focus:shadow-none"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className="mb-4 text-center">
              New on Krishimitra?{" "}
              <Link
                to={"/signup"}
                className="cursor-pointer text-[#FF5139] no-underline hover:text-[#FF5139]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
        {/* /Register */}
      </div>
    </div>
  );
};

export default Login;
