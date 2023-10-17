import { forwardRef, useState } from "react";
import { img_300, unavailable } from "../../Config/config";
import "./movieCard.css";
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
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
      setExpanded(!expanded);
    };

    return (
      <div className="movieCard" ref={ref}>
        <img
          className="poster"
          src={moviePoster ? `${img_300}${moviePoster}` : unavailable}
          alt={title}
        />
        <div className="movie-info">
          <p>{title}</p>
        </div>
        {/* <div class="overview">
          <h3>Overview</h3>
          {overview}
          <br />
        </div> */}
        <div className="overview">
          <h3>Overview</h3>
          {expanded ? (
            <div>
              {overview}
              <br />
              <br />
              <button onClick={toggleExpansion}>Read Less</button>
            </div>
          ) : (
            <div>
              {overview.slice(0, 100)}... <br />
              <br />
              {/* Display only the first 100 characters */}
              {overview.length > 100 && (
                <button onClick={toggleExpansion}>Read More...</button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MovieCard;
