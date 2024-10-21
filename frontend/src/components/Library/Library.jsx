import React from "react";
import { useState, useEffect } from "react";
import "../../Normalize.css";
import "./Library.css";
import { MangaCard } from "../common/MangaCards/MangaCard";

export const Library = () => {
  // Fetch list of favourites from main.js. Will return a list of objects. Sets favourites to the list and loading to false so the return will render the manga cards.
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const favouritesList = await window.api.getFavourites();
        setFavourites(favouritesList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavourites();
  }, []);

  return (
    // Includes title and MangaCard components
    <section id="library-component">
      <header id="title">
        <h1>Yomu</h1>
      </header>

      {/* sets a loading screen so manga loads after ipc call */}
      {loading && <p>Loading</p>}
      {!loading && (
        <div id="library-container">
          {/* map over all favourites and return MangaCard */}
          {favourites.map((favourite, index) => (
            <MangaCard
              key={index}
              name={favourite.name}
              author={favourite.author}
              image={favourite.image}
            />
          ))}
        </div>
      )}
    </section>
  );
};
