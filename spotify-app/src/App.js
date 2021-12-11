import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid } from "@material-ui/core";
import './App.css';
import './styles.css';
import TopTracksResult from './TopTracks';
import TopArtistsResult from './TopArtists';
import TopGenresResult from './TopGenres'
import Summary from './Summary';
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
  return hashParams
}

// https://stackoverflow.com/questions/47923791/merging-json-objects-with-same-key-together
function mergeObjectValuesSameKey(object) {
  const mergedArray = object.reduce((r, o) => {
    Object.keys(o).forEach(k => {
      r[k] = (r[k] || []).concat(o[k]);
    })
    return r
  }, {})
  return mergedArray
}

// https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
function sortArrayByElementFrequency(array) {
  // https://stackoverflow.com/questions/34396767/sort-array-by-occurrence-of-its-elements
  const frequencyArray = array.reduce(function (obj, val) {
    obj[val] = (obj[val] || 0) + 1
    return obj
  }, {})

  const sortedFrequencyArray = Object.keys(frequencyArray).sort(function (a, b) {
    return frequencyArray[b] - frequencyArray[a]
  })

  return sortedFrequencyArray
}

// https://www.youtube.com/watch?v=prayNyuN3w0&t=1064s
// https://www.youtube.com/watch?v=Xcet6msf3eE&t=2482s
function App() {

  const params = getHashParams();
  const token = params.access_token;
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [topGenres, setTopGenres] = useState([])
  const [summaryTracks, setSummaryTracks] = useState([])
  const [summaryArtists, setSummaryArtists] = useState([])
  const [num1ArtistPhoto, setNum1ArtistPhoto] = useState('')

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

      // Select top 5 tracks for summary page
      const summaryTrackNames = response.items.slice(0, 5).map(track => {
        return { title: track.name }
      })
      const summaryTrackNamesArray = mergeObjectValuesSameKey(summaryTrackNames)
      setSummaryTracks(summaryTrackNamesArray.title)

    })
  }, [topTracks, summaryTracks, token])

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

      // Select top 5 artists for summary
      const summaryArtistNames = response.items.slice(0, 5).map(artist => {
        return { name: artist.name }
      })
      const summaryArtistNamesArray = mergeObjectValuesSameKey(summaryArtistNames)
      setSummaryArtists(summaryArtistNamesArray.name)

      // Select artist photo of #1 artist for summary artist names
      setNum1ArtistPhoto(response.items[0].images[1].url)

    })
  }, [topArtists, summaryArtists, num1ArtistPhoto, token])

  // Every artist contains a genre element
  useEffect(() => {
    if (!token) return
    if (!topGenres) return setTopGenres([])

    spotifyApi.getMyTopArtists(topGenres).then(response => {
      const genres = response.items.map(artist => {
        return {
          genres: artist.genres
        }
      })

      const completeGenresArray = mergeObjectValuesSameKey(genres)
      const sortedGenreFrequency = sortArrayByElementFrequency(completeGenresArray.genres)
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
            {topTracks.map((track, key) => (
              < TopTracksResult
                track={track}
                ranking={Number(key) + 1}
                key={track.uri}
              />
            ))}
          </Grid>
        </TabPanel>

        <TabPanel>
          <Grid container justifyContent='center' alignItems='center' spacing={10} columns={4}>
            {topArtists.map((artist, key) => (
              <TopArtistsResult
                artist={artist}
                ranking={(Number(key) + 1)}
                key={artist.uri}
              />
            ))}
          </Grid>
        </TabPanel>

        <TabPanel>
          <TopGenresResult
            genreList={topGenres}
          />
          <p>&nbsp;</p>
        </TabPanel>

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
    </div>
  )
}

export default App;