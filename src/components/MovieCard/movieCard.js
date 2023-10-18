import { forwardRef, useEffect, useState } from "react";
import { img_300, unavailable } from "../../Config/config";

import "./movieCard.css";
import DetailsForModal from "../DetailsForModal/DetailsForModal";
const MovieCard = forwardRef(
  (
    {
      id,
      poster: moviePoster,
      title,
      overview,
      date,
      media_type,
      vote_average,
      genres,
      genre_ids,
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [isLoadingCredits, setIsLoadingCredits] = useState(false);
    const [credits, setCredits] = useState([]);
    const [castList, setCastList] = useState([]);
    const [crewList, setCrewList] = useState([]);
    const [directorList, setDirectorList] = useState([]);

    const [movieFallUnderGenre, setMovieFallUnderGenre] = useState([]);
    console.log("genres:", genres);

    const fetchMoviesCredits = async (movieYear, type, index) => {
      setIsLoadingCredits(true);
      //react app needs to be restarted whenever we change something in .env file
      console.log("type:", type, "movieYear:", movieYear);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("credit data:", data);
        setCastList(data?.cast);
        setCrewList(data?.crew);
      } catch (error) {
        console.error(error);
        // Handling the error
      } finally {
        setIsLoadingCredits(false);
      }
    };
    const handleOnCardClick = () => {
      fetchMoviesCredits();
      setIsModalActive(true);

      let filter = genres
        .filter((genre) => genre_ids.includes(genre.id))
        .map((genre) => genre.name);
      console.log("filter:", filter);
      setMovieFallUnderGenre(filter);
    };

    useEffect(() => {
      console.log("castList:", castList);
      console.log("credits:", credits);
      console.log("crewList:", crewList);
      let directors = crewList?.filter(
        (a) => a.job === "Director" || a.job === "Co-Director"
      );
      console.log("directors:", directors);
      setDirectorList(directors);
    }, [credits, castList, crewList]);
    const toggleExpansion = () => {
      setExpanded(!expanded);
    };

    return (
      <>
        {isModalActive && (
          <DetailsForModal
            moviePoster={moviePoster}
            title={title}
            overview={overview}
            movieFallUnderGenre={movieFallUnderGenre}
            castList={castList}
            directorList={directorList}
            setIsModalActive={setIsModalActive}
          />
        )}
        <div className="movieCard" ref={ref} onClick={handleOnCardClick}>
          <img
            className="poster"
            src={moviePoster ? `${img_300}${moviePoster}` : unavailable}
            alt={title}
          />
          <div className="movie-info">
            <p>{title}</p>
          </div>
          <div className="overview">
            <h3>{title}</h3>
            {expanded ? (
              <div>
                {overview}
                <br />
                <br />
                <button onClick={toggleExpansion}>Read Less</button>
              </div>
            ) : (
              <div>
                {overview.slice(0, 100)} {overview.length > 100 ? "..." : ""}
                <br />
                <br />
                {overview.length > 100 && (
                  <button onClick={toggleExpansion}>Read More...</button>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default MovieCard;
