import { useEffect, useState } from "react";

import "./Genre.css";
const Genres = ({
  // selectedGenres,
  // setSelectedGenres,
  //   genres,
  //   setGenres,
  type,
  setIsGenreActive,
  setDataFetchedByGenre,
  // setPage,
}) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);

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
  const fetchMoviesByGenre = async (listOfGenres) => {
    console.log("listOfGenres:", listOfGenres);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${listOfGenres}`
      );
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("response:", data?.results);
      setDataFetchedByGenre([data?.results]);
    } catch {}
  };
  useEffect(() => {
    console.log("selectedGenres:", selectedGenres);
    if (selectedGenres.length > 0) {
      setIsGenreActive(true);
      const result = selectedGenres.join(",");
      console.log("response", result);
      fetchMoviesByGenre(result);
    } else {
      setIsGenreActive(false);
    }
  }, [selectedGenres]);

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

      console.log(" genres data:", data?.genres);
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
      {console.log("html genres:", genres)}
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
