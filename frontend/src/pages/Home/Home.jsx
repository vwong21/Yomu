import React from "react";
import "../../Normalize.css";
import "./Home.css";
import { Nav } from "../../components/Nav/Nav";
import { Library } from "../../components/Library/Library";

export const Home = () => {
  return (
    <div id="app">
      {/* 3 sections, navbar, library, and details */}
      <Nav />
      <Library />
      <section id="details"></section>
    </div>
  );
};
