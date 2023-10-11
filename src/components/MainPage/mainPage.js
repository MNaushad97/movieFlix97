import { useEffect, useState } from "react";

const MainPageMovies = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const fetchMovies = async () => {
    //react app needs to be restarted whenever we change something in .env file
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("data:", data);
      setContent(data.results);
      setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <span className="pageTitle">Discover Movies</span>

      <div className="trending">
        {content &&
          content.map((movie) => <div>`${movie?.title || movie?.name}`</div>)}
      </div>
    </div>
  );
};

export default MainPageMovies;
