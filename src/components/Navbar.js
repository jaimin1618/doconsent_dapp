import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../media/CanvaLogo.png";
import { useNavigate } from "react-router";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="shadow-lg w-full flex items-center justify-around">
      <div className="lg:w-1/2 w-2/3 flex">
        <a href="#" onClick={() => navigate("/")} rel="home">
          <img className="w-2/4" src={Logo} />
        </a>
      </div>
      <div className="bg-blue-500 rounded text-white p-2">
        <a className="" href="#" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {!isMenuOpen ? <MenuIcon /> : <CloseIcon />}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
