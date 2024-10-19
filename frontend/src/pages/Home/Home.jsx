import React from "react";
import "../../Normalize.css";
import "./Home.css";
import { Nav } from "../../components/Nav/Nav";

export const Home = () => {
  return (
    <div id="app">
      {/* 3 sections, navbar, library, and details */}
      <Nav />
      <section id="library"></section>
      <section id="details"></section>
    </div>
  );
};
