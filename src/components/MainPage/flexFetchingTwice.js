import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";

import { useOnScreen } from "../../utils/hooks";

const RenderMovieYearBlock = ({ movieArray, key, style }) => {
  console.log("movieArray:", movieArray);
  return (
    <div className="movieWithYearBlock" style={style}>
      <span className="yearHeader">
        {movieArray &&
          (movieArray[0]?.first_air_date?.split("-")[0] ||
            movieArray[0]?.release_date?.split("-")[0])}
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
            />
          ))
        ) : (
          <div>No Movie Available</div>
        )}
      </div>
    </div>
  );
};
const MainPageMovies = () => {
  const [year, setYear] = useState(2012); // Start from 2012
  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState([]);

  const [pageCount, setPageCount] = useState(1);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const [prevDataLoaded, setIsPrevDataLoaded] = useState(false);
  const [isNextDataLoaded, setIsNextDataLoaded] = useState(false);
  const [totalRow, setTotalRow] = useState(2);
  const endOfTheYearRef = useRef(null);
  const startOfTheYearRef = useRef(null);

  const fetchMovies = async (movieYear) => {
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

      setYear((prev) => prev + 1);
      console.log("data:", data?.results);
      return data?.results;
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };

  useEffect(() => {
    if (!nextMovieList.length) {
      console.log("fetchMovies triggered");
      (async () => {
        const arrayOfMovieList = await fetchMovies(2012);

        setNextMovieList([arrayOfMovieList]);
      })();
    }
  }, []);

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <RenderMovieYearBlock
        key={key}
        index={index}
        style={style}
        movieArray={nextMovieList?.[index]}
      />
    );
  };

  function isRowLoaded({ index }) {
    return !!nextMovieList?.[index];
  }

  const handleNewPageLoad = async () => {
    setIsNextPageLoading(true);

    const arrayOfMovieList = await fetchMovies(year);

    console.log("nextMOvieList2:", nextMovieList);
    setNextMovieList((currentRepositories) => [
      ...currentRepositories,
      arrayOfMovieList,
    ]);
    setIsNextPageLoading(false);
    return;
  };
  useEffect(() => {
    console.log("nextMovieList:", nextMovieList);
  }, [nextMovieList]);
  const loadMoreRows = isNextPageLoading ? () => {} : handleNewPageLoad;

  // let item = {};
  // let requestCache = {};
  // const LoadMoreItems = (visibleStartIndex, visibleStopIndex) => {
  //   const key = [visibleStartIndex, visibleStopIndex].join(":"); // 0:10
  //   if (requestCache[key]) {
  //     return;
  //   }
  //   const length = visibleStopIndex - visibleStartIndex;
  //   const visibleRange = [...Array(length).keys()].map(
  //     (x) => x + visibleStartIndex
  //   );
  //   const itemsRetrieved = visibleRange.every((index) => !!items[index]);
  //   if (itemsRetrieved) {
  //     requestCache[key] = key;
  //   }
  //   return fetch(getUrl(length, visibleStartIndex))
  //     .then((response) => response.json())
  //     .then((data) => {
  //       data.records.forEach((city, index) => {
  //         items[index + visibleStartIndex] = city.fields;
  //       });
  //     })
  //     .catch((error) => console.error("Error:", error));
  // };

  if (!nextMovieList?.length) return <span>Loading initial repositories</span>;

  return (
    <div className="mainPage">
      {console.log("html nextMovieList:", nextMovieList)}

      <AutoSizer disableHeight={true}>
        {({ width }) => (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={4}
              >
                {({ onRowsRendered, registerChild }) => (
                  <List
                    autoHeight
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    rowCount={nextMovieList?.length}
                    rowHeight={9999999999}
                    rowRenderer={rowRenderer}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </InfiniteLoader>
            )}
          </WindowScroller>
        )}
      </AutoSizer>
      {isNextPageLoading && <span>loading more repositories..</span>}
    </div>
  );
};

export default MainPageMovies;
