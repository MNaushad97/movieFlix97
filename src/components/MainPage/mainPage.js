import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";

const MainPageMovies = () => {
  const [year, setYear] = useState(2011); // Start from 2012
  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState([]);

  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const endOfTheYearRef = useRef(null);

  const fetchMovies = useCallback(
    async (movieYear, type) => {
      //react app needs to be restarted whenever we change something in .env file
      console.log("movieYear:", movieYear);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&sort_by=popularity.desc&primary_release_year=${movieYear}&page=1&vote_count.gte=100`
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("data:", data);

        if (type === "prevYear") {
          console.log("added prev:", [data.results, ...prevMovieList]);
          setPrevMovieList((prev) => [data.results, ...prev]);
        } else if (type === "nextYear") {
          console.log("added next:", [...nextMovieList, data.results]);
          setNextMovieList((prev) => [...prev, data.results]);
          setYear(movieYear);
        } else if (type === "initialLoad") {
          console.log("added :", data.results);

          setNextMovieList([data.results]);
          setYear(movieYear + 1);
        }
        //setMovieList(data.results);
        // setNumOfPages(data.total_pages);
      } catch (error) {
        console.error(error);
        // Handling the error
      }
    },
    [nextMovieList, prevMovieList]
  );

  useEffect(() => {
    console.log("year:", year);
    if (year === 2011 && !nextMovieList.length) {
      fetchMovies(year, "initialLoad");
    } else if (year < 2013) {
      fetchMovies(year, "nextYear");
    }
  }, [year]);

  const loadMore = useCallback(() => {
    console.log("loadYear:", year + 1);
    fetchMovies(year + 1, "nextYear");
  }, [fetchMovies]);

  useEffect(() => {
    console.log("nextMovieList:", nextMovieList);
  }, [nextMovieList]);

  const renderMovieYearBlock = (movieArray, index, style) => {
    console.log("movieArray:", movieArray);
    return (
      <div className="movieWithYearBlock" key={index}>
        <span className="yearHeader">
          {movieArray &&
            movieArray[0] &&
            (movieArray?.[0]?.first_air_date?.split("-")[0] ||
              movieArray?.[0]?.release_date?.split("-")[0])}
        </span>
        <div className="movieList">
          {movieArray ? (
            movieArray?.map((movie) => (
              <MovieCard
                key={movie?.id + movie?.title}
                id={movie?.id}
                poster={movie?.poster_path}
                title={movie?.title || movie?.name}
                date={movie?.first_air_date || movie?.release_date}
                media_type={movie?.media_type}
                vote_average={movie?.vote_average}
                ref={endOfTheYearRef}
              />
            ))
          ) : (
            <div>No Movie Available</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mainPage">
      <Virtuoso
        style={{ height: "100vh" }}
        data={nextMovieList}
        endReached={loadMore}
        initialTopMostItemIndex={1}
        itemContent={(index, movieArray) => {
          console.log("movieArray:", movieArray, index);
          return renderMovieYearBlock(movieArray, index);
        }}
      />
    </div>
  );
};

export default MainPageMovies;
