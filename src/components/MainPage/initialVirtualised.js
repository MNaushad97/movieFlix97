import { useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  WindowScroller,
  IndexRange,
} from "react-virtualized";
const MainPageMovies = (
  itemWidth = 400,
  itemHeight = 360,
  hasMore = false,
  items = [],
  reset = false,
  isFetching = false,
  fetchItems = () => {},
  children
) => {
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
  function getRowsAmount(rowWidth, itemWidth, itemsAmount, hasMore) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(rowWidth, itemWidth);

    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  }
  const classes = useStyles();
  const infiniteLoaderRef = useRef(null);

  useEffect(() => {
    if (reset && infiniteLoaderRef.current) {
      infiniteLoaderRef.current.resetLoadMoreRowsCache(true);
    }
  }, [reset, infiniteLoaderRef]);

  const loadMoreRows = async ({ startIndex, stopIndex }) => {
    if (!isFetching) {
      fetchItems(startIndex, stopIndex);
    }
  };

  const noRowsRenderer = () => <div>No movies found</div>;

  return (
    <div className="mainPage">
      <AutoSizer disableHeight>
        {({ width: rowWidth }) => {
          const rowCount = getRowsAmount(
            rowWidth,
            itemWidth,
            items.length,
            hasMore
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
                    items.length
                  ).length > 0;

                return !hasMore || allItemsLoaded;
              }}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, scrollTop }) => (
                    <List
                      className={classes.grid}
                      autoHeight
                      ref={registerChild}
                      height={height}
                      scrollTop={scrollTop}
                      width={rowWidth}
                      rowCount={rowCount}
                      rowHeight={itemHeight}
                      onRowsRendered={onRowsRendered}
                      rowRenderer={({ index, style, key }) => {
                        const itemsForRow = generateIndexesForRow(
                          index,
                          rowWidth,
                          itemWidth,
                          items.length
                        ).map((itemIndex) => items[itemIndex]);

                        return (
                          <div style={style} key={key} className={classes.row}>
                            {itemsForRow.map((item, itemIndex) => (
                              <Grid
                                item
                                className={classes.gridItem}
                                style={{ width: itemWidth }}
                                key={itemIndex}
                              >
                                {children(item)}
                              </Grid>
                            ))}
                          </div>
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
      </AutoSizer>{" "}
    </div>
  );
};

export default MainPageMovies;
