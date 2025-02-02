import React, { useState } from 'react';

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
    <div>
      {isEditing ? (
        <input
          type="text"
          placeholder="Name your playlist"
          value={playlistName}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>{playlistName}</h2>
      )}
      {playlist.length > 0 ? (
        <ul>
          {playlist.map((track, index) => (
            <li key={index}>
              <h4>{track.title}</h4>
              <p>
                by <strong>{track.artist}</strong> from the album{' '}
                <em>{track.album}</em>
              </p>
              <button type="button" onClick={() => onRemoveFromPlaylist(track)}>
                Remove from playlist
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tracks in playlist</p>
      )}
      <button
        type="button"
        disabled={playlist.length === 0}
        onClick={handleSaveToSpotify}
      >
        Save to Spotify
      </button>
    </div>
  );
}

export default Playlist;
