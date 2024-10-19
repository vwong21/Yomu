import React from "react";
import { RiHomeLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import "../../Normalize.css";
import "./Nav.css";

export const Nav = () => {
  return (
    // Nav section containing hamburger icon, home, and extension buttons
    <div id="nav-section">
      <div id="nav-container">
        <RxHamburgerMenu className="nav-icons" />
        <RiHomeLine className="nav-icons" />
        <IoExtensionPuzzleOutline className="nav-icons" />
      </div>
    </div>
  );
};
