import React from "react";
import "../../../Normalize.css";
import "./MangaCard.css";

export const MangaCard = () => {
  return (
    <div id="manga-card">
      <div id="card-container">
        <div id="image-container" className="card-container-children">
          <img
            src="https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421582849/naruto-vol-72-9781421582849_lg.jpg"
            alt=""
          />
        </div>

        <div id="text-container" className="card-container-children">
          <p id="manga-title">Naruto</p>
          <p id="manga-description">
            Naruto is an orphan who has a dangerous fox-like entity
          </p>
        </div>
      </div>
    </div>
  );
};
