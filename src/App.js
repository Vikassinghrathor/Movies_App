import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retrying, setRetrying] = useState(false);

  // Define the function before using it
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setRetrying(false); // Reset retrying state if successful
    } catch (error) {
      setError(`Something went wrong! Retrying... (${retryCount})`);
      setRetrying(true);

      // Retry logic with a delay of 5 seconds
      if (retrying && retryCount < 5) {
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
          fetchMoviesHandler();
        }, 5000);
      }
    }

    setIsLoading(false);
  }, [retrying, retryCount]);

  const cancelRetryHandler = () => {
    setRetrying(false);
    setRetryCount(0);
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler, retrying]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        <button onClick={cancelRetryHandler}>Cancel Retry</button>
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={() => fetchMoviesHandler()}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
