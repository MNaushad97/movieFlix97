import { useEffect, useState } from "react";
import "./App.css";
import Genres from "./components/Genre/Genre";
import Header from "./components/Header/Header";
import MainPageMovies from "./components/MainPage/mainPage";
function App() {
  const [dataFetchedByGenre, setDataFetchedByGenre] = useState([]);
  const [page, setPage] = useState(1);
  const [isGenreActive, setIsGenreActive] = useState(false);

  useEffect(() => {
    console.log("isGenreActive:", isGenreActive);
  }, [isGenreActive]);
  return (
    <div className="App">
      <Header
        setIsGenreActive={setIsGenreActive}
        setDataFetchedByGenre={setDataFetchedByGenre}
      />

      <MainPageMovies
        isGenreActive={isGenreActive}
        dataFetchedByGenre={dataFetchedByGenre}
      />
    </div>
  );
}

export default App;
