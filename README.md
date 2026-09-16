

# MovieFlix97


A responsive web application that displays a [`virtualized`](https://www.patterns.dev/vanilla/virtual-lists) list of movies from The Movie Database (TMDb) API. The app shows top movies for each year and users can filter by genre.

> Please visit for -> [Live Preview in CodeSandbox](https://nq3lyf.csb.app/)

> <sup>Or you can scroll to GIFs to get a glance</sup>

**used React + React Virtuoso + CSS**


- Enhanced rendering performance by implementing virtualized rendering for large data sets. 
- Implemented smooth scrolling behavior to load more movies as the user scrolls in any direction (from 2010 to currentYear)

<sup> </sup><sup>[About List virtualization](https://www.patterns.dev/vanilla/virtual-lists)</sup><sup> </sup><sup>[About virtualized-rendering](https://betterprogramming.pub/virtualized-rendering-from-scratch-in-react-34c2ad482b16)</sup>


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


Features Covered ✅ :
- Created custom UI components for the app, using React
- Displays a list of movies sorted in descending order of popularity.
- Shows information card for each movieCard.
- Load a total of only 20 movies for each year
- Implemented smooth scrolling behavior
- Implemented virtualised rendering maintaing infinite scroll feel
- Interaction is smooth and doesn’t cause any jitters.
- Allows users to filter movies by genre.
- Multiple Genre selection implemented

- Bidirectional infinite scroll: scrolling up loads previous years (2024, 2023, ...) and scrolling down loads future years.

  
### →  By default, when a user lands on the page, it displays a list of movies of the year 2025


<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_infinite_scroll.gif" width="403" height="223" />


-----------------------------------------------------------------------------------------------------------------------------------------------------------

### →  Shows information card for each movieCard.

> Allow the image to load

<span> <img src="https://github.com/MNaushad97/movieFlix97/blob/main/mobile_infoCard_close.gif" width="156" height="239.28" />  </span>
<img src="https://github.com/MNaushad97/movieFlix97/blob/main/web_infoCard_demo.gif" width="403" height="223" />






-----------------------------------------------------------------------------------------------------------------------------------------------------------





