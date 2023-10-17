import { useEffect, useState } from "react";

import "./Genre.css";
const Genres = ({
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  type,
  setIsGenreActive,
  setDataFetchedByGenre,
  // setPage,
}) => {
  const handleAdd = (genre) => {
    // setSelectedGenres([...selectedGenres, genre]);
    // setGenres(genres.filter((g) => g.id !== genre.id));
    // setPage(1);
    console.log("genre:", genre);
    if (selectedGenres.length == 0) {
      setSelectedGenres((prev) => [...prev, genre.id]);
    } else {
      if (selectedGenres.includes(genre.id)) {
        selectedGenres.forEach((id, idx) => {
          if (id == genre.id) {
            let list = [...selectedGenres];

            list.splice(idx, 1);
            setSelectedGenres(list);
          }
        });
      } else {
        setSelectedGenres((prev) => [...prev, genre.id]);
      }
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      // console.log(" genres data:", data?.genres);
      setGenres([...data?.genres]);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };

  useEffect(() => {
    fetchGenres();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {genres?.map((genre) => (
        <div
          key={genre.id}
          className={`genreTag ${
            selectedGenres.includes(genre.id) ? "selected" : ""
          }`}
          onClick={() => handleAdd(genre)}
        >
          {genre.name}
        </div>
      ))}
    </>
  );
};

export default Genres;
