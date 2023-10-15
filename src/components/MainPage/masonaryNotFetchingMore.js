import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  Masonry,
  WindowScroller,
  createMasonryCellPositioner,
} from "react-virtualized";

import { useOnScreen } from "../../utils/hooks";

const Row = ({ style, repository }) => (
  <div
    className="listItem"
    style={style}
    onClick={() => handleRedirectToRepository(repository.html_url)}
  >
    <span className="repositoryName">{repository.full_name}</span>
    <span>
      (
      <span role="img" aria-label="star emoji">
        ⭐
      </span>
      {repository.stargazers_count})
    </span>
  </div>
);
const handleRedirectToRepository = (repositoryUrl) => {
  window.open(repositoryUrl, "_blank");
};

const MainPageMovies = () => {
  const [year, setYear] = useState(2012); // Start from 2012
  const [prevMovieList, setPrevMovieList] = useState([]);
  const [nextMovieList, setNextMovieList] = useState([]);

  const [pageCount, setPageCount] = useState(1);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const [prevDataLoaded, setIsPrevDataLoaded] = useState(false);
  const [isNextDataLoaded, setIsNextDataLoaded] = useState(false);
  const endOfTheYearRef = useRef(null);
  const startOfTheYearRef = useRef(null);

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
        setIsPrevDataLoaded(true);
        setIsNextDataLoaded(false);
      } else if (type === "nextYear") {
        console.log("added next:", [...nextMovieList, data.results]);
        setPageCount((pageCount) => pageCount + 1);
        setNextMovieList((prev) => [...prev, data.results]);
        setIsNextDataLoaded(true);
        setIsPrevDataLoaded(false);
        setYear(movieYear);
        setIsNextPageLoading(false);
      } else if (type === "initialLoad") {
        console.log("added :", data.results);

        setPageCount((pageCount) => pageCount + 1);
        setNextMovieList([data.results]);
        setIsNextDataLoaded(true);
        setIsPrevDataLoaded(false);
        setYear(movieYear);
      }
      //setMovieList(data.results);
      // setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handling the error
    }
  };

  useEffect(() => {
    fetchMovies(year, "initialLoad");
  }, []);

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
    movieArray,
  }) => {
    return (
      <Row
        key={key}
        index={index}
        style={style}
        repository={movieArray?.[index]}
      />
    );
  };

  function isRowLoaded({ index }) {
    return !!nextMovieList?.[index];
  }

  const handleNewPageLoad = async () => {
    if (isNextPageLoading) {
      return;
    }

    setIsNextPageLoading(true);

    try {
      const response = await fetchMovies(year + 1, "nextYear");
      if (response) {
        setIsNextPageLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsNextPageLoading(false);
    }
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

  const renderMovieYearBlock = (movieArray, key, style) => {
    return (
      <div className="movieWithYearBlock" key={key}>
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
  const cache = new CellMeasurerCache({
    defaultHeight: 400,
    fixedWidth: true,
  });

  const cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: 1, // Adjust the column count as needed
    columnWidth: 800, // Adjust the column width as needed
    spacer: 10, // Adjust the spacer as needed
  });

  const cellRenderer = ({ index, key, parent, style }) => {
    const movieArray = nextMovieList[index];
    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        {({ measure }) => (
          <div style={style}>
            {renderMovieYearBlock(movieArray, key, style)}
          </div>
        )}
      </CellMeasurer>
    );
  };

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
                rowCount={1000}
              >
                {({ onRowsRendered, registerChild }) => (
                  <Masonry
                    autoHeight
                    cellCount={nextMovieList.length}
                    cellMeasurerCache={cache}
                    cellPositioner={cellPositioner}
                    cellRenderer={cellRenderer}
                    height={height}
                    isScrolling={isScrolling}
                    onCellsRendered={({ key, index, style, parent }) => {
                      const movieArray = nextMovieList?.[index];
                      return (
                        <>{renderMovieYearBlock(movieArray, key, style)}</>
                      );
                    }}
                    onScroll={onChildScroll}
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

/*
rowRenderer={({ key, index, style, parent }) => {
                      const movieArray = nextMovieList?.[index];
                      return (
                        <>{renderMovieYearBlock(movieArray, key, style)}</>
                      );
                    }}
*/
