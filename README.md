

# Project proposal

## Goal summary

## Problem statement
Spotify is one of the most popular music streaming platforms. Every year users get their Spotify Wrapped, which shows them which artists, tracks and podcasts defined them that year. As music can be a great indicator of someone's personality, people often get excited to see and share their Spotify wrapped. However, music enthousiasts might want more insights and tools to analyze their listening habits all year long. 


## Solution sketch

This application will make it possible for users to analyze their Spotify listening behaviour all year long. Ideas for possible features are:

### Main feature
* Top tracks, artists, genres, (albums and podcasts). Time frame options are; all data, last year, last month, last week.

![App Screenshot](https://github.com/minprog-platforms/project-sedadenboer/tree/master/doc/base_sketch.jpg?raw=true)


### Additional feature ideas
* Add 30 second snippets of audio to the top tracks and artist when you click them (based on Thirtify app).
* Basic listening statistics and developments in listening behaviour, with regards to the categories mentioned above.
* Playlist genre analysis.
* Save Discover Weekly.
* Select genres and generate a custom playlist.

## Prerequisits
### Data sources
[List any data sources that you will use and whether you will need to transform the data before it is usable for your application. The list should include links to where the data sources can be found (downloaded or accessed via API). If you need to have an account to access the data, make the account now. Often it proves to be harder than expected to access good data.]

For this application I will use the Spotify API which provides endpoints that give access to a lot of information about user profiles, artists, tracks, albums, playlists, etc. For this a Spotify account with a premium subscription is required. When you want to use the Spotify API in a web app, authorization is also needed. Additional information about using the Spotify API can be found here: https://developer.spotify.com/documentation/web-api/ .

### External components
[List the external components (libraries like sqlalchemy or bootstrap) that you need to implement certain features. Include the names, and if the component is not very standard, include a link to its website. Specify what part you need and what for.]

For the layout and displaying the top lists it would probably be easiest to use bootstrap. Additionaly, for extra nice visuals animation frameworks like React Reveal can be used. This will only be implemented if there is enough time.

### Similar web apps
[Include a review of similar web apps, in terms of features and technical aspects: what do they do? how have they implemented it? can you do it in the same way? (Spend a few lines per “competitor”.)]

A similar webapp is musictaste.space.

### Difficulties
[Identify the hardest parts of implementing your application: think of technical problems or limitations that could arise during development and what possibilities you have to overcome these.]

## Authors

- [@sedadenboer](https://www.github.com/sedadenboer)