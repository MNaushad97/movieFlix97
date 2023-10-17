import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";

const MainPageMovies = ({ selectedGenres }) => {
  const generated = [];
  const START_INDEX = 1000; // index number assigned to "first user"
  const INITIAL_ITEM_COUNT = 10; //size of array --->total 10 users 0-9 only | 10009 will be "last user"

  const [year, setYear] = useState(2011); // Start from 2012
  const [prevYear, setPrevYear] = useState(2011); // Start from 2012

  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState([]);

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const endOfTheYearRef = useRef(null);

  const [dataFetchedByGenre, setDataFetchedByGenre] = useState([]);

  const [isGenreActive, setIsGenreActive] = useState(false);
  //const [page, setPage] = useState(1);
  let pageRef = useRef(1);
  let prevDataRef = useRef();

  const fetchMovies = async (movieYear, type, index) => {
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
        const a = data.results;
        console.log("added prev:", movieYear, "-->", a);
        setPrevYear(movieYear);
        return data?.results;
      } else if (type === "nextYear") {
        setNextMovieList((prev) => [...prev, data.results]);
        setYear(movieYear);
      } else if (type === "initialLoad") {
        setNextMovieList([data?.results]);
        setYear(movieYear + 1);
      }
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };
  const fetchMoviesByGenre = useCallback(
    async (listOfGenres, type, pageNumber) => {
      console.log(
        type,
        "fetchMoviesByGenre:",
        "\n pageNumber:",
        pageNumber,
        listOfGenres
      );
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

        console.log(type, "\n \n fetchMoviesByGenre response:", data);
        if (type === "initialGenreLoad") {
          console.log(type, "i am in");

          setDataFetchedByGenre([data?.results]);
          pageRef.current = pageNumber;
        } else if (type === "loadMoreGenreMovies") {
          console.log(type, "i am in");
          setDataFetchedByGenre((prev) => [...prev, data?.results]);
          pageRef.current = pageNumber;

          //setPage((page) => page + 1);
        }
      } catch (error) {
        console.error(error);
        // Handling the error
      } finally {
      }
    },
    []
  );

  useEffect(() => {
    console.log("selectedGenres:", selectedGenres);
    if (selectedGenres.length > 0) {
      setDataFetchedByGenre([]);
      setIsGenreActive(true);
      pageRef.current = 1;

      //setPage(1);
      const result = selectedGenres.join(",");
      console.log("response", result);
      setTimeout(() => {
        fetchMoviesByGenre(result, "initialGenreLoad", 1);
      }, 500);
    } else {
      pageRef.current = 1;

      //setPage(1);
      setIsGenreActive(false);
    }
  }, [fetchMoviesByGenre, selectedGenres]);

  const getMovies = async (index, i) => {
    if (!generated[index]) {
      generated[index] = fetchMovies(prevYear - i, "prevYear", index);
    }
    console.log("generated[index]:", generated[index]);
    return await generated[index];
  };

  function generateMovies(length, startIndex = 0) {
    return Array.from({ length }).map((_, i) => getMovies(i + startIndex, i));
    /*
  The first parameter (represented by _) is a placeholder for the current element in the array.
   Since we're not interested in the values of the array elements (they are all undefined),
    we use _ as a conventional way to indicate that we're not using this parameter.

i: The second parameter (represented by i) is the index of the current element in the array. 
It represents the position of the element in the array.

as fisrt element is at 10000 and usersToPrepend =2
which means 9998 will be our new first ele and it will be till 9999 as added (0-1)
  
  */
  }
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

  const loadMoreGenreMovies = useCallback(() => {
    const result = selectedGenres.join(",");

    console.log("loadMoreGenreMovies selectedGenres:", selectedGenres, result);
    fetchMoviesByGenre(result, "loadMoreGenreMovies", pageRef.current + 1);
  }, [fetchMoviesByGenre, selectedGenres]);

  const prependItems = useCallback(() => {
    const movieListToPrepend = 2;
    const nextFirstItemIndex = firstItemIndex - movieListToPrepend;
    // Fetch and prepend movies for the previous year
    // Update the firstItemIndex to reflect the change in data structure

    setTimeout(() => {
      setFirstItemIndex(() => nextFirstItemIndex);
      setNextMovieList(() => [
        ...generateMovies(movieListToPrepend, nextFirstItemIndex),
        ...nextMovieList,
      ]);
    }, 500);

    return false;
  }, [firstItemIndex, setFirstItemIndex, fetchMovies]);

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
          {Array.isArray(movieArray) ? (
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
            <div className="movieCard">No Movie Available</div>
          )}
        </div>
      </div>
    );
  };

  const renderGenreMovie = (movieArray, index, style) => {
    console.log("movieArray:", movieArray);
    return (
      <div className="movieWithYearBlock" key={index}>
        {/* <span className="yearHeader">
          {movieArray &&
            movieArray[0] &&
            (movieArray?.[0]?.first_air_date?.split("-")[0] ||
              movieArray?.[0]?.release_date?.split("-")[0])}
        </span> */}
        <div className="movieList">
          {Array.isArray(movieArray) &&
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
            ))}
        </div>
      </div>
    );
  };
  useEffect(() => {
    console.log("dataFetchedByGenre:", dataFetchedByGenre);
  }, [dataFetchedByGenre]);
  return (
    <div className="mainPage">
      {isGenreActive && dataFetchedByGenre.length > 0 && (
        <Virtuoso
          style={{ height: "100vh" }}
          data={dataFetchedByGenre}
          endReached={loadMoreGenreMovies}
          // firstItemIndex={0}
          // overscan={200}
          itemContent={(index, movieArray) => {
            // console.log("dataFetchedByGenre:", movieArray, index);
            return renderGenreMovie(movieArray, index);
          }}
        />
      )}
      {!isGenreActive && (
        <Virtuoso
          style={{ height: "88vh", marginTop: "200px" }}
          data={nextMovieList}
          endReached={loadMore}
          firstItemIndex={firstItemIndex}
          startReached={prependItems}
          initialTopMostItemIndex={1}
          itemContent={(index, movieArray) => {
            console.log("movieArray:", movieArray, index);
            return renderMovieYearBlock(movieArray, index);
          }}
        />
      )}
    </div>
  );
};

export default MainPageMovies;
