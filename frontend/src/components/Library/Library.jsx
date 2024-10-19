import React from "react";
import "../../Normalize.css";
import "./Library.css";

export const Library = () => {
  return (
    // Includes title and MangaCard components
    <section id="library-component">
      <header id="title">
        <h1>Yomu</h1>
      </header>
      <hr />
      <div id="library-container"></div>
    </section>
  );
};
