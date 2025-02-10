import React from 'react';
import './searchResults.css';

function SearchResults({
  searchResults,
  playlist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}) {
  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((track, index) => (
            <li key={index} className="track-item">
              <div className="track-details">
                <span className="song-title">{track.single}</span>
                <span className="song-details">
                  by <strong>{track.artist}</strong> from the album{' '}
                  <em>{track.album}</em>
                </span>
              </div>
              <div className="track-buttons">
                {playlist.some(
                  (playlistTrack) => playlistTrack.id === track.id
                ) ? (
                  <button
                    className="btn added"
                    onClick={() => onRemoveFromPlaylist(track)}
                  >
                    Remove from playlist
                  </button>
                ) : (
                  <button
                    className="btn add"
                    onClick={() => onAddToPlaylist(track)}
                  >
                    Add to playlist
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results">No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
