import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";

const MainPageMovies = () => {
  const START_INDEX = 10000; // index number assigned to "first user"
  const INITIAL_ITEM_COUNT = 100; //size of array --->total 10 users 0-9 only | 10009 will be "last user"
  const generated = [];

  const [year, setYear] = useState(2011); // Start from 2012
  const [prevYear, setPrevYear] = useState(2011); // Start from 2012

  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState([]);

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const endOfTheYearRef = useRef(null);

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
        //setPrevMovieList([data.results]);
        setPrevYear(movieYear);
        return a;
      } else if (type === "nextYear") {
        console.log("added next:", [...nextMovieList, data.results]);
        setNextMovieList((prev) => [...prev, data.results]);
        setYear(movieYear);
      } else if (type === "initialLoad") {
        console.log("added :", data.results);

        setNextMovieList([data?.results]);
        setYear(movieYear + 1);
      }
      //setMovieList(data.results);
      // setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };
  let newVar = useRef();
  const getMovies = async (index) => {
    if (!generated[index]) {
      generated[index] = await fetchMovies(
        prevYear - 1,
        "prevYear",
        index
      ).then((b) => {
        console.log("b:b", b);
        newVar.current = b;
        console.log("newVar:", newVar.current);
        return b;
      });
    }
    console.log("generated[index]:", generated[index]);
    return generated[index];
  };

  function generateMovies(length, startIndex = 0) {
    // getMovies(startIndex + 1).then(c=>c);
    // console.log("newVar", newVar.current);
    // return newVar.current || [];
    return Array.from({ length }).map((_, i) => {
      //[ _,_ ,_ ,_ ,_ , ]
      if (i > 0) {
        getMovies(i + startIndex, i);
        console.log("newVar", newVar.current);
        return newVar.current;
      }
    });

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

  const prependItems = useCallback(() => {
    const movieListToPrepend = 2;
    const nextFirstItemIndex = firstItemIndex - movieListToPrepend;
    // Fetch and prepend movies for the previous year
    // Update the firstItemIndex to reflect the change in data structure

    setTimeout(() => {
      setFirstItemIndex(() => nextFirstItemIndex);
      setNextMovieList(() => [
        ...generateMovies(movieListToPrepend, nextFirstItemIndex).filter(
          Boolean
        ),
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

  return (
    <div className="mainPage">
      <Virtuoso
        style={{ height: "100vh" }}
        data={nextMovieList}
        endReached={loadMore}
        firstItemIndex={firstItemIndex}
        startReached={prependItems}
        initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
        itemContent={(index, movieArray) => {
          console.log("movieArray:", movieArray, index);
          return renderMovieYearBlock(movieArray, index);
        }}
      />
    </div>
  );
};

export default MainPageMovies;
