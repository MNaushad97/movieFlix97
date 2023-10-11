import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";

const MainPageMovies = () => {
  const [movieList, setMovieList] = useState([]);

  const [year, setYear] = useState(2012); // Start from 2012
  const [numOfPages, setNumOfPages] = useState();
  const observerRef = useRef();

  const fetchMovies = async (year) => {
    //react app needs to be restarted whenever we change something in .env file
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`
      );
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("data:", data);
      setMovieList(data.results);
      setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };
  useEffect(() => {
    // Load initial movies
    fetchMovies(year);
  }, [year]);

  useEffect(() => {
    console.log("movieList changed to :", movieList);
  }, [movieList]);

  return (
    <div className="mainPage">
      <span className="yearHeader">{year}</span>
      <div className="movieList">
        {movieList &&
          movieList.map((movie) => (
            <MovieCard
              key={movie?.id}
              id={movie?.id}
              poster={movie?.poster_path}
              title={movie?.title || movie?.name}
              date={movie?.first_air_date || movie?.release_date}
              media_type={movie?.media_type}
              vote_average={movie?.vote_average}
            />
          ))}
      </div>
    </div>
  );
};

export default MainPageMovies;
