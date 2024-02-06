// MoviesList.jsx
import React from 'react';

const MoviesList = ({ movies, onDeleteMovie }) => {
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <div>{movie.openingText}</div>
          <div>{movie.releaseDate}</div>
          <button onClick={() => onDeleteMovie(movie.id)}>Delete Movie</button>
        </li>
      ))}
    </ul>
  );
};

export default MoviesList;
