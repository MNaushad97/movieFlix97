import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";

const MainPageMovies = () => {
  const START_INDEX = 10000; // index number assigned to "first user"
  const INITIAL_ITEM_COUNT = 10; //size of array --->total 10 users 0-9 only | 10009 will be "last user"
  const generated = [];
  const newArray = Array.from({ length: 11 }, () => []);
  const [year, setYear] = useState(2011); // Start from 2012
  const [prevYear, setPrevYear] = useState(2011); // Start from 2012

  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState(newArray);

  const [firstItemIndex, setFirstItemIndex] = useState(11);

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
        let newAdd = [...nextMovieList];
        newAdd.map((a, i) => {
          if (i === firstItemIndex) {
            return data?.results;
          }
        });
        console.log("updated:", newAdd);
        setPrevMovieList(newAdd);
        setPrevYear(movieYear);

        setFirstItemIndex((prevIndex) => prevIndex - 1);
      } else if (type === "nextYear") {
        console.log("added next:", [...nextMovieList, data.results]);
        let newAdd = [...nextMovieList];
        newAdd.push(data.results);
        console.log("updated:", newAdd, "newAdd:", newAdd);
        setNextMovieList(newAdd);
        setYear(movieYear);
      } else if (type === "initialLoad") {
        console.log("added :", data.results);

        setNextMovieList([...newArray, data?.results]);
        setYear(movieYear + 1);
      }
      //setMovieList(data.results);
      // setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };
  useEffect(() => {
    console.log("prevMovieList:", prevMovieList);
    setNextMovieList(prevMovieList);
  }, [prevMovieList]);

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

  const prependItems = useCallback(() => {
    fetchMovies(prevYear - 1, "prevYear");
    return false;
  }, []);

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
        firstItemIndex={firstItemIndex + 1}
        startReached={prependItems}
        initialTopMostItemIndex={nextMovieList.length}
        itemContent={(index, movieArray) => {
          console.log("movieArray:", movieArray, index);
          return renderMovieYearBlock(movieArray, index);
        }}
      />
    </div>
  );
};

export default MainPageMovies;
