import { img_300, unavailable } from "../../Config/config";

import "../MovieCard/movieCard.css";
const DetailsForModal = ({
  moviePoster,
  title,
  overview,
  movieFallUnderGenre,
  castList,
  directorList,
  setIsModalActive,
}) => {
  return (
    <>
      <div
        id="myModal"
        className="modal"
        onClick={() => {
          setIsModalActive(false);
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div>
            <div
              className="close"
              onClick={() => {
                setIsModalActive(false);
              }}
            >
              &times;
            </div>
            <div>
              <div className="upperPartOfInfo">
                <img
                  className="poster"
                  src={moviePoster ? `${img_300}${moviePoster}` : unavailable}
                  alt={title}
                />
                <div className="castListDiv">
                  <h3>Cast</h3>
                  <div className="ActorsName">
                    {castList?.map((d) => {
                      return (
                        <>
                          {" "}
                          <br />• {d?.name}
                          <br />
                          <br />
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>

              {movieFallUnderGenre && (
                <div className="genreOfMovie">
                  {movieFallUnderGenre?.map((g) => {
                    return <div className="genreDiv">{g}</div>;
                  })}
                </div>
              )}
            </div>
            <div className="details_title_overview_directors">
              <h2 className="title">{`${title}`}</h2>{" "}
              <div className="description">{overview}</div>
              <div className="directors">
                <h3>
                  {directorList && directorList.length > 1
                    ? "Directors"
                    : "Director"}
                </h3>
                <div className="directorsName">
                  {directorList?.map((d) => {
                    return <p> {d?.name}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsForModal;
