import mongoose from 'mongoose';
import { changeExt } from 'upath';

const Movie = mongoose.model('Movie');

export const getAllMovies = async (type, year) => {
  let query = {};
  if (type) {
    query.movieTypes = {
      $in: [type]
    };
  }

  if (year) {
    query.year = year;
  }
  const movies = await Movie.find(query);
  return movies;
};

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({
    doubanId: id
  });
  return movie;
};

export const deletetMovieDetail = async (id) => {
  await Movie.deleteOne({
    doubanId: id
  });
};

export const getRelativeMovies = async (movie) => {
  let query = {
    movieTypes: {
      $in: movie.movieTypes
    }
  };
  let movies = await Movie.find(query);
  return movies;
};
