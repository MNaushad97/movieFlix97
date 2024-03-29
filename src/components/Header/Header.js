import Genres from "../Genre/Genre";
import "./Header.css";

import { useState } from "react";

const Header = ({
  setDataFetchedByGenre,
  selectedGenres,
  setSelectedGenres,
  setGenres,
  genres,
}) => {
  return (
    <div className="headerWithGenre">
      <div className="header">MovieFlix97 </div>
      <div className="genreList">
        <Genres
          type="movie"
          setDataFetchedByGenre={setDataFetchedByGenre}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
        />
      </div>
    </div>
  );
};

export default Header;
