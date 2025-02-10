import React, { useState } from 'react';
import './Playlist.css';

function Playlist({
  playlistName,
  setPlaylistName,
  playlist,
  onRemoveFromPlaylist,
  handleSaveToSpotify,
}) {
  const [isEditing, setIsEditing] = React.useState(true);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleChange = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <div className="playlist-container">
      {isEditing ? (
        <input
          type="text"
          className="playlist-name-input"
          placeholder="Name your playlist"
          value={playlistName}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <h2
          className="playlist-name"
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          {playlistName || <em>Click to name your playlist</em>}
        </h2>
      )}
      {playlist.length > 0 ? (
        <ul className="playlist-tracks">
          {playlist.map((track, index) => (
            <li key={index} className="playlist-track">
              <div className="track-info">
                <span className="song-title">{track.single}</span>
                <span className="song-details">
                  by <strong>{track.artist}</strong> from the album{' '}
                  <em>{track.album}</em>
                </span>
              </div>
              <button
                type="button"
                className="remove-track-button"
                onClick={() => onRemoveFromPlaylist(track)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-tracks-message">No tracks in playlist</p>
      )}
      <button
        type="button"
        className="save-to-spotify-button"
        disabled={playlist.length === 0 || !playlistName}
        onClick={handleSaveToSpotify}
      >
        Save to Spotify
      </button>
    </div>
  );
}

export default Playlist;
