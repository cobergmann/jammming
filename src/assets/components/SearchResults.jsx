import React from 'react';

function SearchResults({
  searchResults,
  playlist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}) {
  return (
    <div>
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              <h4>{result.single}</h4>
              <p>
                by <strong>{result.artist}</strong> from the album{' '}
                <em>{result.album}</em>
              </p>
              {playlist.some((item) => item.id === result.id) ? (
                <button type="button" disabled>
                  Added
                </button>
              ) : (
                <button type="button" onClick={() => onAddToPlaylist(result)}>
                  Add to playlist
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemoveFromPlaylist(result)}
              >
                Remove from playlist
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default SearchResults;
