import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import MainPageMovies from "./components/MainPage/mainPage";
function App() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

  return (
    <div className="App">
      <Header
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
      />

      <MainPageMovies selectedGenres={selectedGenres} genres={genres} />
    </div>
  );
}

export default App;
