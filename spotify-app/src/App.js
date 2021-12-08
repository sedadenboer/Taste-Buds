import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid } from "@material-ui/core";
import './App.css';
import './styles.css';
import TopTracksResult from './TopTracks';
import TopArtistsResult from './TopArtists';
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

  useEffect(() => {
    if (!token) return
    spotifyApi.setAccessToken(token)
  }, [token])

  // 
  useEffect(() => {
    if (!topTracks) return setTopTracks([])
    if (!token) return

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

  useEffect(() => {
    if (!topArtists) return setTopArtists([])
    if (!token) return

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

  return (
    <div className="App">
      <a href='http://localhost:8888' > Login to Spotify </a>
      <p>&nbsp;</p>
      <Tabs>
        <TabList>
          <Tab>Top Tracks</Tab>
          <Tab>Top Artists</Tab>
          <Tab>Top Genres</Tab>
          <Tab>Summary</Tab>
        </TabList>
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
      </Tabs>
    </div>
  )
}

export default App;