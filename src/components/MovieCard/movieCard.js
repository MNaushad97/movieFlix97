import { forwardRef, useEffect, useState } from "react";
import { img_300, unavailable } from "../../Config/config";

import "./movieCard.css";
import DetailsForModal from "../DetailsForModal/DetailsForModal";
const MovieCard = forwardRef(
  ({ id, poster: moviePoster, title, overview, genres, genre_ids }, ref) => {
    const [isModalActive, setIsModalActive] = useState(false);
    const [castList, setCastList] = useState([]);
    const [crewList, setCrewList] = useState([]);
    const [directorList, setDirectorList] = useState([]);
    const [movie_Falls_Under_Genre, setMovie_Falls_Under_Genre] = useState([]);

    const [isLoadingCredits, setIsLoadingCredits] = useState(false);

    //fetching movie's credits (crew + cast)
    const fetchMoviesCredits = async () => {
      setIsLoadingCredits(true);
      //react app needs to be restarted whenever we change something in .env file
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
      setMovie_Falls_Under_Genre(filter);
    };

    useEffect(() => {
      if (crewList) {
        let directors = crewList?.filter(
          (a) => a.job === "Director" || a.job === "Co-Director"
        );
        setDirectorList(directors);
      }
    }, [crewList]);

    return (
      <>
        {isModalActive && (
          //show modal if user clicks "know more" or "movieCard"
          <DetailsForModal
            moviePoster={moviePoster}
            title={title}
            overview={overview}
            movieFallUnderGenre={movie_Falls_Under_Genre}
            castList={castList}
            directorList={directorList}
            setIsModalActive={setIsModalActive}
            key={id}
          />
        )}
        <div className="movieCard" ref={ref} onClick={handleOnCardClick}>
          <img
            className="poster"
            src={moviePoster ? `${img_300}${moviePoster}` : `${unavailable}`}
            alt={title}
          />
          <div className="info_at_glance">
            <div className="movie-info">
              <p>{title}</p>
            </div>
            <div className="overview">
              <h3>{title}</h3>
              {!isModalActive && (
                <div>
                  {overview?.slice(0, 100)}{" "}
                  {overview?.length > 100 ? "..." : ""}
                  <br />
                  <br />
                  {overview?.length > 100 && (
                    <button onClick={handleOnCardClick}>Know More...</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default MovieCard;
