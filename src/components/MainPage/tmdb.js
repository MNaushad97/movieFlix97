import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";

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
function generateIndexesForRow(rowIndex, rowWidth, itemWidth, itemsAmount) {
  const result = [];
  const maxItemsPerRow = getMaxItemsAmountPerRow(rowWidth, itemWidth);
  const startIndex = rowIndex * maxItemsPerRow;

  for (
    let i = startIndex;
    i < Math.min(startIndex + maxItemsPerRow, itemsAmount);
    i++
  ) {
    result.push(i);
  }

  return result;
}
function getMaxItemsAmountPerRow(rowWidth, itemWidth) {
  return Math.max(Math.floor(rowWidth / itemWidth), 1);
}
function getRowsAmount(rowWidth, itemWidth, itemsAmount) {
  const maxItemsPerRow = getMaxItemsAmountPerRow(rowWidth, itemWidth);

  return Math.ceil(itemsAmount / maxItemsPerRow) + 1;
}

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
  const infiniteLoaderRef = useRef(InfiniteLoader);
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
    setIsNextPageLoading(true);
    fetchMovies(year + 1, "nextYear");
    return;
  };
  useEffect(() => {
    console.log("nextMovieList:", nextMovieList);
  }, [nextMovieList]);
  const loadMoreRows = isNextPageLoading ? () => {} : handleNewPageLoad;
  // const loadMoreRows = async (isFetching = false) => {
  //   if (!isFetching) {
  //     fetchMovies(year + 1, "nextYear");
  //   }
  // };

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
  const noRowsRenderer = () => (
    <div>
      <div>No movies found</div>
    </div>
  );

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
  return (
    <div className="mainPage">
      {console.log("html nextMovieList:", nextMovieList)}

      <AutoSizer disableHeight>
        {({ width: rowWidth, height: rowHeight }) => {
          let itemWidth = 400;
          const rowCount = getRowsAmount(
            rowWidth,
            itemWidth,
            nextMovieList.length
          );

          return (
            <InfiniteLoader
              ref={infiniteLoaderRef}
              rowCount={rowCount}
              isRowLoaded={({ index }) => {
                const allItemsLoaded =
                  generateIndexesForRow(
                    index,
                    rowWidth,
                    itemWidth,
                    nextMovieList.length
                  ).length > 0;
                return allItemsLoaded;
              }}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, scrollTop }) => (
                    <List
                      autoHeight
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      height={height}
                      scrollTop={scrollTop}
                      width={rowWidth}
                      rowCount={rowCount}
                      rowHeight={99999}
                      rowRenderer={({ index, style, key }) => {
                        const itemsForRow = generateIndexesForRow(
                          index,
                          rowWidth,
                          itemWidth,
                          nextMovieList.length
                        ).map((itemIndex) => nextMovieList[itemIndex]);

                        return (
                          <>
                            {itemsForRow.map((movieArray, itemIndex) => (
                              <>
                                {renderMovieYearBlock(movieArray, key, style)}
                              </>
                            ))}
                          </>
                        );
                      }}
                      noRowsRenderer={noRowsRenderer}
                    />
                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
      {isNextPageLoading && <span>loading more repositories..</span>}
    </div>
  );
};

export default MainPageMovies;
