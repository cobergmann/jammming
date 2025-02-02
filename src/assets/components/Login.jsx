import React, { useEffect, useState } from 'react';

const CLIENT_ID = '662b96fda5444781a6ed71144223bd9b';
const REDIRECT_URI = 'http://localhost:5173/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function Login() {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token from URL after redirect
    const hash = window.location.hash;
    if (hash) {
      const tokenFromUrl = new URLSearchParams(hash.replace('#', '?')).get(
        'access_token'
      );
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        localStorage.setItem('spotifyToken', tokenFromUrl); // Store token for later use
        window.location.hash = ''; // Clean URL
      }
    }
  }, []);

  const handleLogin = () => {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' ');
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('spotifyToken');
  };

  return (
    <div>
      {!token ? (
        <button onClick={handleLogin}>Log in with Spotify</button>
      ) : (
        <button onClick={handleLogout}>Log out</button>
      )}
    </div>
  );
}

export default Login;
