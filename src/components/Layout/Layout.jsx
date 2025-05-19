import React from "react";
import { Footer } from "../Footer/Footer";
import { Navbars } from "../Navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbars />
      <div className="container mx-auto">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
