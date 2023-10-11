import { img_300, unavailable } from "../../Config/config";
import "./movieCard.css";
const MovieCard = ({
  id,
  poster: moviePoster,
  title,
  date,
  media_type,
  vote_average,
}) => {
  function formatDate(receivedReleasedDate) {
    const inputDate = receivedReleasedDate;
    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so we add 1
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  return (
    <div className="movieCard">
      <img
        className="poster"
        src={moviePoster ? `${img_300}${moviePoster}` : unavailable}
        alt={title}
      />
      <b className="title">{title}</b>
      <span className="releaseDate">
        <span className="releaseDate">{formatDate(date)}</span>
      </span>
    </div>
  );
};

export default MovieCard;
