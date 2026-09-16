import { useCallback, useEffect, useRef, useState } from "react";
import "./mainPage.css";
import MovieCard from "../MovieCard/movieCard";
import { Virtuoso } from "react-virtuoso";

const INITIAL_YEAR = 2025;
// Pre-load a small window of years so Virtuoso mounts with real data.
// This eliminates the "empty → populated" recalculation that causes jitter.
const PRE_LOAD_BEFORE = 2; // fetch 2023, 2024, 2025 on initial load
const START_YEAR = INITIAL_YEAR - PRE_LOAD_BEFORE; // 2023

// Start firstItemIndex at 200 so we have room to prepend ~200 years (back to ~1823)
// The item at array-index 0 will have logical-index INIT_FIRST_INDEX.
const INIT_FIRST_INDEX = 200;

const MainPageMovies = ({ selectedGenres, genres }) => {
  const [movieList, setMovieList] = useState([]);
  const [firstItemIndex, setFirstItemIndex] = useState(INIT_FIRST_INDEX);

  const minYearRef = useRef(START_YEAR);
  const maxYearRef = useRef(INITIAL_YEAR);

  const [dataFetchedByGenre, setDataFetchedByGenre] = useState([]);
  const [isGenreActive, setIsGenreActive] = useState(false);
  const [isLoadingGenreMovie, setIsLoadingGenreMovie] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);

  const pageRef = useRef(1);
  const isFetchingPrevRef = useRef(false);
  const isFetchingNextRef = useRef(false);
  const currentYear = new Date().getFullYear();

  // ─── API helpers ──────────────────────────────────────────────────────────

  const fetchMoviesForYear = useCallback(async (movieYear) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&sort_by=popularity.desc&primary_release_year=${movieYear}&page=1&vote_count.gte=100`
    );
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data?.results || [];
  }, []);

  const fetchMoviesByGenre = useCallback(
    async (listOfGenres, type, pageNumber) => {
      setIsLoadingGenreMovie(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_genres=${listOfGenres}`
        );
        if (!response.ok) {
          throw new Error(`Network error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (type === "initialGenreLoad") {
          setDataFetchedByGenre([data?.results]);
          pageRef.current = pageNumber;
        } else if (type === "loadMoreGenreMovies" && pageNumber <= data?.total_pages) {
          setDataFetchedByGenre((prev) => [...prev, data?.results]);
          pageRef.current = pageNumber;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingGenreMovie(false);
      }
    },
    []
  );

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setDataFetchedByGenre([]);
      setIsGenreActive(true);
      pageRef.current = 1;
      const joinedGenres = selectedGenres.join(",");
      const timer = setTimeout(() => {
        fetchMoviesByGenre(joinedGenres, "initialGenreLoad", 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      pageRef.current = 1;
      setIsGenreActive(false);
    }
  }, [fetchMoviesByGenre, selectedGenres]);

  // Initial load: fetch START_YEAR … INITIAL_YEAR in parallel (2023, 2024, 2025).
  // Virtuoso only mounts once this data is ready, so it never sees an empty→populated
  // transition — the root cause of the previous jitter.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (movieList.length > 0) return; // StrictMode double-invoke guard

    let isMounted = true;
    setIsLoadingMovie(true);

    const yearsToFetch = Array.from(
      { length: PRE_LOAD_BEFORE + 1 },
      (_, i) => START_YEAR + i
    ); // [2023, 2024, 2025]

    Promise.all(yearsToFetch.map((year) => fetchMoviesForYear(year)))
      .then((results) => {
        if (!isMounted) return;
        const initialList = yearsToFetch.map((year, i) => ({
          year,
          movies: results[i],
        }));
        setMovieList(initialList);
        minYearRef.current = START_YEAR;
        maxYearRef.current = INITIAL_YEAR;
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoadingMovie(false);
      });

    return () => { isMounted = false; };
  }, [fetchMoviesForYear]);

  // ─── Scroll handlers ──────────────────────────────────────────────────────

  // Scroll UP → prepend previous year
  const handleStartReached = useCallback(async () => {
    if (isFetchingPrevRef.current || isGenreActive || minYearRef.current <= 1900) return;

    const prevYear = minYearRef.current - 1;
    isFetchingPrevRef.current = true;
    minYearRef.current = prevYear;

    try {
      const results = await fetchMoviesForYear(prevYear);
      // React 18 auto-batches these two setState calls into one render
      setFirstItemIndex((prev) => prev - 1);
      setMovieList((prev) => [{ year: prevYear, movies: results }, ...prev]);
    } catch (err) {
      console.error(err);
      minYearRef.current = prevYear + 1; // rollback
    } finally {
      isFetchingPrevRef.current = false;
    }
  }, [isGenreActive, fetchMoviesForYear]);

  // Scroll DOWN → append next year
  const handleEndReached = useCallback(async () => {
    if (isFetchingNextRef.current || isGenreActive || maxYearRef.current >= currentYear) return;

    const nextYear = maxYearRef.current + 1;
    isFetchingNextRef.current = true;
    maxYearRef.current = nextYear;

    try {
      const results = await fetchMoviesForYear(nextYear);
      setMovieList((prev) => [...prev, { year: nextYear, movies: results }]);
    } catch (err) {
      console.error(err);
      maxYearRef.current = nextYear - 1; // rollback
    } finally {
      isFetchingNextRef.current = false;
    }
  }, [currentYear, isGenreActive, fetchMoviesForYear]);

  const loadMoreGenreMovies = useCallback(() => {
    const joinedGenres = selectedGenres.join(",");
    fetchMoviesByGenre(joinedGenres, "loadMoreGenreMovies", pageRef.current + 1);
  }, [fetchMoviesByGenre, selectedGenres]);

  // ─── Renderers ────────────────────────────────────────────────────────────

  const renderMovieByYearBlock = (item, index) => {
    const movieArray = item?.movies || [];
    const displayYear = item?.year;

    return (
      <div className="movieWithYearBlock" key={displayYear || index}>
        <span className="yearHeader">{displayYear}</span>
        <div className="movieList">
          {movieArray.length > 0 ? (
            movieArray.map((movie) => (
              <MovieCard
                key={movie?.id + "_" + movie?.title}
                id={movie?.id}
                poster={movie?.poster_path}
                title={movie?.title || movie?.name}
                ref={null}
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

  const renderMovieByGenre = (movieArray, index) => (
    <div className="movieWithYearBlock" key={index}>
      <div className="movieList">
        {Array.isArray(movieArray) &&
          movieArray.map((movie) => (
            <MovieCard
              key={movie?.id + "_" + movie?.title}
              id={movie?.id}
              poster={movie?.poster_path}
              title={movie?.title || movie?.name}
              ref={null}
              overview={movie?.overview}
              genres={genres}
              genre_ids={movie?.genre_ids}
            />
          ))}
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className="mainPage">
        {/* Spinner — only while initial data is loading */}
        {isLoadingMovie && movieList.length < 1 && <div className="loader"></div>}
        {isLoadingGenreMovie && dataFetchedByGenre.length < 2 && <div className="loader"></div>}

        {/* Genre Virtuoso — CSS hidden/shown to preserve scroll position on toggle */}
        <div style={{ display: isGenreActive && dataFetchedByGenre.length > 0 ? "block" : "none" }}>
          <Virtuoso
            style={{ height: "88vh", marginTop: "10vh" }}
            data={dataFetchedByGenre}
            endReached={loadMoreGenreMovies}
            increaseViewportBy={{ top: 0, bottom: 600 }}
            itemContent={(index, movieArray) => renderMovieByGenre(movieArray, index)}
          />
        </div>

        {/* Year Virtuoso:
            - Only mounts when pre-load is complete (movieList.length > 0)
              → Virtuoso never sees an empty→populated transition → NO initial jitter
            - Uses CSS display for genre toggle after first mount → scroll position preserved
            - initialTopMostItemIndex scrolls instantly to 2025 (array index PRE_LOAD_BEFORE)
            - firstItemIndex starts at INIT_FIRST_INDEX (200) for smooth prepend support */}
        {movieList.length > 0 && (
          <div style={{ display: !isGenreActive ? "block" : "none" }}>
            <Virtuoso
              style={{ height: "88vh", marginTop: "10vh" }}
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={PRE_LOAD_BEFORE}
              data={movieList}
              startReached={handleStartReached}
              endReached={handleEndReached}
              followOutput={false}
              increaseViewportBy={{ top: 0, bottom: 600 }}
              itemContent={(index, item) => renderMovieByYearBlock(item, index)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MainPageMovies;
