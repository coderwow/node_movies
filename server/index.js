import Koa from 'koa';
// import views from 'koa-views';
import R from 'ramda';
import path from 'path';
import mongoose from 'mongoose';

import { resolve } from 'path';

import { connect, initSchemas, initAdmin } from './database/init';

const MIDDLEWARES = ['common', 'router', 'parcel'];

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed((initWith) => initWith(app)),
      require,
      (name) => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES);
};

(async () => {
  await connect();
  initSchemas();
  // require('./tasks/movie');
  // require('./tasks/trailer');
  // require('./tasks/api');
  // require('./tasks/qiniu');
  // await initAdmin();

  const app = new Koa();
  await useMiddlewares(app);
  app.listen(2300);
})();

/* app.use(views(path.resolve(__dirname, '../views'), {
    extension: 'ejs'
}))
app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        await ctx.render('index', {
            title: '你好，周杨'
        })
    }
}); */
