import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid } from "@material-ui/core";
import './App.css';
import './styles.css';
import TopTracksResult from './TopTracks';
import TopArtistsResult from './TopArtists';
import TopGenresResult from './TopGenres'
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  // eslint-disable-next-line
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

// https://www.youtube.com/watch?v=prayNyuN3w0&t=1064s
// https://www.youtube.com/watch?v=Xcet6msf3eE&t=2482s
function App() {

  const params = getHashParams();
  const token = params.access_token;
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [topGenres, setTopGenres] = useState([])

  useEffect(() => {
    if (!token) return
    spotifyApi.setAccessToken(token)
  }, [token])

  // Get (recent) top tracks
  useEffect(() => {
    if (!token) return
    if (!topTracks) return setTopTracks([])

    spotifyApi.getMyTopTracks(topTracks).then(response => {
      console.log(response.items)
      setTopTracks(response.items.map(track => {
        return {
          artist: track.artists[0].name,
          title: track.name,
          preview: track.preview_url,
          albumCover: track.album.images[1].url,
        }
      }))
    })
  }, [topTracks, token])

  // Get (recent) top artists
  useEffect(() => {
    if (!token) return
    if (!topArtists) return setTopArtists([])

    spotifyApi.getMyTopArtists(topArtists).then(response => {
      console.log(response.items)
      setTopArtists(response.items.map(artist => {
        return {
          name: artist.name,
          artistPhoto: artist.images[1].url
        }
      }))
    })
  }, [topArtists, token])

  // Every artist contains a genre element
  useEffect(() => {
    if (!token) return
    if (!topGenres) return setTopGenres([])

    spotifyApi.getMyTopArtists(topGenres).then(response => {
      // console.log(response.items[0].genres)
      const genres = response.items.map(artist => {
        return {
          genres: artist.genres
        }
      })

      // https://stackoverflow.com/questions/47923791/merging-json-objects-with-same-key-together
      const completeGenresArray = genres.reduce((r, o) => {
        Object.keys(o).forEach(k => {
          r[k] = (r[k] || []).concat(o[k]);
        })
        return r
      }, {})

      // https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
      const genreFrequency = completeGenresArray.genres.reduce(function (obj, val) {
        obj[val] = (obj[val] || 0) + 1
        return obj
      }, {})

      const sortedGenreFrequency = Object.keys(genreFrequency).sort(function (a, b) {
        return genreFrequency[b] - genreFrequency[a]
      })

      setTopGenres(sortedGenreFrequency)
    })
  }, [topGenres, token])

  return (
    <div className="App">
      <a href='http://localhost:8888' > Login to Spotify </a>
      <p>&nbsp;</p>
      <div class='title'>Tastebuds</div>
      <div class='subtitle'>Explore your Spotify listening behaviour</div>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <Tabs>
        <TabList>
          <Tab>Top Tracks</Tab>
          <Tab>Top Artists</Tab>
          <Tab>Top Genres</Tab>
          <Tab>Summary</Tab>
        </TabList>

        {/* <p>&nbsp;</p>
        <button>Recent</button> */}
        <p>&nbsp;</p>

        <TabPanel>
          <Grid container justifyContent='center' alignItems='center' spacing={10} columns={4}>
            {topTracks.map(track => (
              <TopTracksResult
                track={track}
                key={track.uri}
              />
            ))}
          </Grid>
        </TabPanel>

        <TabPanel>
          <Grid container justifyContent='center' alignItems='center' spacing={10} columns={4}>
            {topArtists.map(artist => (
              <TopArtistsResult
                artist={artist}
                key={artist.uri}
              />
            ))}
          </Grid>
        </TabPanel>

        <TabPanel>
          <p>&nbsp;</p>
          <TopGenresResult
            genreList={topGenres}
          />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default App;