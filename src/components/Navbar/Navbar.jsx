import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
} from "@heroicons/react/16/solid";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  MobileNav,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export function Navbars() {
  const [openNav, setOpenNav] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const logout = () => {
    localStorage.clear("user");
    window.location.href = "/";
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to={"/"}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <HomeIcon className="w-6 h-6" color="lightgray" />
          Home
        </Typography>
      </Link>
      <Link to={"/property"}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <RectangleStackIcon className="w-6 h-6" color="lightgray" />
          Land
        </Typography>
      </Link>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <AcademicCapIcon className="w-6 h-6" color="lightgray" />
        <Link to={"/education"}>Education</Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <GlobeAsiaAustraliaIcon className="w-6 h-6" color="lightgray" />
        <Link to={"/govschemes"}>Govt. Schemes</Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <RectangleGroupIcon className="w-6 h-6" color="lightgray" />
        <Link to={"/insurance"}>Insurance</Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <BuildingStorefrontIcon className="w-6 h-6" color="lightgray" />
        <Link to={"/productServicePage"}>Market</Link>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto w-full px-4 py-2 lg:px-8 lg:py-0">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to={"/"}>
          <img src={logo} alt="" className="h-[5rem] object-cover" />
        </Link>
        <div className="hidden lg:block">{navList}</div>

        {user ? (
          <div className="flex items-center gap-x-1">
            <Button size="sm" className="hidden bg-[#FF5139] lg:inline-block">
              {user.userType === "vendor" ? (
                <Link to={"/Vendordashboard"}>
                  <span>DashBoard</span>
                </Link>
              ) : (
                <Link to={"/dashboard"}>
                  <span>DashBoard</span>
                </Link>
              )}
            </Button>
            <Button
              onClick={logout}
              variant="text"
              size="sm"
              className="hidden lg:inline-block"
            >
              <div>
                <span>Logout</span>
              </div>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-x-1">
            <Button variant="text" size="sm" className="hidden lg:inline-block">
              <Link to={"/login"}>
                <span>Log In</span>
              </Link>
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <Link to={"/signup"}>
                <span>Sign up</span>
              </Link>
            </Button>
          </div>
        )}

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex items-center gap-x-1">
            <Button fullWidth variant="text" size="sm" className="">
              <Link to={"/login"}>
                <span>Log In</span>
              </Link>
            </Button>
            <Button fullWidth variant="gradient" size="sm" className="">
              <Link to={"/signup"}>
                <span>Sign up</span>
              </Link>
            </Button>
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}
