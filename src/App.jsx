import React, { useState } from 'react';

import SearchBar from './assets/components/SearchBar';
import SearchResults from './assets/components/SearchResults';
import Playlist from './assets/components/Playlist';
import Login from './assets/components/Login';
import './styles.css';
import './App.css';

const SEARCH_URL = 'https://api.spotify.com/v1/search';
const REQUEST_TYPE = 'track';
const REQUEST_LIMIT = 10;
const USER_URL = 'https://api.spotify.com/v1/me';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const onSearch = (query) => {
    console.log('Searching for:', query);

    const token = localStorage.getItem('spotifyToken');
    if (!token) {
      return console.error('No token found');
    }
    // TODO: Remove this console.log
    console.log('Token:', token);
    const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&type=${REQUEST_TYPE}&limit=${REQUEST_LIMIT}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.tracks) {
          console.warn('No tracks found');
          setSearchResults([]);
          return;
        }
        console.log('Search results:', data);
        const tracks = data.tracks.items.map((track) => ({
          id: track.id,
          single: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          album: track.album.name,
          uri: track.uri,
        }));
        setSearchResults(tracks);
      })
      .catch((error) => {
        console.error('Error catching Spotify data:', error);
      });
  };

  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const onAddToPlaylist = (track) => {
    if (playlist.some((item) => item.id === track.id)) {
      console.log('Track already in playlist:', track);
      return;
    } else {
      console.log('Adding to playlist:', track);
    }
    setPlaylist([...playlist, track]);
  };
  const onRemoveFromPlaylist = (track) => {
    console.log('Removing from playlist:', track);
    setPlaylist(playlist.filter((item) => item.id !== track.id));
  };

  const handleSaveToSpotify = async () => {
    const token = localStorage.getItem('spotifyToken');

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      // Get the user ID from Spotify
      console.log('Fetching user ID from Spotify...');
      const userResponse = await fetch(USER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        throw new Error(
          `User endpoint failed: ${userResponse.status}: ${userResponse.statusText}`
        );
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      console.log('User ID successfully retrieved:', userId);

      // Create a playlist on Spotify
      console.log('Creating a new playlist on Spotify...');
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            description: "Playlist created by Conrad's Spotify App",
            public: false,
          }),
        }
      );

      if (!playlistResponse.ok) {
        throw new Error(
          `Playlist creation endpoint failed: ${playlistResponse.status}: ${playlistResponse.statusText}`
        );
      }

      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;
      console.log('Playlist created successfully:', playlistId);

      // Add tracks to the playlist on Spotify
      console.log('Adding tracks to the playlist on Spotify...');
      const trackUris = playlist.map((track) => track.uri);
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      if (!addTracksResponse.ok) {
        throw new Error(
          `Add tracks endpoint failed: ${addTracksResponse.status}: ${addTracksResponse.statusText}`
        );
      }

      console.log('Tracks added to playlist successfully');
      // Reset old playlist
      setPlaylist([]);
    } catch (error) {
      console.error('Error saving playlist to Spotify:', error);
      console.error('Error details:', error.message);
    }
  };

  const token = localStorage.getItem('spotifyToken');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Conrad's Playlist Creator</h1>
        <Login />
      </header>
      {token ? (
        <main className="app-main">
          <div className="search-container">
            <SearchBar onSearch={onSearch} />
            <SearchResults
              searchResults={searchResults}
              playlist={playlist}
              onAddToPlaylist={onAddToPlaylist}
              onRemoveFromPlaylist={onRemoveFromPlaylist}
            />
          </div>
          <Playlist
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            playlist={playlist}
            onRemoveFromPlaylist={onRemoveFromPlaylist}
            handleSaveToSpotify={handleSaveToSpotify}
          />
        </main>
      ) : (
        <p>Please log in to create a playlist.</p>
      )}
      <footer className="app-footer">
        <p>Created by Conrad</p>
      </footer>
    </div>
  );
}

export default App;
