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

  const [prevDataLoaded, setIsPrevDataLoaded] = useState(false);
  const [isNextDataLoaded, setIsNextDataLoaded] = useState(false);
  const endOfTheYearRef = useRef(null);
  const startOfTheYearRef = useRef(null);

  const shouldLoadPreviousYearsMovies = useOnScreen(startOfTheYearRef, {
    rootMargin: "500px",
    threshold: 0.1,
  });
  const fetchMovies = async (movieYear, type) => {
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

      if (type === "prevYear") {
        console.log("added prev:", [data.results, ...prevMovieList]);
        setPrevMovieList((prev) => [data.results, ...prev]);
        setPrevYear(movieYear);
        setIsPrevDataLoaded(true);
        setIsNextDataLoaded(false);
      } else if (type === "nextYear") {
        console.log("added next:", [...nextMovieList, data.results]);
        setNextMovieList((prev) => [...prev, data.results]);
        setNextYear(movieYear);
        setIsNextDataLoaded(true);
        setIsPrevDataLoaded(false);
      } else if (type === "initialLoad") {
        console.log("added :", data.results);
        setNextMovieList([data.results]);
        setNextYear(movieYear);
        setIsNextDataLoaded(true);
        setIsPrevDataLoaded(false);
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
    console.log("entries:", entries);
    const entry = entries[0];
    if (entry.isIntersecting) {
      // Scrolled down, fetch data for the next year
      console.log("Scrolled down for:", year + 1);
      setYear(year + 1);
      fetchMovies(year + 1, "nextYear");
    }
  };
  const handleScrollUpIntersect = (entries) => {
    const entry = entries[0];
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      // Scrolled down, fetch data for the next year
      console.log("Scrolled up for:", year - 1);
      setYear(year - 1);
      fetchMovies(year + 1, "prevYear");
    }
  };

  useEffect(() => {
    const movieCardsList = document.querySelectorAll(".movieCard");
    const lastCardObserver = new IntersectionObserver(
      handleScrollDownIntersect,
      {
        root: null,
        rootMargin: "70%",
        threshold: 0.1,
      }
    );

    console.log("movieCardsList:", movieCardsList);
    if (movieCardsList.length > 0) {
      const lastMovieCard = movieCardsList[movieCardsList.length - 1];
      lastCardObserver.observe(lastMovieCard);
    }

    return () => {
      lastCardObserver.disconnect();
    };
  }, [movieList, nextMovieList, prevMovieList]);

  useEffect(() => {
    fetchMovies(year, "initialLoad");
  }, []);

  return (
    <div className="mainPage">
      <div className="sentinel" ref={startOfTheYearRef}></div>
    </div>
  );
};

export default MainPageMovies;
