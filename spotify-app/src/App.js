import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import Spotify from 'spotify-web-api-js'

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function App() {

  const [message, setMessage] = useState("Pending...");

  //const AUTH = "BQD-TOiKfzRz_uAR2gepPmLzaWcOV3ozYIMm1GSdDvCDqtyqRRzijlgLdp5Dbqsye4_QGLFY89tSLbcFQHk-PeZ2ARFO6neBJNAMNxKmacd4kE3BjuCx1cKzhKjvrl_w9Zg9hq_aYdndQWrfZy8XaoNLB2m2KajqutiOi5I4yp_QwrB2gkaFzirPW4M9Qg"

  useEffect(() => {
    const params = getHashParams();

    const access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

    const headers = {
      'Authorization': 'Bearer ' + access_token
    };
    fetch('https://api.spotify.com/v1/me', { headers })
      .then(response => response.json())
      .then(data => console.log(data));
  }, [])

  // npx localtunnel --port=8888
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>

        {/* <a href="/login" class="btn btn-primary">Log in with Spotify</a> */}
        <a href="http://localhost:8888" class="btn btn-primary">Log in with Spotify</a>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
