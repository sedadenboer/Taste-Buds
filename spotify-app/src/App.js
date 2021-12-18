import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid } from "@material-ui/core";
import './styles.css';
import TopTracksResult from './TopTracks';
import TopArtistsResult from './TopArtists';
import TopGenresResult from './TopGenres'
import Summary from './Summary';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Premade hash parameter function from Spotify API (copied from auth-server/authorization_code index.html)
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams
}

// Merges JSON object values with the same key into an object that holds this key and an array of combined values
// Source: https://stackoverflow.com/questions/47923791/merging-json-objects-with-same-key-together
function mergeObjectValuesSameKey(dataArray) {
  const mergedObject = dataArray.reduce((acc, obj) => {
    Object.keys(obj).forEach(element => {
      acc[element] = (acc[element] || []).concat(obj[element]);
    })
    return acc
  }, {})
  return mergedObject
}

// Sorts an array based on element frequency
// Source: https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
function sortArrayByElementFrequency(array) {
  // Compute number of occurences of each item
  const frequencyArray = Object.create(null)
  array.forEach(item => {
    frequencyArray[item] = (frequencyArray[item] || 0) + 1
  })
  // Sort the array by comparing the counts of two items
  const sortedFrequencyArray = Object.keys(frequencyArray).sort((x, y) => {
    return frequencyArray[y] - frequencyArray[x]
  })
  return sortedFrequencyArray
}

