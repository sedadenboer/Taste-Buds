# Assesment
In my application I spend most of the time on the following aspects:

* The visualization of all the different top tracks/artists and the summary

To make sure all top items and components of the summary are aligned nicely I spend extra time on figuring out how to display them. These items include text, images and audio players. For this I used tabs, a grid component, Google Fonts and I defined cards in CSS. These cards are designed in such a way that images are always of the same size and that text of any length can fit on the card without changing the size of the card. Other design details include the stacking of these items when you decrease the window, to make sure the content does not get distorted. Overall, I worked a lot on the design of the app to make it look professional and stick a bit to the original Spotify (Wrapped) theme.

* Figuring out how to work with a server, the Spotify API (data) and Node.js

What took a lot of time is figuring out how to work with the passed on data from the Spotify API after authorization via a server. For this Spotify recommended to use a library wrapper on their guideline website (https://developer.spotify.com/documentation/web-api/libraries/). Eventually I passed on the data with the help of useState and useEffect.

* Creating structure in App.js

In App.js I use useEffect specifically 5 times to aim for the structure that seems logical with the app design. This is as follows: first you will see a login page and after logging in you are directed to a page with a simple displayal of the user profile and tabs containing data. The order of these tabs is 'Top Tracks', 'Top Artists', 'Top Genres', 'Summary'. In my code I tried to stick to this order and these categories with useEffect. The usage of useEffect is as follows, to get: login, user profile, top tracks data for Top Tracks page and Summary page, top artists data for Top Artists page and Summary page, top artists data for Top Genres page and Summary page.
Besides, I chose to work with different js files for the content of the tabs. Otherwise App.js would be very large.