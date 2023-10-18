import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";
//"Virtuoso" displays large data sets using virtualized rendering.

const MainPageMovies = ({ selectedGenres, genres }) => {
  const [year, setYear] = useState(2010); // Start from 2010
  const [nextMovieList, setNextMovieList] = useState([]);
  const endOfTheYearRef = useRef(null);

  const [dataFetchedByGenre, setDataFetchedByGenre] = useState([]);
  const [isGenreActive, setIsGenreActive] = useState(false);

  /*
  //this is for prepend logic (in progres...)

  const START_INDEX = 1000; // index number assigned to "first user"
  const INITIAL_ITEM_COUNT = 10;
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  //size of array --->total 10 users 0-9 only | 10009 will be "last user"

  const [prevYear, setPrevYear] = useState(2010); // Start from 2012
  const [prevMovieList, setPrevMovieList] = useState([]);
  */
  const [isLoadingGenreMovie, setIsLoadingGenreMovie] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  let pageRef = useRef(1); //helps in loading movieList by Genre
  const currentYear = new Date().getFullYear();

  //fetching moviesList by year
  const fetchMovies = async (movieYear, type) => {
    setIsLoadingMovie(true);
    if (movieYear > currentYear) {
      return;
    }
    //react app needs to be restarted whenever we change something in .env file
    console.log("type:", type, "movieYear:", movieYear);
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

      if (type === "nextYear") {
        setNextMovieList((prev) => [...prev, data.results]);
        setYear(movieYear);
      } else if (type === "initialLoad") {
        setNextMovieList([data?.results]);
        setYear(movieYear + 1);
      } else if (type === "prevYear") {
        // const a = data.results;
        // console.log("added prev:", movieYear, "-->", a);
        // setPrevYear(movieYear);
        // setPrevYear(data?.results);
      }
    } catch (error) {
      console.error(error);
      // Handling the error
    } finally {
      setIsLoadingMovie(false);
    }
  };

  //fetching moviesList by genre
  const fetchMoviesByGenre = useCallback(
    async (listOfGenres, type, pageNumber) => {
      setIsLoadingGenreMovie(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_genres=${listOfGenres}`
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();

        // console.log(type, data);
        if (type === "initialGenreLoad") {
          setDataFetchedByGenre([data?.results]);
          pageRef.current = pageNumber;
        } else if (type === "loadMoreGenreMovies") {
          setDataFetchedByGenre((prev) => [...prev, data?.results]);
          pageRef.current = pageNumber;
        }
      } catch (error) {
        console.error(error);
        // Handling the error
      } finally {
        setIsLoadingGenreMovie(false);
      }
    },
    []
  );

  //handling here Genre selection,
  useEffect(() => {
    // if no. of genre changed
    if (selectedGenres.length > 0) {
      setDataFetchedByGenre([]);
      setIsGenreActive(true);
      pageRef.current = 1;

      const appendGenreWithComma = selectedGenres.join(",");
      setTimeout(() => {
        fetchMoviesByGenre(appendGenreWithComma, "initialGenreLoad", 1);
      }, 500);
    } else {
      pageRef.current = 1;
      setIsGenreActive(false);
    }
  }, [fetchMoviesByGenre, selectedGenres]);

  //initialLoad
  useEffect(() => {
    //loading initial data from 2010
    if (year === 2010 && !nextMovieList.length) {
      fetchMovies(year, "initialLoad");
    } else if (year < 2013) {
      fetchMovies(year, "nextYear");
    }
  }, [year]);

  const loadMore = useCallback(() => {
    //loads More movie list by year
    fetchMovies(year + 1, "nextYear");
  }, [fetchMovies]);

  const loadMoreGenreMovies = useCallback(() => {
    //loads More movie list by genre
    const appendGenreWithComma = selectedGenres.join(",");
    fetchMoviesByGenre(
      appendGenreWithComma,
      "loadMoreGenreMovies",
      pageRef.current + 1
    );
  }, [fetchMoviesByGenre, selectedGenres]);

  const renderMovieByYearBlock = (movieArray, index, style) => {
    // renders movieBlock (year + movieList) for year
    return (
      <div className="movieWithYearBlock" key={index}>
        <span className="yearHeader">
          {movieArray &&
            movieArray[0] &&
            (movieArray?.[0]?.first_air_date?.split("-")[0] ||
              movieArray?.[0]?.release_date?.split("-")[0])}
        </span>
        <div className="movieList">
          {Array.isArray(movieArray) ? (
            movieArray?.map((movie) => (
              <MovieCard
                key={movie?.id + movie?.title}
                id={movie?.id}
                poster={movie?.poster_path}
                title={movie?.title || movie?.name}
                ref={endOfTheYearRef}
                overview={movie?.overview}
                genres={genres}
                genre_ids={movie?.genre_ids}
              />
            ))
          ) : (
            <div className="movieCard">No Movie Available</div>
          )}
        </div>
      </div>
    );
  };

  const renderMovieByGenre = (movieArray, index, style) => {
    // renders  movieList for genre
    return (
      <div className="movieWithYearBlock" key={index}>
        <div className="movieList">
          {Array.isArray(movieArray) &&
            movieArray?.map((movie) => (
              <MovieCard
                key={movie?.id + movie?.title}
                id={movie?.id}
                poster={movie?.poster_path}
                title={movie?.title || movie?.name}
                ref={endOfTheYearRef}
                overview={movie?.overview}
                genres={genres} //list of fetched genres {id,name}
                genre_ids={movie?.genre_ids} //genreId of movie
              />
            ))}
        </div>
      </div>
    );
  };
  return (
    <div className="mainPage">
      {isGenreActive && dataFetchedByGenre.length > 0 && (
        //if genre is selected render movie by Genre
        <Virtuoso
          style={{ height: "100vh" }}
          data={dataFetchedByGenre}
          endReached={loadMoreGenreMovies} // load data of nextPage as infiniteLoading
          itemContent={(index, movieArray) => {
            return renderMovieByGenre(movieArray, index);
          }}
        />
      )}
      {!isGenreActive && (
        //if genre is not_selected rendering movieBy year
        <Virtuoso
          style={{ height: "88vh", marginTop: "200px" }}
          data={nextMovieList}
          endReached={loadMore}
          initialTopMostItemIndex={2} //changes initial location to particular index
          // firstItemIndex={firstItemIndex}//for changing index when prepend
          //startReached={prependItems} // for prepending list
          itemContent={(index, movieArray) => {
            return renderMovieByYearBlock(movieArray, index);
          }}
        />
      )}
    </div>
  );
};

export default MainPageMovies;
