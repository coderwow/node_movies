import { Controller, Get, Delete, Auth } from '../lib/decorator';

import {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies,
  deletetMovieDetail
} from '../service/movie';

@Controller('/api')
export class movieController {
  @Get('/movies')
  async getMovies(ctx, next) {
    const { type, year } = ctx.query;
    const movies = await getAllMovies(type, year);
    ctx.body = {
      data: movies,
      success: true
    };
  }

  @Get('/movie/:id')
  async getMovie(ctx, next) {
    const id = ctx.params.id;
    let movie = await getMovieDetail(id);
    let relativeMovies = await getRelativeMovies(movie);
    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    };
  }

  @Get('/movies/list')
  @Auth
  async getMovies(ctx, next) {
    const { type, year } = ctx.query;
    const movies = await getAllMovies(type, year);
    ctx.body = {
      data: movies,
      success: true
    };
  }

  @Delete('/movie/delete/:id')
  async deleteMovie(ctx, next) {
    const id = ctx.params.id;
    await deletetMovieDetail(id);
    ctx.body = {
      success: true
    };
  }
}
