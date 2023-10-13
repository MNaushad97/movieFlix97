import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";

import { useOnScreen } from "../../utils/hooks";
const MainPageMovies = () => {
  const [movieList, setMovieList] = useState([]);
  const [year, setYear] = useState(2012); // Start from 2012

  const [prevMovieList, setPrevMovieList] = useState([]);
  const [prevYear, setPrevYear] = useState();

  const [nextMovieList, setNextMovieList] = useState([]);
  const [nextYear, setNextYear] = useState();

  const [isLoadingPrevData, setIsLoadingPrevData] = useState(false);
  const [isLoadingNextData, setIsLoadingNextData] = useState(false);
  const endOfTheYearRef = useRef(null);
  const startOfTheYearRef = useRef(null);

  const shouldLoadNextYearsMovies = useOnScreen(endOfTheYearRef, {
    rootMargin: "500px",
    threshold: 0.1,
  });

  const shouldLoadPreviousYearsMovies = useOnScreen(startOfTheYearRef, {
    rootMargin: "500px",
    threshold: 0.1,
  });
  const fetchMovies = async (
    movieYear,
    isLoadingPrevYear = false,
    isLoadingNextYear = false
  ) => {
    //react app needs to be restarted whenever we change something in .env file
    console.log("year:", movieYear);
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

      if (isLoadingPrevYear) {
        console.log("added prev:", [data.results, ...prevMovieList]);
        setPrevMovieList((prev) => [data.results, ...prev]);
        setPrevYear(movieYear);
        setIsLoadingPrevData(true);
        setIsLoadingNextData(false);
      } else if (isLoadingNextYear) {
        console.log("added next:", [...nextMovieList, data.results]);
        setNextMovieList((prev) => [...prev, data.results]);
        setNextYear(movieYear);
        setIsLoadingNextData(true);
        setIsLoadingPrevData(false);
      } else {
        console.log("added :", data.results);
        setMovieList(data.results);
      }
      //setMovieList(data.results);
      // setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };
  useEffect(() => {
    console.log("MovieList", movieList);
  }, [movieList]);

  const handleScrollDownIntersect = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && shouldLoadNextYearsMovies) {
      // Scrolled down, fetch data for the next year
      console.log("Scrolled down for:", year + 1);
      setYear(year + 1);
      fetchMovies(year + 1, false, true);
    }
  };
  useEffect(() => {
    const sentinelRefCurrent = endOfTheYearRef.current;
    if (!sentinelRefCurrent) return;

    const observer = new IntersectionObserver(handleScrollDownIntersect, {
      root: null,
      rootMargin: "70%",
      threshold: 0.5,
    });

    observer.observe(sentinelRefCurrent);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadNextYearsMovies]);

  // const handleScrollUpIntersect = (entries) => {
  //   const entry = entries[0];
  //   if (entry.isIntersecting && shouldLoadPreviousYearsMovies) {
  //     // Scrolled up, fetch data for the prev year
  //     console.log("Scrolled up for:", year - 1);
  //     setYear(year - 1);
  //     fetchMovies(year - 1, true, false);
  //   }
  // };

  // useEffect(() => {
  //   const sentinelRefCurr = startOfTheYearRef.current;
  //   if (!sentinelRefCurr) return;

  //   const observer = new IntersectionObserver(handleScrollUpIntersect, {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 0.5,
  //   });

  //   observer.observe(sentinelRefCurr);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [shouldLoadPreviousYearsMovies]);

  return (
    <div className="mainPage">
      <div className="sentinel" ref={startOfTheYearRef}></div>
      {isLoadingPrevData &&
        prevMovieList &&
        prevMovieList?.map((movieArray) => {
          return (
            <div className="movieWithYearBlock">
              <span className="yearHeader">
                {movieArray &&
                  movieArray[0] &&
                  (movieArray[0]?.first_air_date?.split("-")[0] ||
                    movieArray[0]?.release_date?.split("-")[0])}
              </span>
              <div className="movieList">
                {movieArray ? (
                  movieArray.map((movie) => (
                    <MovieCard
                      key={movie?.id + movie?.title}
                      id={movie?.id}
                      poster={movie?.poster_path}
                      title={movie?.title || movie?.name}
                      date={movie?.first_air_date || movie?.release_date}
                      media_type={movie?.media_type}
                      vote_average={movie?.vote_average}
                    />
                  ))
                ) : (
                  <div>No Movie Available</div>
                )}
              </div>
            </div>
          );
        })}
      {/* <div className="movieWithYearBlock">
        <span className="yearHeader">{year}</span>
        <div className="movieList">
          {movieList ? (
            movieList.map((movie) => (
              <MovieCard
                key={movie?.id + movie?.title}
                id={movie?.id}
                poster={movie?.poster_path}
                title={movie?.title || movie?.name}
                date={movie?.first_air_date || movie?.release_date}
                media_type={movie?.media_type}
                vote_average={movie?.vote_average}
              />
            ))
          ) : (
            <div>No Movie Available</div>
          )}
        </div>
      </div> */}
      {isLoadingNextData &&
        nextMovieList &&
        nextMovieList?.map((movieArray) => {
          return (
            <div className="movieWithYearBlock">
              <span className="yearHeader">
                {movieArray &&
                  movieArray[0] &&
                  (movieArray[0]?.first_air_date?.split("-")[0] ||
                    movieArray[0]?.release_date?.split("-")[0])}
              </span>
              <div className="movieList">
                {movieArray ? (
                  movieArray.map((movie) => (
                    <MovieCard
                      key={movie?.id + movie?.title}
                      id={movie?.id}
                      poster={movie?.poster_path}
                      title={movie?.title || movie?.name}
                      date={movie?.first_air_date || movie?.release_date}
                      media_type={movie?.media_type}
                      vote_average={movie?.vote_average}
                    />
                  ))
                ) : (
                  <div>No Movie Available</div>
                )}
              </div>
            </div>
          );
        })}
      {/* Sentinel element to trigger data loading */}
      <div className="sentinel" ref={endOfTheYearRef}></div>
    </div>
  );
};

export default MainPageMovies;
