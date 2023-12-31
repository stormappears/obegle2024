import React from "react";
import "./../styles/navbar.css";
import logo from "./../assets/navlogo.png";
import textlogo from "./../assets/navlogotext.png";

function Navbar() {
  return (
    <div className="navbar">
      <div className="nav_logos">
        <img className="nav_logo1_main" src={logo} alt="logo" />
        <img className="nav_logo2_text" src={textlogo} alt="textlogo" />
      </div>

      <div className="nav_text"></div>
    </div>
  );
}

export default Navbar;
