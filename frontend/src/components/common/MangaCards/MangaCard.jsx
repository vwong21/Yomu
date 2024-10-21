import React from "react";
import "../../../Normalize.css";
import "./MangaCard.css";

export const MangaCard = ({ name, author, image }) => {
  // Takes name, author, image passed from Library.jsx for the individual manga cards.
  return (
    <div id="manga-card">
      <div id="card-container">
        <div id="image-container" className="card-container-children">
          <img src={image} alt="" />
        </div>

        <div id="text-container" className="card-container-children">
          <p id="manga-title">{name}</p>
          <p id="manga-author">{author}</p>
        </div>
      </div>
    </div>
  );
};
