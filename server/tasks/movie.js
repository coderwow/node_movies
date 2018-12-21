import * as cp from 'child_process';
import mongoose from 'mongoose';

import { resolve } from 'path';

const Movie = mongoose.model('Movie');

(async () => {
  const script = resolve(__dirname, '../crawler/trailer_list');
  const child = cp.fork(script, []);
  let invoked = false; //验证这个进程是否跑起来
  child.on('error', (err) => {
    if (invoked) return;
    invoked = true;
    throw new Error(err);
  });
  child.on('exit', (code) => {
    if (invoked) return;
    invoked = true;
    let err = code === 0 ? null : new Error('EXIT CODE' + code);
    console.log(err);
  });
  child.on('message', (data) => {
    let result = data.result;
    result.forEach(async (item) => {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      });
      if (!movie) {
        movie = new Movie(item);
        await movie.save();
      }
    });
  });
})();
