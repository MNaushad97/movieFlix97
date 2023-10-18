

# MovieFlix97


A responsive web application that displays a list of movies from The Movie Database (TMDb) API. The app shows top movies for each year and users can filter by genre.

**used React + React Virtuoso + CSS**


- React Virtuoso helped in virtualized rendering of large data sets. 
- Implemented smooth scrolling behavior to load more movies as the user scrolls in any direction (from 2010 to currentYear)

> [→ about Virtuoso](https://virtuoso.dev/)

> [→ about virtualized rendering](https://betterprogramming.pub/virtualized-rendering-from-scratch-in-react-34c2ad482b16)
  
### →  By default, when a user lands on the page, it displays a list of movies of the year 2012

<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_prevNext_demo.gif" width="403" height="223" />


### →  Load a total of only 20 movies for each year.
### →  User can select one or more genres and the list only display movies of the selected genres.

> Allow the images to load


<span> <img src="https://github.com/MNaushad97/movieFlix97/blob/main/mobile_scroll_genre_demo.gif" width="156" height="239.28" />  </span>
<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_genre_demo.gif" width="403" height="223" />




-----------------------------------------------------------------------------------------------------------------------------------------------------------

### →  Shows title, image, genre, cast, director, and a short description in a Info-card if user clicks "know more" or "movieCard" which carries 

> Allow the image to load

<span> <img src="https://github.com/MNaushad97/movieFlix97/blob/main/mobile_infoCard_close.gif" width="156" height="239.28" />  </span>
<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_infoCard_demo.gif" width="403" height="223" />






-----------------------------------------------------------------------------------------------------------------------------------------------------------

<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_infinite_scroll.gif" width="403" height="223" />



> Encountered scroll jitter issues when trying to load the previous year's movie list. To ensure a smoother and more responsive user experience had to optimize the code by streamlining certain logic and reducing unnecessary computations related to the movie list retrieval and rendering. 