// Wrapper used to fetch metadata and user information from the Spotify API:
// https://github.com/jmperez/spotify-web-api-js
function App() {
  const params = getHashParams();
  const token = params.access_token;
  const [loggedIn, setLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [topGenres, setTopGenres] = useState([])
  const [summaryTracks, setSummaryTracks] = useState([])
  const [summaryArtists, setSummaryArtists] = useState([])
  const [num1ArtistPhoto, setNum1ArtistPhoto] = useState('')

  // Log in if there is an access token
  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token)
      setLoggedIn(true)
    }
  }, [token, loggedIn])

  // Get user profile
  useEffect(() => {
    if (!token) return
    if (!userProfile) return setUserProfile([])

    // Retrieve user profile details
    spotifyApi.getMe().then(response => {
      // Get username and profile picture and update userProfile state
      const userNameAndPhoto = [response.display_name, response.images[0].url]
      setUserProfile(userNameAndPhoto)
    }, err => {
      console.error(err)
    })
    // the following and other Hook useEffect dependency errors can be ignored to prevent too many server requests
    // eslint-disable-next-line 
  }, [token])

  // Get (recent) top tracks
  useEffect(() => {
    if (!token) return
    if (!topTracks) return setTopTracks([])

    // Retrieve user data for Top Tracks page (first 30 items, short term data)
    spotifyApi.getMyTopTracks({ limit: 30, time_range: 'short_term' }).then(response => {
      // Return wanted data for every track and update topTracks state
      setTopTracks(response.items.map(track => {
        return {
          artist: track.artists[0].name,
          title: track.name,
          preview: track.preview_url,
          albumCover: track.album.images[1].url,
        }
      }))

      // Select top 5 tracks for summary page 
      const summaryTrackNames = response.items.slice(0, 5).map(track => {
        // Returns array with objects containing the same key 'title'
        return { title: track.name }
      })
      // Combine all objects with 'title' key into a new object with one array containing all values
      const summaryTrackNamesArray = mergeObjectValuesSameKey(summaryTrackNames)
      // Update summaryTracks state to the combined array of track titles
      setSummaryTracks(summaryTrackNamesArray.title)

    }, err => {
      console.error(err)
    })
    // eslint-disable-next-line
  }, [token])

  // Get (recent) top artists
  useEffect(() => {
    if (!token) return
    if (!topArtists) return setTopArtists([])

    // Retrieve user data for Top Artists page (first 30 items, short term data)
    spotifyApi.getMyTopArtists({ limit: 30, time_range: 'short_term' }).then(response => {
      // Return wanted data for every artist and update topArtists state
      setTopArtists(response.items.map(artist => {
        return {
          name: artist.name,
          artistPhoto: artist.images[1].url
        }
      }))

      // Select top 5 artists for summary page
      const summaryArtistNames = response.items.slice(0, 5).map(artist => {
        // Returns array with objects containing the same key 'name'
        return { name: artist.name }
      })
      // Combine all objects with 'name' key into a new object with one array containing all values
      const summaryArtistNamesArray = mergeObjectValuesSameKey(summaryArtistNames)
      // Update summaryArtists state to the combined array of artist names
      setSummaryArtists(summaryArtistNamesArray.name)

      // Select artist photo of #1 artist for summary artist names
      setNum1ArtistPhoto(response.items[0].images[1].url)

    }, err => {
      console.error(err)
    })
    // eslint-disable-next-line
  }, [token])

  // Get (recent) top genres from top artists endpoint
  useEffect(() => {
    if (!token) return
    if (!topGenres) return setTopGenres([])

    // Retrieve user top artists data (short term data)
    spotifyApi.getMyTopArtists({ time_range: 'short_term' }).then(response => {
      // Save genres element of all artists
      const genres = response.items.map(artist => {
        // Returns an array with objects containing the same 'artistGenres' key and an array of genres as value
        return {
          artistGenres: artist.genres
        }
      })

      // Combine all objects with 'artistGenres' key into a new object with one array containing all values
      const completeGenresObject = mergeObjectValuesSameKey(genres)
      // Take the array of genres, sort it based on genre frequency and update topGenres state
      const sortedGenreFrequency = sortArrayByElementFrequency(completeGenresObject.artistGenres)
      setTopGenres(sortedGenreFrequency)

    }, err => {
      console.error(err)
    })
    // eslint-disable-next-line
  }, [token])

  return (
    <div className="App">
      {/* Login page */}
      {!loggedIn &&
        <div className='login-page'>
          <img src="Spotify_Icon_RGB_Black.png" className='spotify-icon-login' alt="Spotify logo" width="50" height="50" />
          <div className='head'>
            <div className='title'>Tastebuds</div>
            <div className='subtitle'>Explore your recent Spotify listening behaviour</div>
          </div>
          <br></br>
          <br></br>
          <p id='welcome'>Log in to your Spotify account and get insights in your current music taste! </p>
          <div className='login-button'>
            <a className='login' href='http://localhost:8888'> Log in with Spotify </a>
          </div>
          <p id='author'>Made by Seda den Boer</p>
        </div>}

      {/* When the user is logged in */}
      {loggedIn &&
        <div className='loggedin-page'>
          <img src="Spotify_Icon_RGB_Black.png" className='spotify-icon' alt="Spotify logo" width="50" height="50" />
          <div className='user-details'>
            <img id='user-photo' src={userProfile[1]} alt='User photo' />
            <div>Welcome, {userProfile[0]}!</div>
            <a className='logout' href='http://localhost:3000'> Log out </a>
          </div>
          <div className='head'>
            <div className='title'>Tastebuds</div>
            <div className='subtitle'>Explore your recent Spotify listening behaviour</div>
          </div>
          <br></br>
          <br></br>
          <Tabs>
            {/* Displayal of tab row */}
            <TabList>
              <Tab>Top Tracks</Tab>
              <Tab>Top Artists</Tab>
              <Tab>Top Genres</Tab>
              <Tab>Summary</Tab>
            </TabList>
            <br></br>
            <br></br>
            {/* Top Tracks page */}
            <TabPanel>
              <Grid container justifyContent='center' alignItems='center' spacing={8} columns={4}>
                {topTracks.map((track, trackKey) => (
                  < TopTracksResult
                    key={track.id}
                    track={track}
                    ranking={Number(trackKey) + 1}
                  />
                ))}
              </Grid>
            </TabPanel>
            {/* Top Artists page */}
            <TabPanel>
              <Grid container justifyContent='center' alignItems='center' spacing={8} columns={4}>
                {topArtists.map((artist, artistKey) => (
                  <TopArtistsResult
                    key={artist.id}
                    artist={artist}
                    ranking={(Number(artistKey) + 1)}
                  />
                ))}
              </Grid>
            </TabPanel>
            {/* Top Genres page */}
            <TabPanel>
              <TopGenresResult
                genreList={topGenres}
              />
            </TabPanel>
            {/* Summary page */}
            <TabPanel>
              < Summary
                tracks={summaryTracks}
                artists={summaryArtists}
                genreList={topGenres}
                image={num1ArtistPhoto}
              />
            </TabPanel>
          </Tabs>
        </div>}
    </div >
  )
}

export default App;