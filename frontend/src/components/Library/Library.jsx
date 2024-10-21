import React from "react";
import "../../Normalize.css";
import "./Library.css";
import { MangaCard } from "../common/MangaCards/MangaCard";

export const Library = () => {
  return (
    // Includes title and MangaCard components
    <section id="library-component">
      <header id="title">
        <h1>Yomu</h1>
      </header>
      <div id="library-container">
        <MangaCard />
        <MangaCard />
      </div>
    </section>
  );
};
