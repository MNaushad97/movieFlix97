import Genres from "../Genre/Genre";
import "./Header.css";

import { useState } from "react";

const Header = ({ setIsGenreActive, setDataFetchedByGenre }) => {
  return (
    <div className="headerWithGenre">
      <div onClick={""} className="header">
        MovieFlix97{" "}
      </div>
      <div className="genreList">
        <Genres
          type="movie"
          setIsGenreActive={setIsGenreActive}
          setDataFetchedByGenre={setDataFetchedByGenre}
        />
      </div>
    </div>
  );
};

export default Header;
