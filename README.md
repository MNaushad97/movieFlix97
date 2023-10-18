

# MovieFlix97


A responsive web application that displays a list of movies from The Movie Database (TMDb) API. The app shows top movies for each year and users can filter by genre.

**used React + React Virtuoso + CSS**


- React Virtuoso helped in virtualized rendering of large data sets. 
- Implemented smooth scrolling behavior to load more movies as the user scrolls in any direction (from 2010 to currentYear)

> [→ about Virtuoso](https://virtuoso.dev/)

> [→ about virtualized rendering](https://betterprogramming.pub/virtualized-rendering-from-scratch-in-react-34c2ad482b16)
  
### →  By default, when a user lands on the page, it displays a list of movies of the year 2012


<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_infinite_scroll.gif" width="403" height="223" />

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




> Encountered scroll jitter issues when trying to load the previous year's movie list. To ensure a smoother and more responsive user experience had to optimize the code by streamlining certain logic and reducing unnecessary computations related to the movie list retrieval and rendering. 

Requirements Covered ✅ | Not Covered ⚠️ 🚧
✅ Created custom UI components for the app, using React

✅ Displays a list of movies sorted in descending order of popularity.

✅ Shows information card for each movieCard.
✅ Load a total of only 20 movies for each year
✅ Implemented smooth scrolling behavior
✅ Interaction is smooth and doesn’t cause any jitters.
✅ Allows users to filter movies by genre.
✅ Multiple Genre selection implemented
⚠️ 🚧 Encountered scroll jitter issues while trying to load the previous year's movie list (removed logic )




### How To Run The Project

**Prerequisite:**
 - vs code
 - node v18

**Steps to Run The Project**

1. Open terminal/cmd at project location and run command: `git clone https://github.com/MNaushad97/movieFlix97.git`
2. move to folder movieFlix97 using command: `cd movieFlix97`
3. Make sure you have the .env file intact with `REACT_APP_API_KEY`
4. To install dependencies run command: `npm install`
5. Now run app using command: `npm start`
6. The project will get hosted at url: http: localhost:3000
