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

// Premade function from Spotify API authorization code to retrieve a hash parameter
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  // eslint-disable-next-line
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams
}

// Merges JSON object values of the same key into an object that holds this key and an array of combined values
// Source: https://stackoverflow.com/questions/47923791/merging-json-objects-with-same-key-together
function mergeObjectValuesSameKey(dataArray) {
  const mergedObject = dataArray.reduce((r, object) => {
    Object.keys(object).forEach(element => {
      r[element] = (r[element] || []).concat(object[element]);
    })
    return r
  }, {})
  return mergedObject
}

// Sorts an array based on element frequency
// Source: https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
function sortArrayByElementFrequency(array) {
  const frequencyArray = array.reduce(function (obj, val) {
    obj[val] = (obj[val] || 0) + 1
    return obj
  }, {})

  const sortedFrequencyArray = Object.keys(frequencyArray).sort(function (a, b) {
    return frequencyArray[b] - frequencyArray[a]
  })

  return sortedFrequencyArray
}

// The build of this app was inspired by the following video: https://www.youtube.com/watch?v=Xcet6msf3eE&t=2482s
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

  // Login if there is an access token
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

    // Retrieve user top tracks data (first 30 items, short term data)
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
      // Add values of these objects to an array and update summaryTracks state
      const summaryTrackNamesArray = mergeObjectValuesSameKey(summaryTrackNames)
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

    // Retrieve user top artists data (first 30 items, short term data)
    spotifyApi.getMyTopArtists({ limit: 30, time_range: 'short_term' }).then(response => {
      // Return wanted data for every track and update topArtists state
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
      // Add values of these objects to an array and update summaryArtists state
      const summaryArtistNamesArray = mergeObjectValuesSameKey(summaryArtistNames)
      setSummaryArtists(summaryArtistNamesArray.name)

      // Select artist photo of #1 artist for summary artist names
      setNum1ArtistPhoto(response.items[0].images[1].url)

    }, err => {
      console.error(err)
    })
    // eslint-disable-next-line
  }, [token])

  // Every artist contains a genre element
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

      // Add all genres into one array and recreate new object with it
      const completeGenresObject = mergeObjectValuesSameKey(genres)
      // Take the array of genres, sort it based on genre frequency abd update topGenres state
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
        <div class='login-page'>
          <div class='title'>Tastebuds</div>
          <div class='subtitle'>Explore your recent Spotify listening behaviour</div>
          <br></br>
          <br></br>
          <p id='welcome'>Login to your Spotify account and get insights in your current music taste! </p>
          <div className='login-button'>
            <a href='http://localhost:8888'> Login to Spotify </a>
          </div>
          <p id='author'>Made by Seda den Boer</p>
        </div>}
      {/* When the user is logged in */}
      {loggedIn &&
        <div class='loggedin-page'>
          <div class='user-details'>
            <img id='user-photo' src={userProfile[1]} alt='' />
            <div>Welcome, {userProfile[0]}!</div>
          </div>
          <div class='title'>Tastebuds</div>
          <div class='subtitle'>Explore your recent Spotify listening behaviour</div>
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
                {topTracks.map((track, key) => (
                  < TopTracksResult
                    track={track}
                    ranking={Number(key) + 1}
                    key={track.uri}
                  />
                ))}
              </Grid>
            </TabPanel>
            {/* Top Artists page */}
            <TabPanel>
              <Grid container justifyContent='center' alignItems='center' spacing={8} columns={4}>
                {topArtists.map((artist, key) => (
                  <TopArtistsResult
                    artist={artist}
                    ranking={(Number(key) + 1)}
                    key={artist.uri}
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
                key={summaryTracks.uri}
              />
            </TabPanel>
          </Tabs>
        </div>}
    </div >
  )
}

export default App;