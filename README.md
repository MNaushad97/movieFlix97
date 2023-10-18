

# MovieFlix97


A responsive web application that displays a list of movies from The Movie Database (TMDb) API. The app shows top movies for each year and users can filter by genre.

**used React + React Virtuoso + CSS**


- React Virtuoso helped in virtualized rendering of large data sets. 
- Implemented smooth scrolling behavior to load more movies as the user scrolls in any direction (from 2010 to currentYear)

> [→ about Virtuoso](https://virtuoso.dev/)

> [→ about virtualized rendering](https://betterprogramming.pub/virtualized-rendering-from-scratch-in-react-34c2ad482b16)
  
### →  By default, when a user lands on the page, it displays a list of movies of the year 2012
### →  Load a total of only 20 movies for each year.
### →  User can select one or more genres and the list only display movies of the selected genres.

> Allow the images to load


<span>  <img src="MobileHome.gif" width="156" height="239.28" />  </span>
<img src="SignIn.gif" width="403" height="223" />






-----------------------------------------------------------------------------------------------------------------------------------------------------------

### →  Shows title, image, genre, cast, director, and a short description in a Info-card if user clicks "know more" or "movieCard" which carries 

> Allow the image to load

<img src="DynamicLink.gif" width="403" height="223" />

-----------------------------------------------------------------------------------------------------------------------------------------------------------


> Allow the image to load

![mobile_infoCard_close](https://github.com/MNaushad97/movieFlix97/assets/49271386/71e565e6-1890-42f9-9f15-e81762b5c4f3)

<img src="disneyWebTailer.gif" width="403" height="223" />


> Encountered scroll jitter issues when trying to load the previous year's movie list. To ensure a smoother and more responsive user experience had to optimize the code by streamlining certain logic and reducing unnecessary computations related to the movie list retrieval and rendering. 
