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
      <div id="library-container">
        <div className="manga-card">Hello World</div>
        <div className="manga-card">Hello World</div>
        <div className="manga-card">Hello World</div>
        <div className="manga-card">Hello World</div>
        <div className="manga-card">Hello World</div>
        <div className="manga-card">Hello World</div>
      </div>
    </section>
  );
};
